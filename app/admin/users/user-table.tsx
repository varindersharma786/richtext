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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Shield,
  ShieldAlert,
  UserX,
  CheckCircle2,
  Ban,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  updateUserPlan,
  updateUserRole,
  toggleUserBlock,
  deleteUser,
} from "./actions";

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  plan: "free" | "basic" | "pro";
  role: "user" | "admin";
  is_blocked: boolean;
  created_at: string;
}

interface UserTableProps {
  initialUsers: User[];
  initialCount: number;
}

export default function UserTable({
  initialUsers,
  initialCount,
}: UserTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlanChange = async (
    userId: string,
    plan: "free" | "basic" | "pro"
  ) => {
    try {
      await updateUserPlan(userId, plan);
      toast.success(`User plan updated to ${plan}`);
    } catch (error) {
      toast.error("Failed to update plan");
    }
  };

  const handleRoleChange = async (userId: string, role: "user" | "admin") => {
    try {
      await updateUserRole(userId, role);
      toast.success(`User role updated to ${role}`);
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleBlockToggle = async (userId: string, isBlocked: boolean) => {
    try {
      await toggleUserBlock(userId, isBlocked);
      toast.success(isBlocked ? "User blocked" : "User unblocked");
    } catch (error) {
      toast.error("Failed to update block status");
    }
  };

  const handleDelete = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    )
      return;

    try {
      await deleteUser(userId);
      toast.success("User deleted");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          Total Users: {initialCount}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>
                      {user.full_name?.[0] || user.email?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.full_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.plan === "pro"
                        ? "default"
                        : user.plan === "basic"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {user.plan}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.role === "admin" && (
                      <Shield className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="capitalize">{user.role}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {user.is_blocked ? (
                    <Badge
                      variant="destructive"
                      className="flex w-fit items-center gap-1"
                    >
                      <Ban className="h-3 w-3" /> Blocked
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="flex w-fit items-center gap-1 text-green-600 border-green-200 bg-green-50"
                    >
                      <CheckCircle2 className="h-3 w-3" /> Active
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(user.id)}
                      >
                        Copy ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Change Plan</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handlePlanChange(user.id, "free")}
                      >
                        Set to Free
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handlePlanChange(user.id, "basic")}
                      >
                        Set to Basic
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handlePlanChange(user.id, "pro")}
                      >
                        Set to Pro
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Role & Access</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          handleRoleChange(
                            user.id,
                            user.role === "admin" ? "user" : "admin"
                          )
                        }
                      >
                        {user.role === "admin"
                          ? "Demote to User"
                          : "Promote to Admin"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleBlockToggle(user.id, !user.is_blocked)
                        }
                      >
                        {user.is_blocked ? "Unblock User" : "Block User"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600"
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
