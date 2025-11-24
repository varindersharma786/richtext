"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import html2canvas from "html2canvas";
import { createClient } from "@/utils/supabase/client";
import Toolbar from "./toolbar";
import CanvasElement from "./canvas-element";
import PropertiesPanel from "./properties-panel";
import { toast } from "sonner";
import SignatureWizard from "./signature-wizard";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconColor?: string;
  backgroundColor?: string;
}

export interface SignatureElement {
  id: string;
  type: "text" | "image" | "social";
  content: string;
  // Legacy fields for backward compatibility or single icon use
  icon?: string;
  url?: string;
  // New field for multi-social
  socialLinks?: SocialLink[];
  // Grouping
  groupId?: string;
  style: React.CSSProperties & {
    padding?: string;
    margin?: string;
    borderRadius?: string;
    backgroundColor?: string;
    fontFamily?: string;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: string;
    objectFit?: "cover" | "contain" | "fill";
    gap?: string; // For social icons
    flexDirection?: "row" | "column"; // For social icons
    zIndex?: number;
  };
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
}

interface AlignmentGuide {
  type: "vertical" | "horizontal";
  position: number;
  start: number;
  end: number;
}

interface DistanceLabel {
  x: number;
  y: number;
  value: number;
  axis: "x" | "y";
}

