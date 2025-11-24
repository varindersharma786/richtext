"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column } from "../types";
import SortableElement from "./sortable-element";

interface SortableColumnProps {
  column: Column;
  selectedIds: string[];
  onSelect: (id: string, multi?: boolean) => void;
  onDeleteElement: (id: string) => void;
}

export default function SortableColumn({
  column,
  selectedIds,
  onSelect,
  onDeleteElement,
}: SortableColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "column", column },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: `${column.width}%`,
    ...column.style,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`min-h-[50px] border border-dashed border-gray-200 p-2 flex flex-col gap-2 ${
        selectedIds.includes(column.id) ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(column.id, e.shiftKey);
      }}
      {...attributes}
      {...listeners}
    >
      <SortableContext
        items={column.elements.map((el) => el.id)}
        strategy={verticalListSortingStrategy}
      >
        {column.elements.map((element) => (
          <SortableElement
            key={element.id}
            element={element}
            isSelected={selectedIds.includes(element.id)}
            onSelect={onSelect}
            onDelete={onDeleteElement}
          />
        ))}
        {column.elements.length === 0 && (
          <div className="h-full w-full flex items-center justify-center text-xs text-gray-400 pointer-events-none">
            Drop here
          </div>
        )}
      </SortableContext>
    </div>
  );
}
