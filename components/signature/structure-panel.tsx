"use client";

import { Row, Column, SignatureElement } from "./types";
import {
  ChevronRight,
  ChevronDown,
  Columns,
  Rows,
  Type,
  Image as ImageIcon,
  Share2,
  Box,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StructurePanelProps {
  rows: Row[];
  selectedIds: string[];
  onSelect: (id: string, multi?: boolean) => void;
}

export default function StructurePanel({
  rows,
  selectedIds,
  onSelect,
}: StructurePanelProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  // Auto-expand parent if child is selected (could be added in useEffect)

  const renderElementIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type size={14} />;
      case "image":
        return <ImageIcon size={14} />;
      case "social":
        return <Share2 size={14} />;
      default:
        return <Box size={14} />;
    }
  };

  const TreeItem = ({
    id,
    label,
    icon,
    children,
    hasChildren,
    level = 0,
  }: {
    id: string;
    label: string;
    icon: React.ReactNode;
    children?: React.ReactNode;
    hasChildren?: boolean;
    level?: number;
  }) => {
    const isSelected = selectedIds.includes(id);
    const isExpanded = expandedIds.has(id);

    return (
      <div>
        <div
          className={cn(
            "flex items-center py-1 px-2 cursor-pointer hover:bg-accent/50 text-sm select-none",
            isSelected && "bg-accent text-accent-foreground font-medium"
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={(e) => onSelect(id, e.shiftKey)}
        >
          <div
            className={cn(
              "p-0.5 mr-1 rounded-sm hover:bg-black/10 dark:hover:bg-white/10 transition-colors",
              !hasChildren && "opacity-0 pointer-events-none"
            )}
            onClick={(e) => hasChildren && toggleExpand(id, e)}
          >
            {isExpanded ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )}
          </div>
          <div className="mr-2 text-muted-foreground">{icon}</div>
          <span className="truncate">{label}</span>
        </div>
        {isExpanded && children}
      </div>
    );
  };

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">Layers</h3>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {rows.map((row, rowIndex) => (
          <TreeItem
            key={row.id}
            id={row.id}
            label={`Row ${rowIndex + 1}`}
            icon={<Rows size={14} />}
            hasChildren={row.columns.length > 0}
            level={0}
          >
            {row.columns.map((col, colIndex) => (
              <TreeItem
                key={col.id}
                id={col.id}
                label={`Column ${colIndex + 1}`}
                icon={<Columns size={14} />}
                hasChildren={col.elements.length > 0}
                level={1}
              >
                {col.elements.map((el, elIndex) => (
                  <TreeItem
                    key={el.id}
                    id={el.id}
                    label={
                      el.type === "text"
                        ? (el.content as string).substring(0, 20) || "Text"
                        : el.type.charAt(0).toUpperCase() + el.type.slice(1)
                    }
                    icon={renderElementIcon(el.type)}
                    hasChildren={false}
                    level={2}
                  />
                ))}
              </TreeItem>
            ))}
          </TreeItem>
        ))}
        {rows.length === 0 && (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No elements yet
          </div>
        )}
      </div>
    </div>
  );
}
