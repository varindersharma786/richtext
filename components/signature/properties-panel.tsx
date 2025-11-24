"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Plus,
  Trash2,
  ArrowRight,
  ArrowDown,
  BringToFront,
  SendToBack,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ImageUploader from "@/components/admin/image-uploader";
import { v4 as uuidv4 } from "uuid";

interface PropertiesPanelProps {
  selectedElement: any;
  onUpdate: (id: string, updates: any) => void;
  containerStyle?: React.CSSProperties;
  onContainerUpdate?: (style: React.CSSProperties) => void;
}

export default function PropertiesPanel({
  selectedElement,
  onUpdate,
  containerStyle,
  onContainerUpdate,
}: PropertiesPanelProps) {
  if (!selectedElement) {
    if (containerStyle && onContainerUpdate) {
      return (
        <div className="w-80 border-l border-border bg-card p-6 overflow-y-auto h-full">
          <h3 className="font-semibold mb-6">Container Properties</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Background Type</Label>
              <Select
                value={(containerStyle as any).backgroundType || "color"}
                onValueChange={(val) =>
                  onContainerUpdate({
                    ...containerStyle,
                    backgroundType: val,
                  } as any)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="color">Solid Color</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {((containerStyle as any).backgroundType === "color" ||
              !(containerStyle as any).backgroundType) && (
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={containerStyle.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      onContainerUpdate({
                        ...containerStyle,
                        backgroundColor: e.target.value,
                        backgroundImage: "none",
                      })
                    }
                    className="w-12 p-1 h-9"
                  />
                  <Input
                    value={containerStyle.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      onContainerUpdate({
                        ...containerStyle,
                        backgroundColor: e.target.value,
                        backgroundImage: "none",
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            )}

            {(containerStyle as any).backgroundType === "gradient" && (
              <div className="space-y-2">
                <Label>Gradient Colors</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      From
                    </Label>
                    <Input
                      type="color"
                      value={(containerStyle as any).gradientFrom || "#ffffff"}
                      onChange={(e) =>
                        onContainerUpdate({
                          ...containerStyle,
                          gradientFrom: e.target.value,
                          backgroundImage: `linear-gradient(135deg, ${
                            e.target.value
                          }, ${
                            (containerStyle as any).gradientTo || "#000000"
                          })`,
                          backgroundColor: "transparent",
                        } as any)
                      }
                      className="w-full p-1 h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">To</Label>
                    <Input
                      type="color"
                      value={(containerStyle as any).gradientTo || "#000000"}
                      onChange={(e) =>
                        onContainerUpdate({
                          ...containerStyle,
                          gradientTo: e.target.value,
                          backgroundImage: `linear-gradient(135deg, ${
                            (containerStyle as any).gradientFrom || "#ffffff"
                          }, ${e.target.value})`,
                          backgroundColor: "transparent",
                        } as any)
                      }
                      className="w-full p-1 h-9"
                    />
                  </div>
                </div>
              </div>
            )}

            {(containerStyle as any).backgroundType === "image" && (
              <div className="space-y-2">
                <Label>Background Image URL</Label>
                <Input
                  value={(containerStyle as any).backgroundImageUrl || ""}
                  onChange={(e) =>
                    onContainerUpdate({
                      ...containerStyle,
                      backgroundImageUrl: e.target.value,
                      backgroundImage: e.target.value
                        ? `url(${e.target.value})`
                        : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: "transparent",
                    } as any)
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>
                Padding ({parseInt((containerStyle.padding as string) || "0")}
                px)
              </Label>
              <Slider
                value={[parseInt((containerStyle.padding as string) || "0")]}
                min={0}
                max={100}
                step={1}
                onValueChange={(vals) =>
                  onContainerUpdate({
                    ...containerStyle,
                    padding: `${vals[0]}px`,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>
                Border Radius (
                {parseInt((containerStyle.borderRadius as string) || "0")}px)
              </Label>
              <Slider
                value={[
                  parseInt((containerStyle.borderRadius as string) || "0"),
                ]}
                min={0}
                max={50}
                step={1}
                onValueChange={(vals) =>
                  onContainerUpdate({
                    ...containerStyle,
                    borderRadius: `${vals[0]}px`,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>
                Border Width (
                {parseInt((containerStyle.borderWidth as string) || "0")}px)
              </Label>
              <Slider
                value={[
                  parseInt((containerStyle.borderWidth as string) || "0"),
                ]}
                min={0}
                max={20}
                step={1}
                onValueChange={(vals) =>
                  onContainerUpdate({
                    ...containerStyle,
                    borderWidth: `${vals[0]}px`,
                  })
                }
              />
            </div>

            {parseInt((containerStyle.borderWidth as string) || "0") > 0 && (
              <div className="space-y-2">
                <Label>Border Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={containerStyle.borderColor || "#000000"}
                    onChange={(e) =>
                      onContainerUpdate({
                        ...containerStyle,
                        borderColor: e.target.value,
                      })
                    }
                    className="w-12 p-1 h-9"
                  />
                  <Input
                    value={containerStyle.borderColor || "#000000"}
                    onChange={(e) =>
                      onContainerUpdate({
                        ...containerStyle,
                        borderColor: e.target.value,
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return (
      <div className="w-80 border-l border-border bg-card p-6 flex items-center justify-center text-muted-foreground text-sm">
        Select an element to edit properties
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    if (key === "content" || key === "icon" || key === "url") {
      onUpdate(selectedElement.id, { [key]: value });
    } else {
      onUpdate(selectedElement.id, {
        style: { ...selectedElement.style, [key]: value },
      });
    }
  };

  // Social Media Handlers
  const addSocialLink = () => {
    const newLink = {
      id: uuidv4(),
      platform: "website",
      url: "",
      iconColor: "#000000",
    };
    onUpdate(selectedElement.id, {
      socialLinks: [...(selectedElement.socialLinks || []), newLink],
    });
  };

  const removeSocialLink = (linkId: string) => {
    onUpdate(selectedElement.id, {
      socialLinks: selectedElement.socialLinks.filter(
        (l: any) => l.id !== linkId
      ),
    });
  };

  const updateSocialLink = (linkId: string, updates: any) => {
    onUpdate(selectedElement.id, {
      socialLinks: selectedElement.socialLinks.map((l: any) =>
        l.id === linkId ? { ...l, ...updates } : l
      ),
    });
  };

  return (
    <div className="w-80 border-l border-border bg-card p-6 overflow-y-auto h-full">
      <h3 className="font-semibold mb-6">Properties</h3>

      <div className="space-y-6">
        {/* Layering */}
        <div className="space-y-2">
          <Label>Layering</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() =>
                handleChange("zIndex", (selectedElement.style.zIndex || 1) + 1)
              }
            >
              <BringToFront size={14} className="mr-2" /> Forward
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() =>
                handleChange(
                  "zIndex",
                  Math.max((selectedElement.style.zIndex || 1) - 1, 0)
                )
              }
            >
              <SendToBack size={14} className="mr-2" /> Backward
            </Button>
          </div>
        </div>

        {/* Dimensions & Aspect Ratio */}
        <div className="space-y-2">
          <Label>Dimensions</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Width</Label>
              <Input
                type="number"
                value={parseInt(selectedElement.size.width)}
                onChange={(e) =>
                  onUpdate(selectedElement.id, {
                    size: {
                      ...selectedElement.size,
                      width: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Height</Label>
              <Input
                type="number"
                value={parseInt(selectedElement.size.height)}
                onChange={(e) =>
                  onUpdate(selectedElement.id, {
                    size: {
                      ...selectedElement.size,
                      height: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
          <div className="pt-2">
            <Label className="text-xs text-muted-foreground mb-1 block">
              Aspect Ratio
            </Label>
            <div className="grid grid-cols-4 gap-1">
              <Button
                variant="outline"
                size="sm"
                className="text-xs px-1"
                onClick={() => {
                  // Free aspect ratio - no action needed really, just for UI
                }}
              >
                Free
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs px-1"
                onClick={() => {
                  // Square (1:1)
                  const w = parseInt(selectedElement.size.width);
                  onUpdate(selectedElement.id, {
                    size: { ...selectedElement.size, height: w },
                  });
                }}
              >
                1:1
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs px-1"
                onClick={() => {
                  // 4:3
                  const w = parseInt(selectedElement.size.width);
                  onUpdate(selectedElement.id, {
                    size: {
                      ...selectedElement.size,
                      height: Math.round(w * 0.75),
                    },
                  });
                }}
              >
                4:3
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs px-1"
                onClick={() => {
                  // 16:9
                  const w = parseInt(selectedElement.size.width);
                  onUpdate(selectedElement.id, {
                    size: {
                      ...selectedElement.size,
                      height: Math.round(w * 0.5625),
                    },
                  });
                }}
              >
                16:9
              </Button>
            </div>
          </div>
        </div>

        {/* Common Properties */}
        {selectedElement.type !== "social" && (
          <div className="space-y-2">
            <Label>Link URL</Label>
            <Input
              value={selectedElement.url || ""}
              onChange={(e) => handleChange("url", e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        )}

        {/* Text Specific */}
        {selectedElement.type === "text" && (
          <>
            <div className="space-y-2">
              <Label>Content</Label>
              <Input
                value={selectedElement.content}
                onChange={(e) => handleChange("content", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={selectedElement.style.fontFamily}
                onValueChange={(val) => handleChange("fontFamily", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                  <SelectItem value="'Times New Roman', serif">
                    Times New Roman
                  </SelectItem>
                  <SelectItem value="'Courier New', monospace">
                    Courier New
                  </SelectItem>
                  <SelectItem value="Georgia, serif">Georgia</SelectItem>
                  <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                  <SelectItem value="Tahoma, sans-serif">Tahoma</SelectItem>
                  <SelectItem value="'Trebuchet MS', sans-serif">
                    Trebuchet MS
                  </SelectItem>
                  <SelectItem value="Impact, sans-serif">Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Font Size ({parseInt(selectedElement.style.fontSize)}px)
              </Label>
              <Slider
                value={[parseInt(selectedElement.style.fontSize)]}
                min={8}
                max={72}
                step={1}
                onValueChange={(vals) =>
                  handleChange("fontSize", `${vals[0]}px`)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={selectedElement.style.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  className="w-12 p-1 h-9"
                />
                <Input
                  value={selectedElement.style.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Style</Label>
              <div className="flex gap-2">
                <ToggleGroup type="multiple" className="justify-start">
                  <ToggleGroupItem
                    value="bold"
                    aria-label="Toggle bold"
                    data-state={
                      selectedElement.style.fontWeight === "bold" ? "on" : "off"
                    }
                    onClick={() =>
                      handleChange(
                        "fontWeight",
                        selectedElement.style.fontWeight === "bold"
                          ? "normal"
                          : "bold"
                      )
                    }
                  >
                    <Bold size={16} />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="italic"
                    aria-label="Toggle italic"
                    data-state={
                      selectedElement.style.fontStyle === "italic"
                        ? "on"
                        : "off"
                    }
                    onClick={() =>
                      handleChange(
                        "fontStyle",
                        selectedElement.style.fontStyle === "italic"
                          ? "normal"
                          : "italic"
                      )
                    }
                  >
                    <Italic size={16} />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="underline"
                    aria-label="Toggle underline"
                    data-state={
                      selectedElement.style.textDecoration === "underline"
                        ? "on"
                        : "off"
                    }
                    onClick={() =>
                      handleChange(
                        "textDecoration",
                        selectedElement.style.textDecoration === "underline"
                          ? "none"
                          : "underline"
                      )
                    }
                  >
                    <Underline size={16} />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Alignment</Label>
              <ToggleGroup
                type="single"
                value={selectedElement.style.textAlign}
                onValueChange={(val) => val && handleChange("textAlign", val)}
              >
                <ToggleGroupItem value="left">
                  <AlignLeft size={16} />
                </ToggleGroupItem>
                <ToggleGroupItem value="center">
                  <AlignCenter size={16} />
                </ToggleGroupItem>
                <ToggleGroupItem value="right">
                  <AlignRight size={16} />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </>
        )}

        {/* Image Specific */}
        {selectedElement.type === "image" && (
          <>
            <div className="space-y-2">
              <Label>Image Source</Label>
              <ImageUploader
                value={selectedElement.content}
                onChange={(url) => handleChange("content", url)}
              />
              <div className="text-xs text-muted-foreground mt-1">
                Or enter URL manually:
              </div>
              <Input
                value={selectedElement.content}
                onChange={(e) => handleChange("content", e.target.value)}
                placeholder="Image URL"
              />
            </div>

            <div className="space-y-2">
              <Label>Object Fit</Label>
              <Select
                value={selectedElement.style.objectFit || "cover"}
                onValueChange={(val) => handleChange("objectFit", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Cover</SelectItem>
                  <SelectItem value="contain">Contain</SelectItem>
                  <SelectItem value="fill">Fill</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Social Specific */}
        {selectedElement.type === "social" && (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Social Icons</Label>
                <Button size="sm" variant="outline" onClick={addSocialLink}>
                  <Plus size={14} className="mr-1" /> Add
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Layout</Label>
                <div className="flex gap-2">
                  <ToggleGroup
                    type="single"
                    value={selectedElement.style.flexDirection || "row"}
                    onValueChange={(val) =>
                      val && handleChange("flexDirection", val)
                    }
                  >
                    <ToggleGroupItem value="row">
                      <ArrowRight size={16} />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="column">
                      <ArrowDown size={16} />
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <Input
                    type="text"
                    placeholder="Gap (e.g. 10px)"
                    value={selectedElement.style.gap || "10px"}
                    onChange={(e) => handleChange("gap", e.target.value)}
                    className="w-24"
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto border rounded-md p-2">
                {selectedElement.socialLinks?.map((link: any) => (
                  <div
                    key={link.id}
                    className="space-y-2 border-b pb-2 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <Select
                        value={link.platform}
                        onValueChange={(val) =>
                          updateSocialLink(link.id, { platform: val })
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="github">GitHub</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeSocialLink(link.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) =>
                        updateSocialLink(link.id, { url: e.target.value })
                      }
                      className="h-8 text-xs"
                    />
                    <div className="flex gap-2 items-center">
                      <Label className="text-xs">Color:</Label>
                      <Input
                        type="color"
                        value={link.iconColor || "#000000"}
                        onChange={(e) =>
                          updateSocialLink(link.id, {
                            iconColor: e.target.value,
                          })
                        }
                        className="w-8 h-6 p-0 border-0"
                      />
                      <Label className="text-xs ml-2">Bg:</Label>
                      <Input
                        type="color"
                        value={link.backgroundColor || "#ffffff"}
                        onChange={(e) =>
                          updateSocialLink(link.id, {
                            backgroundColor: e.target.value,
                          })
                        }
                        className="w-8 h-6 p-0 border-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Common Styling */}
        <div className="space-y-2">
          <Label>Background Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={
                selectedElement.style.backgroundColor === "transparent"
                  ? "#ffffff"
                  : selectedElement.style.backgroundColor
              }
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              className="w-12 p-1 h-9"
            />
            <Button
              variant="outline"
              onClick={() => handleChange("backgroundColor", "transparent")}
              className="flex-1"
            >
              Transparent
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>
            Padding ({parseInt(selectedElement.style.padding || "0")}px)
          </Label>
          <Slider
            value={[parseInt(selectedElement.style.padding || "0")]}
            min={0}
            max={50}
            step={1}
            onValueChange={(vals) => handleChange("padding", `${vals[0]}px`)}
          />
        </div>

        <div className="space-y-2">
          <Label>
            Border Radius ({parseInt(selectedElement.style.borderRadius || "0")}
            px)
          </Label>
          <Slider
            value={[parseInt(selectedElement.style.borderRadius || "0")]}
            min={0}
            max={100}
            step={1}
            onValueChange={(vals) =>
              handleChange("borderRadius", `${vals[0]}px`)
            }
          />
        </div>

        <div className="space-y-2">
          <Label>
            Border Width ({parseInt(selectedElement.style.borderWidth || "0")}
            px)
          </Label>
          <Slider
            value={[parseInt(selectedElement.style.borderWidth || "0")]}
            min={0}
            max={10}
            step={1}
            onValueChange={(vals) =>
              handleChange("borderWidth", `${vals[0]}px`)
            }
          />
        </div>

        {parseInt(selectedElement.style.borderWidth || "0") > 0 && (
          <div className="space-y-2">
            <Label>Border Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={selectedElement.style.borderColor || "#000000"}
                onChange={(e) => handleChange("borderColor", e.target.value)}
                className="w-12 p-1 h-9"
              />
              <Input
                value={selectedElement.style.borderColor || "#000000"}
                onChange={(e) => handleChange("borderColor", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
