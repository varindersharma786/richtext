import { v4 as uuidv4 } from "uuid";
import { SignatureElement } from "./signature-builder";

export interface SignatureData {
    fullName: string;
    jobTitle: string;
    company: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    avatarUrl: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
}

export interface SignatureTemplate {
    id: string;
    name: string;
    description: string;
    generate: (data: SignatureData) => SignatureElement[];
}

export const templates: SignatureTemplate[] = [
    {
        id: "modern-horizontal",
        name: "Modern Horizontal",
        description: "Clean, horizontal layout with avatar on the left.",
        generate: (data) => {
            const elements: SignatureElement[] = [];
            let x = 20;
            let y = 20;

            // Avatar
            if (data.avatarUrl) {
                elements.push({
                    id: uuidv4(),
                    type: "image",
                    content: data.avatarUrl,
                    position: { x, y },
                    size: { width: 100, height: 100 },
                    style: {
                        borderRadius: "50%",
                        objectFit: "cover",
                        borderWidth: "0px",
                        borderColor: "#000000",
                        borderStyle: "solid",
                        padding: "0px",
                        margin: "0px",
                        backgroundColor: "transparent",
                        fontFamily: "Arial, sans-serif",
                    },
                });
                x += 120;
            }

            // Name
            elements.push({
                id: uuidv4(),
                type: "text",
                content: data.fullName,
                position: { x, y },
                size: { width: 300, height: 30 },
                style: {
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#000000",
                    textAlign: "left",
                    fontStyle: "normal",
                    textDecoration: "none",
                    padding: "0px",
                    margin: "0px",
                    borderRadius: "0px",
                    backgroundColor: "transparent",
                    fontFamily: "Arial, sans-serif",
                    borderWidth: "0px",
                    borderColor: "#000000",
                    borderStyle: "solid",
                },
            });
            y += 30;

            // Title & Company
            elements.push({
                id: uuidv4(),
                type: "text",
                content: `${data.jobTitle} | ${data.company}`,
                position: { x, y },
                size: { width: 300, height: 25 },
                style: {
                    fontSize: "14px",
                    color: "#666666",
                    textAlign: "left",
                    fontWeight: "normal",
                    fontStyle: "normal",
                    textDecoration: "none",
                    padding: "0px",
                    margin: "0px",
                    borderRadius: "0px",
                    backgroundColor: "transparent",
                    fontFamily: "Arial, sans-serif",
                    borderWidth: "0px",
                    borderColor: "#000000",
                    borderStyle: "solid",
                },
            });
            y += 30;

            // Contact Info
            const contactInfo = [data.email, data.phone, data.website, data.address]
                .filter(Boolean)
                .join(" • ");

            if (contactInfo) {
                elements.push({
                    id: uuidv4(),
                    type: "text",
                    content: contactInfo,
                    position: { x, y },
                    size: { width: 400, height: 20 },
                    style: {
                        fontSize: "12px",
                        color: "#444444",
                        textAlign: "left",
                        fontWeight: "normal",
                        fontStyle: "normal",
                        textDecoration: "none",
                        padding: "0px",
                        margin: "0px",
                        borderRadius: "0px",
                        backgroundColor: "transparent",
                        fontFamily: "Arial, sans-serif",
                        borderWidth: "0px",
                        borderColor: "#000000",
                        borderStyle: "solid",
                    },
                });
                y += 25;
            }

            // Social Links
            const socialLinks = [];
            if (data.linkedin) socialLinks.push({ id: uuidv4(), platform: "linkedin", url: data.linkedin, iconColor: "#0A66C2" });
            if (data.twitter) socialLinks.push({ id: uuidv4(), platform: "twitter", url: data.twitter, iconColor: "#1DA1F2" });
            if (data.facebook) socialLinks.push({ id: uuidv4(), platform: "facebook", url: data.facebook, iconColor: "#1877F2" });
            if (data.instagram) socialLinks.push({ id: uuidv4(), platform: "instagram", url: data.instagram, iconColor: "#E4405F" });

            if (socialLinks.length > 0) {
                elements.push({
                    id: uuidv4(),
                    type: "social",
                    content: "",
                    position: { x, y },
                    size: { width: 200, height: 30 },
                    socialLinks: socialLinks,
                    style: {
                        gap: "10px",
                        flexDirection: "row",
                        fontSize: "16px",
                        color: "#000000",
                        textAlign: "left",
                        fontWeight: "normal",
                        fontStyle: "normal",
                        textDecoration: "none",
                        padding: "0px",
                        margin: "0px",
                        borderRadius: "4px",
                        backgroundColor: "transparent",
                        fontFamily: "Arial, sans-serif",
                        borderWidth: "0px",
                        borderColor: "#000000",
                        borderStyle: "solid",
                    }
                });
            }

            return elements;
        },
    },
    {
        id: "classic-vertical",
        name: "Classic Vertical",
        description: "Traditional vertical layout, centered.",
        generate: (data) => {
            const elements: SignatureElement[] = [];
            let y = 20;
            const centerX = 200; // Assuming 600px width canvas, but let's center around 300

            // Avatar
            if (data.avatarUrl) {
                elements.push({
                    id: uuidv4(),
                    type: "image",
                    content: data.avatarUrl,
                    position: { x: 250, y },
                    size: { width: 100, height: 100 },
                    style: {
                        borderRadius: "50%",
                        objectFit: "cover",
                        borderWidth: "0px",
                        borderColor: "#000000",
                        borderStyle: "solid",
                        padding: "0px",
                        margin: "0px",
                        backgroundColor: "transparent",
                        fontFamily: "Arial, sans-serif",
                    },
                });
                y += 110;
            }

            // Name
            elements.push({
                id: uuidv4(),
                type: "text",
                content: data.fullName,
                position: { x: 100, y },
                size: { width: 400, height: 30 },
                style: {
                    fontSize: "22px",
                    fontWeight: "bold",
                    color: "#000000",
                    textAlign: "center",
                    fontStyle: "normal",
                    textDecoration: "none",
                    padding: "0px",
                    margin: "0px",
                    borderRadius: "0px",
                    backgroundColor: "transparent",
                    fontFamily: "Arial, sans-serif",
                    borderWidth: "0px",
                    borderColor: "#000000",
                    borderStyle: "solid",
                },
            });
            y += 35;

            // Title
            elements.push({
                id: uuidv4(),
                type: "text",
                content: data.jobTitle,
                position: { x: 100, y },
                size: { width: 400, height: 25 },
                style: {
                    fontSize: "16px",
                    color: "#444444",
                    textAlign: "center",
                    fontWeight: "normal",
                    fontStyle: "normal",
                    textDecoration: "none",
                    padding: "0px",
                    margin: "0px",
                    borderRadius: "0px",
                    backgroundColor: "transparent",
                    fontFamily: "Arial, sans-serif",
                    borderWidth: "0px",
                    borderColor: "#000000",
                    borderStyle: "solid",
                },
            });
            y += 25;

            // Company
            elements.push({
                id: uuidv4(),
                type: "text",
                content: data.company,
                position: { x: 100, y },
                size: { width: 400, height: 25 },
                style: {
                    fontSize: "16px",
                    color: "#666666",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontStyle: "normal",
                    textDecoration: "none",
                    padding: "0px",
                    margin: "0px",
                    borderRadius: "0px",
                    backgroundColor: "transparent",
                    fontFamily: "Arial, sans-serif",
                    borderWidth: "0px",
                    borderColor: "#000000",
                    borderStyle: "solid",
                },
            });
            y += 30;

            // Contact Info (Vertical Stack)
            const contacts = [data.email, data.phone, data.website, data.address].filter(Boolean);
            contacts.forEach(contact => {
                elements.push({
                    id: uuidv4(),
                    type: "text",
                    content: contact,
                    position: { x: 100, y },
                    size: { width: 400, height: 20 },
                    style: {
                        fontSize: "12px",
                        color: "#444444",
                        textAlign: "center",
                        fontWeight: "normal",
                        fontStyle: "normal",
                        textDecoration: "none",
                        padding: "0px",
                        margin: "0px",
                        borderRadius: "0px",
                        backgroundColor: "transparent",
                        fontFamily: "Arial, sans-serif",
                        borderWidth: "0px",
                        borderColor: "#000000",
                        borderStyle: "solid",
                    },
                });
                y += 20;
            });

            y += 10;

            // Social Links
            const socialLinks = [];
            if (data.linkedin) socialLinks.push({ id: uuidv4(), platform: "linkedin", url: data.linkedin, iconColor: "#0A66C2" });
            if (data.twitter) socialLinks.push({ id: uuidv4(), platform: "twitter", url: data.twitter, iconColor: "#1DA1F2" });
            if (data.facebook) socialLinks.push({ id: uuidv4(), platform: "facebook", url: data.facebook, iconColor: "#1877F2" });
            if (data.instagram) socialLinks.push({ id: uuidv4(), platform: "instagram", url: data.instagram, iconColor: "#E4405F" });

            if (socialLinks.length > 0) {
                elements.push({
                    id: uuidv4(),
                    type: "social",
                    content: "",
                    position: { x: 300 - (socialLinks.length * 40) / 2, y }, // Rough centering
                    size: { width: socialLinks.length * 40, height: 30 },
                    socialLinks: socialLinks,
                    style: {
                        gap: "10px",
                        flexDirection: "row",
                        fontSize: "16px",
                        color: "#000000",
                        textAlign: "center",
                        fontWeight: "normal",
                        fontStyle: "normal",
                        textDecoration: "none",
                        padding: "0px",
                        margin: "0px",
                        borderRadius: "4px",
                        backgroundColor: "transparent",
                        fontFamily: "Arial, sans-serif",
                        borderWidth: "0px",
                        borderColor: "#000000",
                        borderStyle: "solid",
                    }
                });
            }

            return elements;
        },
    },
    {
        id: "minimal-sidebar",
        name: "Minimal Sidebar",
        description: "Colored sidebar with minimal details.",
        generate: (data) => {
            const elements: SignatureElement[] = [];

            // Sidebar
            elements.push({
                id: uuidv4(),
                type: "text", // Using text element as a shape for now
                content: "",
                position: { x: 20, y: 20 },
                size: { width: 5, height: 150 },
                style: {
                    backgroundColor: "#000000",
                    fontSize: "1px",
                    color: "transparent",
                    textAlign: "left",
                    fontWeight: "normal",
                    fontStyle: "normal",
                    textDecoration: "none",
                    padding: "0px",
                    margin: "0px",
                    borderRadius: "0px",
                    fontFamily: "Arial, sans-serif",
                    borderWidth: "0px",
                    borderColor: "#000000",
                    borderStyle: "solid",
                }
            });

            let x = 40;
            let y = 20;

            // Name
            elements.push({
                id: uuidv4(),
                type: "text",
                content: data.fullName.toUpperCase(),
                position: { x, y },
                size: { width: 300, height: 25 },
                style: {
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#000000",
                    textAlign: "left",
                    fontStyle: "normal",
                    textDecoration: "none",
                    padding: "0px",
                    margin: "0px",
                    borderRadius: "0px",
                    backgroundColor: "transparent",
                    fontFamily: "Arial, sans-serif",
                    borderWidth: "0px",
                    borderColor: "#000000",
                    borderStyle: "solid",
                    letterSpacing: "2px"
                } as any, // Cast to any for letterSpacing
            });
            y += 25;

            // Title
            elements.push({
                id: uuidv4(),
                type: "text",
                content: data.jobTitle,
                position: { x, y },
                size: { width: 300, height: 20 },
                style: {
                    fontSize: "12px",
                    color: "#666666",
                    textAlign: "left",
                    fontWeight: "normal",
                    fontStyle: "normal",
                    textDecoration: "none",
                    padding: "0px",
                    margin: "0px",
                    borderRadius: "0px",
                    backgroundColor: "transparent",
                    fontFamily: "Arial, sans-serif",
                    borderWidth: "0px",
                    borderColor: "#000000",
                    borderStyle: "solid",
                },
            });
            y += 30;

            // Details
            [data.email, data.phone, data.website].filter(Boolean).forEach(detail => {
                elements.push({
                    id: uuidv4(),
                    type: "text",
                    content: detail,
                    position: { x, y },
                    size: { width: 300, height: 18 },
                    style: {
                        fontSize: "11px",
                        color: "#444444",
                        textAlign: "left",
                        fontWeight: "normal",
                        fontStyle: "normal",
                        textDecoration: "none",
                        padding: "0px",
                        margin: "0px",
                        borderRadius: "0px",
                        backgroundColor: "transparent",
                        fontFamily: "Arial, sans-serif",
                        borderWidth: "0px",
                        borderColor: "#000000",
                        borderStyle: "solid",
                    },
                });
                y += 18;
            });

            return elements;
        }
    }
];
