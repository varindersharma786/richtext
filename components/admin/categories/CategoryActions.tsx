"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface CategoryActionsProps {
  category: {
    id: string;
    name: string;
    is_active: boolean;
  };
}

export default function CategoryActions({ category }: CategoryActionsProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleEdit = () => {
    router.push(`/admin/categories/${category.id}`);
  };

  const handleToggleActive = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("categories")
        .update({ is_active: !category.is_active })
        .eq("id", category.id);

      if (error) throw error;

      toast.success(
        `Category ${category.is_active ? "deactivated" : "activated"} successfully`
      );
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", category.id);

      if (error) throw error;

      toast.success("Category deleted successfully");
      setShowDeleteDialog(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={loading}>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleActive}>
            {category.is_active ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{category.name}". Products in this
              category will be uncategorized. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
