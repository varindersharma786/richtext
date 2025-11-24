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
  Columns,
  Rows,
  Type,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ImageUploader from "@/components/admin/image-uploader";
import { v4 as uuidv4 } from "uuid";
import { Row, Column, SignatureElement } from "./types";

interface PropertiesPanelProps {
  selectedElement: Row | Column | SignatureElement | null | undefined;
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
  // Helper to determine type
  const isRow = (item: any): item is Row => item && "columns" in item;
  const isColumn = (item: any): item is Column =>
    item && "elements" in item && !("columns" in item);
  const isElement = (item: any): item is SignatureElement =>
    item && "type" in item;

  if (!selectedElement) {
    if (containerStyle && onContainerUpdate) {
      return (
        <div className="w-80 border-l border-border bg-card p-6 overflow-y-auto h-full">
          <h3 className="font-semibold mb-6">Container Properties</h3>
          <div className="space-y-6">
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
                    })
                  }
                  className="flex-1"
                />
              </div>
            </div>
            {/* Add more container props if needed */}
          </div>
        </div>
      );
    }
    return (
      <div className="w-80 border-l border-border bg-card p-6 flex items-center justify-center text-muted-foreground text-sm">
        Select an item to edit properties
      </div>
    );
  }

  const handleStyleChange = (key: string, value: any) => {
    onUpdate(selectedElement.id, {
      style: { ...selectedElement.style, [key]: value },
    });
  };

  const handleChange = (key: string, value: any) => {
    onUpdate(selectedElement.id, { [key]: value });
  };

  return (
    <div className="w-80 border-l border-border bg-card p-6 overflow-y-auto h-full">
      <div className="flex items-center gap-2 mb-6">
        {isRow(selectedElement) && <Rows size={18} />}
        {isColumn(selectedElement) && <Columns size={18} />}
        {isElement(selectedElement) && <Type size={18} />}
        <h3 className="font-semibold">
          {isRow(selectedElement)
            ? "Row Properties"
            : isColumn(selectedElement)
            ? "Column Properties"
            : "Element Properties"}
        </h3>
      </div>

      <div className="space-y-6">
        {/* ROW PROPERTIES */}
        {isRow(selectedElement) && (
          <>
            <div className="space-y-2">
              <Label>
                Gap ({parseInt(selectedElement.style.gap || "0")}px)
              </Label>
              <Slider
                value={[parseInt(selectedElement.style.gap || "0")]}
                min={0}
                max={50}
                step={1}
                onValueChange={(vals) =>
                  handleStyleChange("gap", `${vals[0]}px`)
                }
              />
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
                onValueChange={(vals) =>
                  handleStyleChange("padding", `${vals[0]}px`)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={selectedElement.style.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    handleStyleChange("backgroundColor", e.target.value)
                  }
                  className="w-12 p-1 h-9"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleStyleChange("backgroundColor", "transparent")
                  }
                >
                  Clear
                </Button>
              </div>
            </div>
          </>
        )}

        {/* COLUMN PROPERTIES */}
        {isColumn(selectedElement) && (
          <>
            <div className="space-y-2">
              <Label>Width ({selectedElement.width}%)</Label>
              <Slider
                value={[selectedElement.width]}
                min={10}
                max={100}
                step={5}
                onValueChange={(vals) => handleChange("width", vals[0])}
              />
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
                onValueChange={(vals) =>
                  handleStyleChange("padding", `${vals[0]}px`)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Vertical Align</Label>
              <Select
                value={selectedElement.style.verticalAlign || "top"}
                onValueChange={(val) => handleStyleChange("verticalAlign", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="middle">Middle</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Border Width</Label>
              <Slider
                value={[parseInt(selectedElement.style.borderWidth || "0")]}
                min={0}
                max={10}
                step={1}
                onValueChange={(vals) =>
                  handleStyleChange("borderWidth", `${vals[0]}px`)
                }
              />
            </div>
            {parseInt(selectedElement.style.borderWidth || "0") > 0 && (
              <div className="space-y-2">
                <Label>Border Color</Label>
                <Input
                  type="color"
                  value={selectedElement.style.borderColor || "#000000"}
                  onChange={(e) =>
                    handleStyleChange("borderColor", e.target.value)
                  }
                  className="h-9"
                />
              </div>
            )}
          </>
        )}

        {/* ELEMENT PROPERTIES */}
        {isElement(selectedElement) && (
          <>
            {/* Content for Text */}
            {selectedElement.type === "text" && (
              <div className="space-y-2">
                <Label>Content</Label>
                <Input
                  value={selectedElement.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                />
              </div>
            )}

            {/* Content for Image */}
            {selectedElement.type === "image" && (
              <div className="space-y-2">
                <Label>Image URL</Label>
                <ImageUploader
                  value={selectedElement.content}
                  onChange={(url) => handleChange("content", url)}
                />
              </div>
            )}

            {/* Typography (Text only) */}
            {selectedElement.type === "text" && (
              <>
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Slider
                    value={[
                      parseInt(
                        selectedElement.style.fontSize?.toString() || "16"
                      ),
                    ]}
                    min={8}
                    max={72}
                    step={1}
                    onValueChange={(vals) =>
                      handleStyleChange("fontSize", `${vals[0]}px`)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={selectedElement.style.color || "#000000"}
                    onChange={(e) => handleStyleChange("color", e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Style</Label>
                  <ToggleGroup type="multiple" className="justify-start">
                    <ToggleGroupItem
                      value="bold"
                      onClick={() =>
                        handleStyleChange(
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
                      onClick={() =>
                        handleStyleChange(
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
                      onClick={() =>
                        handleStyleChange(
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
                <div className="space-y-2">
                  <Label>Alignment</Label>
                  <ToggleGroup
                    type="single"
                    value={selectedElement.style.textAlign || "left"}
                    onValueChange={(val) =>
                      val && handleStyleChange("textAlign", val)
                    }
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

            {/* Common Element Styles */}
            <div className="space-y-2">
              <Label>Padding</Label>
              <Slider
                value={[parseInt(selectedElement.style.padding || "0")]}
                min={0}
                max={50}
                step={1}
                onValueChange={(vals) =>
                  handleStyleChange("padding", `${vals[0]}px`)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Margin</Label>
              <Slider
                value={[parseInt(selectedElement.style.margin || "0")]}
                min={0}
                max={50}
                step={1}
                onValueChange={(vals) =>
                  handleStyleChange("margin", `${vals[0]}px`)
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
