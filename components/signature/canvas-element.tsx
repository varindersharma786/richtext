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
  type: "text" | "image" | "social" | "spacer" | "divider" | "button";
  content: string;
  icon?: string;
  url?: string;
  socialLinks?: any[];
  style: React.CSSProperties & {
    objectFit?: "cover" | "contain" | "fill";
    gap?: string;
    flexDirection?: "row" | "column";
    width?: string;
    height?: string;
  };
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  isSelected: boolean;
  onSelect: (id: string, multi?: boolean) => void;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  gridSize: number;
}

export default function CanvasElement({
  id,
  type,
  content,
  icon,
  url,
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
        onUpdate(id, { position: { x: d.x, y: d.y } });
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
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(id, e.shiftKey);
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
        ) : type === "divider" ? (
          <div
            className="w-full flex items-center"
            style={{
              padding: style.padding,
              height: "100%", // Ensure it takes full height of container if needed, or just auto
            }}
          >
            <hr
              style={{
                width: style.width || "100%",
                borderTopWidth: style.borderWidth || "1px",
                borderTopColor: style.borderColor || "#000",
                borderTopStyle: (style.borderStyle as any) || "solid",
                margin: style.margin,
              }}
            />
          </div>
        ) : type === "spacer" ? (
          <div
            style={{
              height: style.height || "20px",
              width: "100%",
              backgroundColor: "transparent", // Visible in edit mode?
            }}
            className="border border-dashed border-gray-200 opacity-50 relative group-hover:opacity-100 transition-opacity"
          >
            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400 select-none">
              Spacer ({style.height})
            </span>
          </div>
        ) : type === "button" ? (
          <div
            className="w-full h-full flex"
            style={{
              justifyContent: style.textAlign || "left",
              padding: style.padding,
            }}
          >
            <a
              href={url || "#"}
              className="inline-block text-center no-underline"
              style={{
                backgroundColor: style.backgroundColor || "#000",
                color: style.color || "#fff",
                borderRadius: style.borderRadius || "4px",
                padding: "8px 16px", // Internal padding
                fontSize: style.fontSize || "14px",
                fontWeight: style.fontWeight || "normal",
                fontFamily: style.fontFamily || "Arial, sans-serif",
                textDecoration: "none",
                ...style, // Allow overrides
                margin: undefined, // Reset container margin
              }}
              onClick={(e) => e.preventDefault()} // Prevent navigation in editor
            >
              {content}
            </a>
          </div>
        ) : (
          <div
            className="w-full h-full break-words whitespace-pre-wrap"
            style={{
              padding: style.padding,
              fontFamily: style.fontFamily,
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              fontStyle: style.fontStyle,
              textDecoration: style.textDecoration,
              textAlign: style.textAlign,
              lineHeight: style.lineHeight,
              color: style.color,
            }}
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
