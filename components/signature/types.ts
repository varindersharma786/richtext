import { CSSProperties } from "react";

export interface SignatureElement {
    id: string;
    type: "text" | "image" | "social" | "spacer";
    content: any;
    icon?: string; // Legacy/Single icon
    url?: string;
    socialLinks?: SocialLink[];
    style: CSSProperties & {
        padding?: string;
        margin?: string;
        borderRadius?: string;
        backgroundColor?: string;
        fontFamily?: string;
        borderWidth?: string;
        borderColor?: string;
        borderStyle?: string;
        objectFit?: "cover" | "contain" | "fill";
        gap?: string;
        flexDirection?: "row" | "column";
    };
}

export interface SocialLink {
    id: string;
    platform: string;
    url: string;
    iconColor?: string;
    backgroundColor?: string;
}

export interface Column {
    id: string;
    width: number; // Percentage (0-100)
    elements: SignatureElement[];
    style: CSSProperties & {
        padding?: string;
        borderWidth?: string;
        borderColor?: string;
        borderStyle?: string;
        verticalAlign?: "top" | "middle" | "bottom";
    };
}

export interface Row {
    id: string;
    columns: Column[];
    style: CSSProperties & {
        padding?: string;
        backgroundColor?: string;
        borderWidth?: string;
        borderColor?: string;
        borderStyle?: string;
        gap?: string; // Spacing between columns
    };
}

export interface SignatureState {
    rows: Row[];
}