export default function SignatureBuilder() {
  const [elements, setElements] = useState<SignatureElement[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [savedSignatures, setSavedSignatures] = useState<
    { id: string; name: string }[]
  >([]);
  const [guides, setGuides] = useState<AlignmentGuide[]>([]);
  const [distances, setDistances] = useState<DistanceLabel[]>([]);
  const [containerStyle, setContainerStyle] = useState<React.CSSProperties>({
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "0px",
    borderWidth: "0px",
    borderColor: "#000000",
    borderStyle: "solid",
  });
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  useEffect(() => {
    fetchSavedSignatures();
    const saved = localStorage.getItem("unsavedSignature");
    if (saved) {
      try {
        setElements(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse unsaved signature", e);
      }
    }
  }, []);

  useEffect(() => {
    if (elements.length > 0) {
      localStorage.setItem("unsavedSignature", JSON.stringify(elements));
    }
  }, [elements]);

  const fetchSavedSignatures = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("saved_signatures")
        .select("id, name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setSavedSignatures(data);
    } catch (error) {
      console.error("Error fetching signatures:", error);
    }
  };

  const addElement = (
    type: "text" | "image" | "social",
    preset?: Partial<SignatureElement>
  ) => {
    const newElement: SignatureElement = {
      id: uuidv4(),
      type,
      content:
        type === "text"
          ? "New Text"
          : type === "image"
          ? "https://via.placeholder.com/150"
          : "",
      icon: type === "social" ? "facebook" : undefined,
      url: "",
      socialLinks:
        type === "social"
          ? [
              {
                id: uuidv4(),
                platform: "facebook",
                url: "",
                iconColor: "#1877F2",
              },
              {
                id: uuidv4(),
                platform: "twitter",
                url: "",
                iconColor: "#1DA1F2",
              },
              {
                id: uuidv4(),
                platform: "linkedin",
                url: "",
                iconColor: "#0A66C2",
              },
            ]
          : undefined,
      style: {
        fontSize: "16px",
        color: type === "social" ? "#000000" : "#000000",
        textAlign: "left",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        padding: "0px",
        margin: "0px",
        borderRadius: type === "social" ? "4px" : "0px",
        backgroundColor: "transparent",
        fontFamily: "Arial, sans-serif",
        borderWidth: "0px",
        borderColor: "#000000",
        borderStyle: "solid",
        objectFit: "cover",
        gap: "10px",
        flexDirection: "row",
        zIndex: 1,
        ...preset?.style,
      },
      position: { x: 50, y: 50 },
      size: {
        width: type === "social" ? 150 : 200,
        height: type === "text" ? 50 : type === "social" ? 40 : 100,
      },
      ...preset,
    };
    setElements([...elements, newElement]);
    setSelectedIds([newElement.id]);
  };

  const updateElement = (id: string, updates: Partial<SignatureElement>) => {
    // Handle Group Movement
    const activeEl = elements.find((el) => el.id === id);
    let elementsToUpdate = [id];
    let deltaX = 0;
    let deltaY = 0;

    if (activeEl && activeEl.groupId && updates.position) {
      // If moving a grouped element, move all others in the group
      elementsToUpdate = elements
        .filter((el) => el.groupId === activeEl.groupId)
        .map((el) => el.id);
      deltaX = updates.position.x - activeEl.position.x;
      deltaY = updates.position.y - activeEl.position.y;
    }

    // Intercept position updates for smart snapping (only for the primary dragged element for now)
    if (
      updates.position &&
      selectedIds.includes(id) &&
      elementsToUpdate.length === 1
    ) {
      if (activeEl) {
        const { x, y } = updates.position;
        const w =
          typeof activeEl.size.width === "number"
            ? activeEl.size.width
            : parseInt(activeEl.size.width as string);
        const h =
          typeof activeEl.size.height === "number"
            ? activeEl.size.height
            : parseInt(activeEl.size.height as string);

        let newX = x;
        let newY = y;
        const SNAP_THRESHOLD = 5;
        const newGuides: AlignmentGuide[] = [];
        const newDistances: DistanceLabel[] = [];

        elements.forEach((other) => {
          if (other.id === id) return;

          const otherW =
            typeof other.size.width === "number"
              ? other.size.width
              : parseInt(other.size.width as string);
          const otherH =
            typeof other.size.height === "number"
              ? other.size.height
              : parseInt(other.size.height as string);

          // Horizontal Snapping (aligning X)
          // Left to Left
          if (Math.abs(x - other.position.x) < SNAP_THRESHOLD) {
            newX = other.position.x;
            newGuides.push({
              type: "vertical",
              position: newX,
              start: Math.min(y, other.position.y),
              end: Math.max(y + h, other.position.y + otherH),
            });
          }
          // Left to Right
          if (Math.abs(x - (other.position.x + otherW)) < SNAP_THRESHOLD) {
            newX = other.position.x + otherW;
            newGuides.push({
              type: "vertical",
              position: newX,
              start: Math.min(y, other.position.y),
              end: Math.max(y + h, other.position.y + otherH),
            });
          }
          // Right to Left
          if (Math.abs(x + w - other.position.x) < SNAP_THRESHOLD) {
            newX = other.position.x - w;
            newGuides.push({
              type: "vertical",
              position: newX + w,
              start: Math.min(y, other.position.y),
              end: Math.max(y + h, other.position.y + otherH),
            });
          }
          // Right to Right
          if (Math.abs(x + w - (other.position.x + otherW)) < SNAP_THRESHOLD) {
            newX = other.position.x + otherW - w;
            newGuides.push({
              type: "vertical",
              position: newX + w,
              start: Math.min(y, other.position.y),
              end: Math.max(y + h, other.position.y + otherH),
            });
          }
          // Center to Center
          if (
            Math.abs(x + w / 2 - (other.position.x + otherW / 2)) <
            SNAP_THRESHOLD
          ) {
            newX = other.position.x + otherW / 2 - w / 2;
            newGuides.push({
              type: "vertical",
              position: newX + w / 2,
              start: Math.min(y, other.position.y),
              end: Math.max(y + h, other.position.y + otherH),
            });
          }

          // Vertical Snapping (aligning Y)
          // Top to Top
          if (Math.abs(y - other.position.y) < SNAP_THRESHOLD) {
            newY = other.position.y;
            newGuides.push({
              type: "horizontal",
              position: newY,
              start: Math.min(x, other.position.x),
              end: Math.max(x + w, other.position.x + otherW),
            });
          }
          // Top to Bottom
          if (Math.abs(y - (other.position.y + otherH)) < SNAP_THRESHOLD) {
            newY = other.position.y + otherH;
            newGuides.push({
              type: "horizontal",
              position: newY,
              start: Math.min(x, other.position.x),
              end: Math.max(x + w, other.position.x + otherW),
            });
          }
          // Bottom to Top
          if (Math.abs(y + h - other.position.y) < SNAP_THRESHOLD) {
            newY = other.position.y - h;
            newGuides.push({
              type: "horizontal",
              position: newY + h,
              start: Math.min(x, other.position.x),
              end: Math.max(x + w, other.position.x + otherW),
            });
          }
          // Bottom to Bottom
          if (Math.abs(y + h - (other.position.y + otherH)) < SNAP_THRESHOLD) {
            newY = other.position.y + otherH - h;
            newGuides.push({
              type: "horizontal",
              position: newY + h,
              start: Math.min(x, other.position.x),
              end: Math.max(x + w, other.position.x + otherW),
            });
          }
          // Center to Center
          if (
            Math.abs(y + h / 2 - (other.position.y + otherH / 2)) <
            SNAP_THRESHOLD
          ) {
            newY = other.position.y + otherH / 2 - h / 2;
            newGuides.push({
              type: "horizontal",
              position: newY + h / 2,
              start: Math.min(x, other.position.x),
              end: Math.max(x + w, other.position.x + otherW),
            });
          }

          // Distance Calculation (simplified for nearest neighbor)
          // Only show distance if aligned in one axis
          const isVerticallyAligned =
            y < other.position.y + otherH && y + h > other.position.y;
          const isHorizontallyAligned =
            x < other.position.x + otherW && x + w > other.position.x;

          if (isVerticallyAligned) {
            const dist = Math.min(
              Math.abs(x - (other.position.x + otherW)),
              Math.abs(x + w - other.position.x)
            );
            if (dist < 100) {
              // Only show if close enough
              // Determine midpoint for label
              const midY =
                Math.min(y, other.position.y) +
                Math.abs(y - other.position.y) / 2 +
                Math.min(h, otherH) / 2;
              const midX =
                x > other.position.x
                  ? other.position.x +
                    otherW +
                    (x - (other.position.x + otherW)) / 2
                  : x + w + (other.position.x - (x + w)) / 2;
              newDistances.push({
                x: midX,
                y: midY,
                value: Math.round(dist),
                axis: "x",
              });
            }
          }

          if (isHorizontallyAligned) {
            const dist = Math.min(
              Math.abs(y - (other.position.y + otherH)),
              Math.abs(y + h - other.position.y)
            );
            if (dist < 100) {
              const midX =
                Math.min(x, other.position.x) +
                Math.abs(x - other.position.x) / 2 +
                Math.min(w, otherW) / 2;
              const midY =
                y > other.position.y
                  ? other.position.y +
                    otherH +
                    (y - (other.position.y + otherH)) / 2
                  : y + h + (other.position.y - (y + h)) / 2;
              newDistances.push({
                x: midX,
                y: midY,
                value: Math.round(dist),
                axis: "y",
              });
            }
          }
        });

        updates.position = { x: newX, y: newY };
        setGuides(newGuides);
        setDistances(newDistances);
      }
    } else {
      // Clear guides when not dragging (or when update is not position related)
      // Actually, we should clear guides on drag stop, which we can't easily detect here alone without a separate handler
      // But for now, if updates doesn't have position, we assume it's a property change
      if (!updates.position) {
        setGuides([]);
        setDistances([]);
      }
    }

    setElements(
      elements.map((el) => {
        if (elementsToUpdate.includes(el.id)) {
          if (el.id === id) {
            return { ...el, ...updates };
          } else {
            // Apply delta to other group members
            return {
              ...el,
              position: {
                x: el.position.x + deltaX,
                y: el.position.y + deltaY,
              },
            };
          }
        }
        return el;
      })
    );
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    if (selectedIds.includes(id))
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
  };

  const saveSignature = async (name: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("saved_signatures").insert({
        user_id: user.id,
        name,
        elements: elements as any,
      });

      if (error) throw error;
      toast.success("Signature saved successfully!");
      fetchSavedSignatures();
    } catch (error) {
      console.error("Error saving signature:", error);
      toast.error("Failed to save signature");
    }
  };

  const loadSignature = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("saved_signatures")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setElements(data.elements as any);
        toast.success("Signature loaded!");
      }
    } catch (error) {
      console.error("Error loading signature:", error);
      toast.error("Failed to load signature");
    }
  };

  const exportHTML = () => {
    if (!canvasRef.current) return;

    const containerStyleString = Object.entries(containerStyle)
      .map(([k, v]) => {
        const key = k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
        return `${key}: ${v}`;
      })
      .join("; ");

    let htmlContent = `<div style="position: relative; width: 600px; height: 300px; font-family: Arial, sans-serif; ${containerStyleString}">`;

    elements.forEach((el) => {
      const styleString = Object.entries(el.style)
        .map(([k, v]) => {
          const key = k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
          const value = typeof v === "number" ? `${v}px` : v;
          return `${key}: ${value}`;
        })
        .join("; ");

      let content = el.content;
      if (el.type === "image") {
        content = `<img src="${
          el.content
        }" style="width: 100%; height: 100%; object-fit: ${
          el.style.objectFit || "cover"
        };" />`;
      } else if (el.type === "social" && el.socialLinks) {
        // Export social links as a flex container
        content = `<div style="display: flex; gap: ${el.style.gap}; flex-direction: ${el.style.flexDirection}; width: 100%; height: 100%;">`;
        el.socialLinks.forEach((link) => {
          content += `<a href="${
            link.url
          }" target="_blank" style="text-decoration: none; color: ${
            link.iconColor || el.style.color
          }; background-color: ${
            link.backgroundColor || "transparent"
          }; padding: 5px; border-radius: 4px;">${link.platform}</a>`;
        });
        content += `</div>`;
      }

      if (el.url && el.type !== "social") {
        content = `<a href="${el.url}" target="_blank" style="text-decoration: none; color: inherit; display: block; width: 100%; height: 100%;">${content}</a>`;
      }

      htmlContent += `
        <div style="position: absolute; left: ${el.position.x}px; top: ${el.position.y}px; width: ${el.size.width}px; height: ${el.size.height}px; ${styleString}; overflow: hidden;">
          ${content}
        </div>
      `;
    });

    htmlContent += "</div>";

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "signature.html";
    a.click();
  };

  const exportJSON = () => {
    const json = JSON.stringify(elements, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "signature.json";
    a.click();
  };

  const exportImage = async () => {
    if (canvasRef.current) {
      // Temporarily hide guides for screenshot
      const currentGuides = guides;
      setGuides([]);
      setDistances([]);

      // Wait for render
      await new Promise((resolve) => setTimeout(resolve, 50));

      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        allowTaint: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "signature.png";
      a.click();

      // Restore guides (though usually they are gone after drag stop anyway)
    }
  };

  const selectedElement = elements.find((el) => selectedIds.includes(el.id));

  return (
    <div className="flex flex-1 border border-border rounded-lg overflow-hidden bg-background h-[calc(100vh-8rem)]">
      <Toolbar
        onAddElement={addElement}
        onExportHTML={exportHTML}
        onExportJSON={exportJSON}
        onExportImage={exportImage}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        snapToGrid={snapToGrid}
        setSnapToGrid={setSnapToGrid}
        onSave={() =>
          saveSignature(`Signature ${new Date().toLocaleDateString()}`)
        }
        onLoad={loadSignature}
        savedSignatures={savedSignatures}
        onOpenWizard={() => setIsWizardOpen(true)}
        selectedIds={selectedIds}
        onGroup={() => {
          if (selectedIds.length < 2) return;
          const newGroupId = uuidv4();
          setElements(
            elements.map((el) =>
              selectedIds.includes(el.id) ? { ...el, groupId: newGroupId } : el
            )
          );
          toast.success("Elements grouped!");
        }}
        onUngroup={() => {
          if (selectedIds.length === 0) return;
          setElements(
            elements.map((el) =>
              selectedIds.includes(el.id) ? { ...el, groupId: undefined } : el
            )
          );
          toast.success("Elements ungrouped!");
        }}
      />

      <div
        className="flex-1 bg-gray-100 dark:bg-gray-800 p-8 flex items-center justify-center overflow-auto relative"
        onClick={() => setSelectedIds([])}
        onMouseUp={() => {
          setGuides([]);
          setDistances([]);
        }}
      >
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        )}

        <div
          ref={canvasRef}
          className="shadow-lg relative transition-all"
          style={{ width: 600, height: 300, ...containerStyle }}
        >
          {elements.map((el) => (
            <CanvasElement
              key={el.id}
              {...el}
              isSelected={selectedIds.includes(el.id)}
              onSelect={(id, multi) => {
                if (multi) {
                  setSelectedIds((prev) =>
                    prev.includes(id)
                      ? prev.filter((pid) => pid !== id)
                      : [...prev, id]
                  );
                } else {
                  // If selecting a grouped element, select all in group
                  const clickedEl = elements.find((e) => e.id === id);
                  if (clickedEl && clickedEl.groupId) {
                    const groupIds = elements
                      .filter((e) => e.groupId === clickedEl.groupId)
                      .map((e) => e.id);
                    setSelectedIds(groupIds);
                  } else {
                    setSelectedIds([id]);
                  }
                }
              }}
              onUpdate={updateElement}
              onDelete={deleteElement}
              gridSize={snapToGrid ? 20 : 1}
            />
          ))}

          {/* Alignment Guides */}
          {guides.map((guide, i) => (
            <div
              key={i}
              className="absolute bg-blue-500 pointer-events-none z-50"
              style={{
                left: guide.type === "vertical" ? guide.position : guide.start,
                top: guide.type === "horizontal" ? guide.position : guide.start,
                width: guide.type === "vertical" ? 1 : guide.end - guide.start,
                height:
                  guide.type === "horizontal" ? 1 : guide.end - guide.start,
              }}
            />
          ))}

          {/* Distance Labels */}
          {distances.map((dist, i) => (
            <div
              key={i}
              className="absolute bg-blue-500 text-white text-[10px] px-1 rounded pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: dist.x,
                top: dist.y,
              }}
            >
              {dist.value}
            </div>
          ))}
        </div>
      </div>

      <PropertiesPanel
        selectedElement={selectedElement}
        onUpdate={updateElement}
        containerStyle={containerStyle}
        onContainerUpdate={setContainerStyle}
      />

      <SignatureWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onGenerate={(newElements) => {
          setElements(newElements);
          toast.success("Signature generated!");
        }}
      />
    </div>
  );
}
