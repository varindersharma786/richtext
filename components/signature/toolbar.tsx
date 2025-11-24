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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <FolderOpen size={20} />
                </Button>
                <select
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => onLoad(e.target.value)}
                  value=""
                >
                  <option value="" disabled>
                    Load Signature
                  </option>
                  {savedSignatures?.map((sig) => (
                    <option key={sig.id} value={sig.id}>
                      {sig.name}
                    </option>
                  ))}
                </select>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Load Signature</TooltipContent>
          </Tooltip>
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
