"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import html2canvas from "html2canvas";
import { createClient } from "@/utils/supabase/client";
import Toolbar from "./toolbar";
import PropertiesPanel from "./properties-panel";
import { toast } from "sonner";
import SignatureWizard from "./signature-wizard";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Row, Column, SignatureElement } from "./types";
import SortableRow from "./layout/sortable-row";
import SortableColumn from "./layout/sortable-column";
import SortableElement from "./layout/sortable-element";

export default function SignatureBuilder() {
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [savedSignatures, setSavedSignatures] = useState<
    { id: string; name: string }[]
  >([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [containerStyle, setContainerStyle] = useState<React.CSSProperties>({
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "0px",
    borderWidth: "0px",
    borderColor: "#000000",
    borderStyle: "solid",
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSavedSignatures();
    const saved = localStorage.getItem("unsavedSignatureGrid");
    if (saved) {
      try {
        setRows(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse unsaved signature", e);
      }
    } else {
      // Initialize with one row and one column if empty
      const initialRow: Row = {
        id: uuidv4(),
        columns: [
          {
            id: uuidv4(),
            width: 100,
            elements: [],
            style: { padding: "10px" },
          },
        ],
        style: { padding: "0px", gap: "0px" },
      };
      setRows([initialRow]);
    }
  }, []);

  useEffect(() => {
    if (rows.length > 0) {
      localStorage.setItem("unsavedSignatureGrid", JSON.stringify(rows));
    }
  }, [rows]);

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

  const findContainer = (
    id: string
  ): { type: "row" | "column"; item: any } | undefined => {
    const row = rows.find((r) => r.id === id);
    if (row) return { type: "row", item: row };

    for (const r of rows) {
      const col = r.columns.find((c) => c.id === id);
      if (col) return { type: "column", item: col };

      for (const c of r.columns) {
        if (c.elements.find((e) => e.id === id)) {
          return { type: "column", item: c };
        }
      }
    }
    return undefined;
  };

  const findElement = (id: string) => {
    for (const r of rows) {
      for (const c of r.columns) {
        const el = c.elements.find((e) => e.id === id);
        if (el) return el;
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Determine what is being dragged
    const row = rows.find((r) => r.id === active.id);
    if (row) {
      setActiveItem({ type: "row", data: row });
      return;
    }

    for (const r of rows) {
      const col = r.columns.find((c) => c.id === active.id);
      if (col) {
        setActiveItem({ type: "column", data: col });
        return;
      }
      for (const c of r.columns) {
        const el = c.elements.find((e) => e.id === active.id);
        if (el) {
          setActiveItem({ type: "element", data: el });
          return;
        }
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find containers
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    // Moving elements between columns
    if (activeItem?.type === "element") {
      const activeCol = activeContainer.item as Column;
      const overCol =
        overContainer.type === "column" ? (overContainer.item as Column) : null;

      // If over a column directly (empty column case handled in SortableColumn)
      if (overContainer.type === "column" && activeCol.id !== overCol?.id) {
        // Logic to move element to another column during drag is complex in dnd-kit without state updates
        // Usually handled in DragEnd for simple lists, but for nested, DragOver updates are preferred for visual feedback
        // For now, we'll rely on DragEnd for actual data updates to avoid flickering
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveItem(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Handling Row Reordering
    if (activeItem?.type === "row") {
      const oldIndex = rows.findIndex((r) => r.id === activeId);
      const newIndex = rows.findIndex((r) => r.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        setRows(arrayMove(rows, oldIndex, newIndex));
      }
      return;
    }

    // Handling Element Reordering
    if (activeItem?.type === "element") {
      // Find source and destination columns
      let sourceCol: Column | null = null;
      let destCol: Column | null = null;
      let sourceRow: Row | null = null;
      let destRow: Row | null = null;

      rows.forEach((r) => {
        r.columns.forEach((c) => {
          if (c.elements.find((e) => e.id === activeId)) {
            sourceCol = c;
            sourceRow = r;
          }
          if (c.id === overId || c.elements.find((e) => e.id === overId)) {
            destCol = c;
            destRow = r;
          }
        });
      });

      if (sourceCol && destCol) {
        const sourceElements = [...(sourceCol as Column).elements];
        const destElements =
          sourceCol === destCol
            ? sourceElements
            : [...(destCol as Column).elements];

        const oldIndex = sourceElements.findIndex((e) => e.id === activeId);
        const newIndex =
          sourceCol === destCol
            ? destElements.findIndex((e) => e.id === overId)
            : destElements.length; // Default to end if dropping on column

        // If dropping on an element in destCol
        if (sourceCol !== destCol) {
          // Remove from source
          const [movedItem] = sourceElements.splice(oldIndex, 1);

          // Add to dest
          // If overId is the column itself, add to end
          if (overId === destCol.id) {
            destElements.push(movedItem);
          } else {
            const overIndex = destElements.findIndex((e) => e.id === overId);
            destElements.splice(
              overIndex >= 0 ? overIndex : destElements.length,
              0,
              movedItem
            );
          }

          // Update rows
          setRows(
            rows
              .map((r) => {
                if (r.id === sourceRow?.id) {
                  return {
                    ...r,
                    columns: r.columns.map((c) =>
                      c.id === sourceCol?.id
                        ? { ...c, elements: sourceElements }
                        : c
                    ),
                  };
                }
                return r;
              })
              .map((r) => {
                if (r.id === destRow?.id) {
                  return {
                    ...r,
                    columns: r.columns.map((c) =>
                      c.id === destCol?.id
                        ? { ...c, elements: destElements }
                        : c
                    ),
                  };
                }
                return r;
              })
          );
        } else {
          // Same column reorder
          const reordered = arrayMove(sourceElements, oldIndex, newIndex);
          setRows(
            rows.map((r) => {
              if (r.id === sourceRow?.id) {
                return {
                  ...r,
                  columns: r.columns.map((c) =>
                    c.id === sourceCol?.id ? { ...c, elements: reordered } : c
                  ),
                };
              }
              return r;
            })
          );
        }
      }
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
      style: {
        fontSize: "16px",
        color: "#000000",
        padding: "0px",
        margin: "0px",
        ...preset?.style,
      },
      ...preset,
    };

    // Add to the first column of the first row for now, or selected column if implemented
    if (rows.length > 0 && rows[0].columns.length > 0) {
      const newRows = [...rows];
      newRows[0].columns[0].elements.push(newElement);
      setRows(newRows);
      setSelectedIds([newElement.id]);
    } else {
      // Create new row/col if none
      const newRow: Row = {
        id: uuidv4(),
        columns: [
          {
            id: uuidv4(),
            width: 100,
            elements: [newElement],
            style: { padding: "10px" },
          },
        ],
        style: { padding: "0px" },
      };
      setRows([...rows, newRow]);
      setSelectedIds([newElement.id]);
    }
  };

  const addRow = () => {
    const newRow: Row = {
      id: uuidv4(),
      columns: [
        { id: uuidv4(), width: 50, elements: [], style: { padding: "10px" } },
        { id: uuidv4(), width: 50, elements: [], style: { padding: "10px" } },
      ],
      style: { padding: "10px", gap: "10px" },
    };
    setRows([...rows, newRow]);
  };

  const deleteItem = (id: string) => {
    // Try deleting element
    let found = false;
    const newRows = rows.map((r) => ({
      ...r,
      columns: r.columns.map((c) => ({
        ...c,
        elements: c.elements.filter((e) => {
          if (e.id === id) found = true;
          return e.id !== id;
        }),
      })),
    }));

    if (found) {
      setRows(newRows);
      setSelectedIds([]);
      return;
    }

    // Try deleting row
    if (rows.find((r) => r.id === id)) {
      setRows(rows.filter((r) => r.id !== id));
      setSelectedIds([]);
      return;
    }

    // Try deleting column (only if row has >1 cols?)
    // For now, let's just allow deleting rows and elements
  };

  const updateItem = (id: string, updates: any) => {
    setRows(
      rows.map((r) => {
        if (r.id === id) return { ...r, ...updates };
        return {
          ...r,
          columns: r.columns.map((c) => {
            if (c.id === id) return { ...c, ...updates };
            return {
              ...c,
              elements: c.elements.map((e) => {
                if (e.id === id) return { ...e, ...updates };
                return e;
              }),
            };
          }),
        };
      })
    );
  };

  const getSelectedItem = () => {
    if (selectedIds.length === 0) return null;
    const id = selectedIds[0];

    const row = rows.find((r) => r.id === id);
    if (row) return { type: "row", data: row };

    for (const r of rows) {
      const col = r.columns.find((c) => c.id === id);
      if (col) return { type: "column", data: col };
      for (const c of r.columns) {
        const el = c.elements.find((e) => e.id === id);
        if (el) return { type: "element", data: el };
      }
    }
    return null;
  };

  // Export functions need to be updated for Grid (Table) layout
  const exportHTML = () => {
    // Generate Table HTML
    let html = `<table style="width: 600px; border-collapse: collapse; background-color: ${containerStyle.backgroundColor}; font-family: Arial, sans-serif;">`;

    rows.forEach((row) => {
      html += `<tr>`;
      row.columns.forEach((col) => {
        html += `<td style="width: ${
          col.width
        }%; vertical-align: top; padding: ${col.style.padding || "0px"};">`;
        col.elements.forEach((el) => {
          // Render element HTML (simplified)
          if (el.type === "text") {
            html += `<div style="${Object.entries(el.style)
              .map(
                ([k, v]) =>
                  `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${v}`
              )
              .join(";")}">${el.content}</div>`;
          } else if (el.type === "image") {
            html += `<img src="${el.content}" style="width: 100%; display: block; border-radius: ${el.style.borderRadius};" />`;
          } else if (el.type === "social") {
            // ... social render
            html += `<div>Social Icons</div>`;
          }
        });
        html += `</td>`;
      });
      html += `</tr>`;
    });
    html += `</table>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "signature.html";
    a.click();
  };

  return (
    <div className="flex flex-1 border border-border rounded-lg overflow-hidden bg-background h-[calc(100vh-8rem)]">
      <Toolbar
        onAddElement={addElement}
        onExportHTML={exportHTML}
        onExportJSON={() => {}}
        onExportImage={() => {}}
        showGrid={true}
        setShowGrid={() => {}}
        snapToGrid={true}
        setSnapToGrid={() => {}}
        onSave={() => {}}
        onLoad={() => {}}
        savedSignatures={savedSignatures}
        onOpenWizard={() => setIsWizardOpen(true)}
        selectedIds={selectedIds}
        onGroup={() => {}}
        onUngroup={() => {}}
      />

      <div
        className="flex-1 bg-gray-100 dark:bg-gray-800 p-8 flex items-center justify-center overflow-auto relative"
        onClick={() => setSelectedIds([])}
      >
        <div
          ref={canvasRef}
          style={{ width: 600, minHeight: 300, ...containerStyle }}
          className="bg-white shadow-lg"
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={rows.map((r) => r.id)}
              strategy={verticalListSortingStrategy}
            >
              {rows.map((row) => (
                <SortableRow
                  key={row.id}
                  row={row}
                  selectedIds={selectedIds}
                  onSelect={(id, multi) => setSelectedIds([id])}
                  onDeleteElement={deleteItem}
                  onDeleteRow={deleteItem}
                />
              ))}
            </SortableContext>

            <DragOverlay>
              {activeItem ? (
                <div className="bg-blue-100 opacity-80 p-2 border border-blue-500">
                  Dragging {activeItem.type}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          <button
            onClick={addRow}
            className="w-full py-2 mt-4 border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500 rounded flex items-center justify-center"
          >
            + Add Row
          </button>
        </div>
      </div>

      <PropertiesPanel
        selectedElement={getSelectedItem()?.data} // Need to update PropertiesPanel to handle different types
        onUpdate={updateItem}
        containerStyle={containerStyle}
        onContainerUpdate={setContainerStyle}
      />
    </div>
  );
}
