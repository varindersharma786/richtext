"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SignatureElement } from "../types";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Globe,
  Mail,
  Phone,
  Share2,
  X,
} from "lucide-react";

interface SortableElementProps {
  element: SignatureElement;
  isSelected: boolean;
  onSelect: (id: string, multi?: boolean) => void;
  onDelete: (id: string) => void;
}

export default function SortableElement({
  element,
  isSelected,
  onSelect,
  onDelete,
}: SortableElementProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id, data: { type: "element", element } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    ...element.style,
  };

  const renderSocialIcon = (
    platform: string,
    color: string,
    size: string = "100%"
  ) => {
    const iconProps = {
      size,
      color,
    };

    switch (platform) {
      case "facebook":
        return <Facebook {...iconProps} />;
      case "twitter":
        return <Twitter {...iconProps} />;
      case "linkedin":
        return <Linkedin {...iconProps} />;
      case "instagram":
        return <Instagram {...iconProps} />;
      case "github":
        return <Github {...iconProps} />;
      case "website":
        return <Globe {...iconProps} />;
      case "email":
        return <Mail {...iconProps} />;
      case "phone":
        return <Phone {...iconProps} />;
      default:
        return <Share2 {...iconProps} />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group cursor-move ${
        isSelected
          ? "ring-2 ring-primary"
          : "hover:ring-1 hover:ring-primary/50"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element.id, e.shiftKey);
      }}
    >
      {element.type === "image" ? (
        <img
          src={element.content}
          alt="Signature element"
          className="w-full h-full pointer-events-none"
          style={{
            borderRadius: element.style.borderRadius,
            objectFit: element.style.objectFit || "cover",
          }}
        />
      ) : element.type === "social" ? (
        <div
          className="w-full h-full flex pointer-events-none"
          style={{
            gap: element.style.gap || "10px",
            flexDirection: element.style.flexDirection || "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {element.socialLinks?.map((link, i) => (
            <div
              key={link.id || i}
              style={{
                color: link.iconColor || element.style.color,
                backgroundColor: link.backgroundColor || "transparent",
                padding: "4px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
              }}
            >
              {renderSocialIcon(
                link.platform,
                link.iconColor || element.style.color || "#000",
                "20px"
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="w-full h-full break-words whitespace-pre-wrap"
          style={{ padding: element.style.padding }}
        >
          {element.content}
        </div>
      )}

      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(element.id);
          }}
          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground p-1 rounded-full shadow-sm hover:bg-destructive/90 transition-colors z-50"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
