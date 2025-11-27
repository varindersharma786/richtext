"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  bucket?: string; // Allow specifying custom bucket
}

export default function ImageUploader({
  value,
  onChange,
  onRemove,
  bucket = "blog-images", // Default bucket
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath);

      onChange(publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }, []);

  const handleRemove = async () => {
    if (value && onRemove) {
      // Extract file path from URL
      const urlParts = value.split("/");
      const fileName = urlParts[urlParts.length - 1];

      try {
        await supabase.storage.from(bucket).remove([fileName]);
        onRemove();
        toast.success("Image removed");
      } catch (error) {
        console.error("Error removing image:", error);
        toast.error("Failed to remove image");
      }
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative group">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-contain w-full"
              objectFit="contain"


            />
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-neutral-900"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-4">
            {isDragging ? (
              <ImageIcon className="h-12 w-12 text-primary" />
            ) : (
              <Upload className="h-12 w-12 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium">
                {isDragging ? "Drop image here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </div>
      )}

      {uploading && (
        <div className="text-sm text-muted-foreground text-center">
          Uploading...
        </div>
      )}
    </div>
  );
}
