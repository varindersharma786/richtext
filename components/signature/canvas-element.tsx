"use client";

import { Rnd } from "react-rnd";
import {
  X,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Globe,
  Mail,
  Phone,
  Share2,
} from "lucide-react";

interface CanvasElementProps {
  id: string;
  type: "text" | "image" | "social";
  content: string;
  icon?: string;
  socialLinks?: any[];
  style: React.CSSProperties & {
    objectFit?: "cover" | "contain" | "fill";
    gap?: string;
    flexDirection?: "row" | "column";
  };
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  gridSize: number;
}

export default function CanvasElement({
  id,
  type,
  content,
  icon,
  socialLinks,
  style,
  position,
  size,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  gridSize,
}: CanvasElementProps) {
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
    <Rnd
      position={{ x: position.x, y: position.y }}
      size={{ width: size.width, height: size.height }}
      onDragStop={(e, d) => {
        onUpdate(id, { position: { x: d.x, y: d.y } });
      }}
      onDrag={(e, d) => {
        // Optional: Real-time updates for smoother guides, but might be performance heavy
        // onUpdate(id, { position: { x: d.x, y: d.y } })
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdate(id, {
          size: { width: ref.style.width, height: ref.style.height },
          position,
        });
      }}
      bounds="parent"
      dragGrid={[gridSize, gridSize]}
      resizeGrid={[gridSize, gridSize]}
      className={`group ${
        isSelected
          ? "ring-2 ring-primary"
          : "hover:ring-1 hover:ring-primary/50"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      <div className="w-full h-full relative" style={{ ...style, padding: 0 }}>
        {type === "image" ? (
          <img
            src={content}
            alt="Signature element"
            className="w-full h-full pointer-events-none"
            style={{
              borderRadius: style.borderRadius,
              objectFit: style.objectFit || "cover",
            }}
          />
        ) : type === "social" ? (
          <div
            className="w-full h-full flex pointer-events-none"
            style={{
              gap: style.gap || "10px",
              flexDirection: style.flexDirection || "row",
              alignItems: "center",
              justifyContent: "flex-start", // Or center?
            }}
          >
            {socialLinks?.map((link, i) => (
              <div
                key={link.id || i}
                style={{
                  color: link.iconColor || style.color,
                  backgroundColor: link.backgroundColor || "transparent",
                  padding: "4px", // Inner padding for icon bg
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px", // Fixed size for consistency? Or dynamic?
                  height: "32px",
                }}
              >
                {renderSocialIcon(
                  link.platform,
                  link.iconColor || style.color,
                  "20px"
                )}
              </div>
            ))}
            {/* Fallback for legacy single icon */}
            {!socialLinks &&
              icon &&
              renderSocialIcon(icon, style.color || "#000")}
          </div>
        ) : (
          <div
            className="w-full h-full break-words whitespace-pre-wrap"
            style={{ padding: style.padding }}
          >
            {content}
          </div>
        )}

        {isSelected && (
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground p-1 rounded-full shadow-sm hover:bg-destructive/90 transition-colors z-50"
          >
            <X size={12} />
          </button>
        )}
      </div>
    </Rnd>
  );
}
