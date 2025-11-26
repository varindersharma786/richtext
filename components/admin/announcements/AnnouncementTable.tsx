"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Announcement {
  id: string;
  message: string;
  link_url: string | null;
  link_text: string | null;
  background_color: string;
  text_color: string;
  is_active: boolean;
  display_order: number;
}

export default function AnnouncementTable({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState<string | null>(null);

  const toggleActive = async (id: string, currentState: boolean) => {
    setLoading(id);
    try {
      const { error } = await supabase
        .from("announcements")
        .update({ is_active: !currentState })
        .eq("id", id);

      if (error) throw error;

      toast.success(
        `Announcement ${!currentState ? "activated" : "deactivated"}`
      );
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update announcement");
    } finally {
      setLoading(null);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    setLoading(id);
    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Announcement deleted");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete announcement");
    } finally {
      setLoading(null);
    }
  };

  if (announcements.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground mb-4">No announcements yet</p>
        <Link href="/admin/announcements/new">
          <Button>Create your first announcement</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Message</TableHead>
            <TableHead>Colors</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.map((announcement) => (
            <TableRow key={announcement.id}>
              <TableCell className="font-medium max-w-md">
                <div className="truncate">{announcement.message}</div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: announcement.background_color }}
                    title={`BG: ${announcement.background_color}`}
                  />
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: announcement.text_color }}
                    title={`Text: ${announcement.text_color}`}
                  />
                </div>
              </TableCell>
              <TableCell>
                {announcement.link_url ? (
                  <span className="text-xs text-blue-600">
                    {announcement.link_text || "Link"}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">No link</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={announcement.is_active ? "default" : "secondary"}
                >
                  {announcement.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{announcement.display_order}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      toggleActive(announcement.id, announcement.is_active)
                    }
                    disabled={loading === announcement.id}
                  >
                    {announcement.is_active ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Link href={`/admin/announcements/${announcement.id}`}>
                    <Button size="icon" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteAnnouncement(announcement.id)}
                    disabled={loading === announcement.id}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
