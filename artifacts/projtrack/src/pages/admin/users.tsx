import { useState } from "react";
import { useListUsers, useCreateUser, useDeleteUser, CreateUserBodyRole } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Search, Plus, Trash2, Edit, MoreVertical, Shield, GraduationCap, Users as UsersIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { getListUsersQueryKey } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useListUsers({
    search: search || undefined,
    role: roleFilter !== "all" ? roleFilter as any : undefined
  });

  const deleteMutation = useDeleteUser();
  const createMutation = useCreateUser();

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteMutation.mutateAsync({ userId: id });
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
        toast.success("User deleted successfully");
      } catch (err: any) {
        toast.error(err.message || "Failed to delete user");
      }
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as CreateUserBodyRole,
    department: ""
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({ data: formData });
      queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
      toast.success("User created successfully");
      setIsCreateOpen(false);
      setFormData({ name: "", email: "", password: "", role: "student", department: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to create user");
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === "admin") return <Shield className="w-4 h-4 text-orange-500" />;
    if (role === "teacher") return <GraduationCap className="w-4 h-4 text-purple-500" />;
    return <UsersIcon className="w-4 h-4 text-cyan-500" />;
  };

  const getRoleColor = (role: string) => {
    if (role === "admin") return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    if (role === "teacher") return "text-purple-500 bg-purple-500/10 border-purple-500/20";
    return "text-cyan-500 bg-cyan-500/10 border-cyan-500/20";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">User Management</h1>
          <p className="text-slate-400">Manage all users across the platform.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0F172A] border-slate-800 text-slate-100">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-[#0A0A0F] border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-[#0A0A0F] border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="bg-[#0A0A0F] border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(v: CreateUserBodyRole) => setFormData({...formData, role: v})}>
                  <SelectTrigger className="bg-[#0A0A0F] border-slate-800">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F172A] border-slate-800 text-slate-100">
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department (Optional)</Label>
                <Input id="department" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="bg-[#0A0A0F] border-slate-800" />
              </div>
              <Button type="submit" disabled={createMutation.isPending} className="w-full bg-orange-500 hover:bg-orange-600">
                {createMutation.isPending ? "Creating..." : "Create User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[#0F172A]/50 border-slate-800/50 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-800/50 pb-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Search users..." 
                className="pl-9 bg-[#0A0A0F]/50 border-slate-800 focus-visible:ring-orange-500/50 text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              {['all', 'admin', 'teacher', 'student'].map((role) => (
                <Badge
                  key={role}
                  variant="outline"
                  className={`cursor-pointer capitalize transition-colors ${
                    roleFilter === role 
                      ? 'bg-slate-700 text-white border-slate-600' 
                      : 'bg-transparent text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                  onClick={() => setRoleFilter(role)}
                >
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#0A0A0F]/50">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">User</TableHead>
                <TableHead className="text-slate-400">Identifier</TableHead>
                <TableHead className="text-slate-400">Role</TableHead>
                <TableHead className="text-slate-400">Department</TableHead>
                <TableHead className="text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-slate-800/50">
                    <TableCell><Skeleton className="h-10 w-48 bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24 bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32 bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto bg-slate-800" /></TableCell>
                  </TableRow>
                ))
              ) : users?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                    No users found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                users?.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white border border-slate-700">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300 font-mono text-sm">{user.identifier}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`flex w-fit items-center space-x-1.5 px-2.5 py-0.5 ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400">{user.department || "—"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0F172A] border-slate-800 text-slate-200">
                          <DropdownMenuItem className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" /> Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(user.id)}
                            disabled={deleteMutation.isPending}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 focus:bg-red-400/10 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
