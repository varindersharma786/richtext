"use client";

import {
  Type,
  Image as ImageIcon,
  Share2,
  Download,
  Grid,
  Save,
  FolderOpen,
  User,
  Briefcase,
  Building,
  Wand2,
  Group,
  Ungroup,
  X,
  AlertCircle,
  Quote,
  Video,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ToolbarProps {
  onAddElement: (type: "text" | "image" | "social", preset?: any) => void;
  onExportHTML: () => void;
  onExportJSON: () => void;
  onExportImage: () => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  onSave: () => void;
  onLoad: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
  savedSignatures: { id: string; name: string }[];
  onOpenWizard: () => void;
  selectedIds: string[];
  onGroup: () => void;
  onUngroup: () => void;
}

export default function Toolbar({
  onAddElement,
  onExportHTML,
  onExportJSON,
  onExportImage,
  showGrid,
  setShowGrid,
  onSave,
  onLoad,
  onDeleteTemplate,
  savedSignatures,
  onOpenWizard,
  selectedIds,
  onGroup,
  onUngroup,
}: ToolbarProps) {
  return (
    <aside className="w-16 border-r border-border bg-card flex flex-col items-center py-4 gap-4 z-10">
      <TooltipProvider delayDuration={0}>
        <div className="flex flex-col gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:text-primary hover:bg-primary/10"
                onClick={onOpenWizard}
              >
                <Wand2 size={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Signature Wizard (Easy Mode)
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAddElement("text")}
              >
                <Type size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Text</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAddElement("image")}
              >
                <ImageIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Image</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAddElement("social")}
              >
                <Share2 size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Social Icon</TooltipContent>
          </Tooltip>
        </div>

        <Separator />

        {/* Grouping Controls */}
        {selectedIds && selectedIds.length > 0 && (
          <div className="flex flex-col gap-2 animate-in fade-in zoom-in duration-200">
            {selectedIds.length > 1 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onGroup}>
                    <Group size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Group Selected</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onUngroup}>
                  <Ungroup size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Ungroup</TooltipContent>
            </Tooltip>
            <Separator />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  onAddElement("text", {
                    content: "John Doe",
                    style: { fontWeight: "bold", fontSize: "24px" },
                  })
                }
              >
                <User size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Name</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  onAddElement("text", {
                    content: "Software Engineer",
                    style: { color: "#666" },
                  })
                }
              >
                <Briefcase size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Job Title</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  onAddElement("text", {
                    content: "Acme Corp",
                    style: { fontWeight: "bold" },
                  })
                }
              >
                <Building size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Company</TooltipContent>
          </Tooltip>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  onAddElement("text", {
                    content:
                      "Disclaimer: This message contains confidential information...",
                    style: {
                      fontSize: "10px",
                      color: "#888888",
                      fontStyle: "italic",
                    },
                  })
                }
              >
                <AlertCircle size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Disclaimer</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  onAddElement("text", {
                    content: '"Your favorite quote here"',
                    style: {
                      fontStyle: "italic",
                      borderLeft: "2px solid #ccc",
                      paddingLeft: "10px",
                      color: "#555",
                    },
                  })
                }
              >
                <Quote size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Quote</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  onAddElement("image", {
                    content: "https://via.placeholder.com/600x100?text=Banner",
                    style: { width: "100%", borderRadius: "4px" },
                  })
                }
              >
                <ImageIcon size={20} className="rotate-90" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Banner</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  onAddElement("image", {
                    content:
                      "https://via.placeholder.com/300x200?text=Video+Thumbnail",
                    style: { borderRadius: "8px", border: "1px solid #ddd" },
                  })
                }
              >
                <Video size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Video Thumbnail</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  onAddElement("text", {
                    content: "📍 123 Business Rd, Tech City, TC 90210",
                    style: { fontSize: "12px", color: "#444" },
                  })
                }
              >
                <MapPin size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Address</TooltipContent>
          </Tooltip>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showGrid ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Toggle Grid</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onSave}>
                <Save size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Save Signature</TooltipContent>
          </Tooltip>

          <Popover>
            <PopoverTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <FolderOpen size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Load Template</TooltipContent>
              </Tooltip>
            </PopoverTrigger>
            <PopoverContent side="right" className="w-64 p-2">
              <div className="space-y-2">
                <h4 className="font-medium text-sm px-2">Saved Templates</h4>
                {savedSignatures.length === 0 ? (
                  <p className="text-sm text-muted-foreground px-2">
                    No saved templates
                  </p>
                ) : (
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {savedSignatures.map((sig) => (
                      <div
                        key={sig.id}
                        className="flex items-center justify-between gap-2 p-2 hover:bg-accent rounded-md group"
                      >
                        <button
                          onClick={() => onLoad(sig.id)}
                          className="flex-1 text-left text-sm truncate"
                        >
                          {sig.name}
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTemplate(sig.id);
                          }}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onExportHTML}>
                <Download size={20} />
                <span className="sr-only">HTML</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Export HTML</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onExportImage}>
                <ImageIcon size={20} />
                <span className="sr-only">Image</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Export Image</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </aside>
  );
}
