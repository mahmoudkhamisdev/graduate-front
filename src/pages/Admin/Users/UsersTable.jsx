"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { Badge } from "src/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Checkbox } from "src/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "src/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import { Label } from "src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { Switch } from "src/components/ui/switch";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronDown,
  X,
  Settings2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { BaseUrlApi, ErrorMessage } from "../../../lib/api";
import { Skeleton } from "../../../components/ui/skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

// interface User {
//   _id
//   name
//   email
//   role
//   points: number
//   isEmailVerified: boolean
//   isActive: boolean
//   createdAt
//   updatedAt
//   lastLogin?
//   avatar?
//   subscription?: {
//     isActive: boolean
//     plan?: any
//   }
// }

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [roleFilter, setRoleFilter] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    points: 0,
    isActive: true,
    isEmailVerified: false,
  });

  // Status and role counts
  const statusCounts = {
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
  };

  const roleCounts = {
    admin: users.filter((u) => u.role === "admin").length,
    user: users.filter((u) => u.role === "user").length,
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        points: editingUser.points,
        isActive: editingUser.isActive,
        isEmailVerified: editingUser.isEmailVerified,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "user",
        points: 0,
        isActive: true,
        isEmailVerified: false,
      });
    }
  }, [editingUser]);

  const loadUsers = async () => {
    try {
      const { data } = await axios.get(`${BaseUrlApi}/users`);
      setUsers(data.data.users);
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      const { data } = await axios.post(`${BaseUrlApi}/users`, userData);
      setUsers([...users, data.data]);
      toast.success("User created successfully");
    } catch (error) {
      toast.error(ErrorMessage(error));
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const { data } = await axios.put(`${BaseUrlApi}/users/${id}`, userData);
      loadUsers();
      toast.success("User updated successfully");
    } catch (error) {
      toast.error(ErrorMessage(error));
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${BaseUrlApi}/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(ErrorMessage(error));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      await updateUser(editingUser._id, formData);
    } else {
      await createUser(formData);
    }
    setDialogOpen(false);
    setEditingUser(null);
  };

  const handleDelete = async (id) => {
    // if (confirm("Are you sure you want to delete this user?")) {
    await deleteUser(id);
    // }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length
        ? []
        : filteredUsers.map((user) => user._id)
    );
  };

  const toggleStatusFilter = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const toggleRoleFilter = (role) => {
    setRoleFilter((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const clearFilters = () => {
    setStatusFilter([]);
    setRoleFilter([]);
    setSearchTerm("");
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter.length === 0 ||
      (statusFilter.includes("active") && user.isActive) ||
      (statusFilter.includes("inactive") && !user.isActive);

    const matchesRole =
      roleFilter.length === 0 || roleFilter.includes(user.role);

    return matchesSearch && matchesStatus && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  if (loading) {
    return (
      <div className="space-y-1">
        <Skeleton className={"w-full h-16 rounded-b-none"} />
        <Skeleton className={"w-full h-80 rounded-none"} />
        <Skeleton className={"w-full h-16 rounded-t-none"} />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div
        variants={itemVariants}
        className="bg-zinc-900 border border-zinc-700 rounded-lg"
      >
        {/* Header with filters */}
        <div className="p-4 border-b border-zinc-700">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Input
                placeholder="Filter users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm placeholder:text-muted-foreground"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-zinc-900">
                    <Settings2 className="h-4 w-4 mr-2" />
                    Status
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-900 border border-zinc-700">
                  <DropdownMenuItem
                    onClick={() => toggleStatusFilter("active")}
                  >
                    <Checkbox
                      checked={statusFilter.includes("active")}
                      className="mr-2"
                    />
                    Active
                    <span className="ml-auto text-muted-foreground">
                      {statusCounts.active}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => toggleStatusFilter("inactive")}
                  >
                    <Checkbox
                      checked={statusFilter.includes("inactive")}
                      className="mr-2"
                    />
                    Inactive
                    <span className="ml-auto text-muted-foreground">
                      {statusCounts.inactive}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-zinc-900">
                    <Settings2 className="h-4 w-4 mr-2" />
                    Role
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-900 border border-zinc-700">
                  <DropdownMenuItem onClick={() => toggleRoleFilter("admin")}>
                    <Checkbox
                      checked={roleFilter.includes("admin")}
                      className="mr-2"
                    />
                    Admin
                    <span className="ml-auto text-muted-foreground">
                      {roleCounts.admin}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleRoleFilter("user")}>
                    <Checkbox
                      checked={roleFilter.includes("user")}
                      className="mr-2"
                    />
                    User
                    <span className="ml-auto text-muted-foreground">
                      {roleCounts.user}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {(statusFilter.length > 0 ||
                roleFilter.length > 0 ||
                searchTerm) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  Reset
                  <X className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleAdd} className="text-black">
                Add User
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-700 hover:bg-muted">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedUsers.length === paginatedUsers.length &&
                      paginatedUsers.length > 0
                    }
                    onCheckedChange={toggleAllUsers}
                  />
                </TableHead>
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground">
                  <div className="flex items-center gap-1">
                    Status
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-muted-foreground">
                  <div className="flex items-center gap-1">
                    Role
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-muted-foreground">Points</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user, index) => (
                <motion.tr
                  key={user._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                  className="border-zinc-700 hover:bg-muted"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user._id)}
                      onCheckedChange={() => toggleUserSelection(user._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.lastLogin
                            ? `Last login: ${new Date(
                                user.lastLogin
                              ).toLocaleDateString()}`
                            : "Never logged in"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          user.isActive ? "bg-green-500" : "bg-gray-500"
                        }`}
                      />
                      <span>{user.isActive ? "Active" : "Inactive"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className={
                        user.role === "admin"
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-800 text-white"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.points}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-zinc-900 border border-zinc-700"
                      >
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-700" />
                        <DropdownMenuItem
                          onClick={() => handleDelete(user._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-700">
          <div className="text-sm text-muted-foreground">
            {selectedUsers.length} of {filteredUsers.length} row(s) selected.
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Rows per page
              </span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(value) => setRowsPerPage(Number(value))}
              >
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* User Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground dark:text-gray-400">
                {editingUser
                  ? "Update user information and settings."
                  : "Create a new user account."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-muted-foreground dark:text-gray-400"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-muted-foreground dark:text-gray-400"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-muted-foreground dark:text-gray-400"
                >
                  Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white">
                    <SelectItem
                      value="user"
                      className="hover:bg-gray-100 dark:hover:bg-zinc-700"
                    >
                      User
                    </SelectItem>
                    <SelectItem
                      value="admin"
                      className="hover:bg-gray-100 dark:hover:bg-zinc-700"
                    >
                      Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="points"
                  className="text-muted-foreground dark:text-gray-400"
                >
                  Points
                </Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      points: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label
                  htmlFor="isActive"
                  className="text-muted-foreground dark:text-gray-400"
                >
                  Active
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isEmailVerified"
                  checked={formData.isEmailVerified}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isEmailVerified: checked })
                  }
                />
                <Label
                  htmlFor="isEmailVerified"
                  className="text-muted-foreground dark:text-gray-400"
                >
                  Email Verified
                </Label>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-white dark:bg-zinc-700 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-600"
                >
                  {editingUser ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
    </motion.div>
  );
}
