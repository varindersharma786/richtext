"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Row } from "../types";
import SortableColumn from "./sortable-column";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortableRowProps {
  row: Row;
  selectedIds: string[];
  onSelect: (id: string, multi?: boolean) => void;
  onDeleteElement: (id: string) => void;
  onDeleteRow: (id: string) => void;
}

export default function SortableRow({
  row,
  selectedIds,
  onSelect,
  onDeleteElement,
  onDeleteRow,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
    data: { type: "row", row },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...row.style,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group border border-transparent hover:border-gray-300 transition-colors ${
        selectedIds.includes(row.id) ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(row.id, e.shiftKey);
      }}
    >
      {/* Row Controls */}
      <div className="absolute -left-8 top-0 bottom-0 w-8 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <div
          {...attributes}
          {...listeners}
          className="cursor-move p-1 hover:bg-gray-100 rounded"
          title="Drag Row"
        >
          <GripVertical size={16} className="text-gray-400" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRow(row.id);
          }}
          title="Delete Row"
        >
          <Trash2 size={14} />
        </Button>
      </div>

      {/* Row Label */}
      <div className="absolute left-0 -top-3 bg-blue-500 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        Row
      </div>

      <div className="flex w-full" style={{ gap: row.style.gap }}>
        <SortableContext
          items={row.columns.map((col) => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          {row.columns.map((column) => (
            <SortableColumn
              key={column.id}
              column={column}
              selectedIds={selectedIds}
              onSelect={onSelect}
              onDeleteElement={onDeleteElement}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
