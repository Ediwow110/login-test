import { useState } from "react";
import { useListClasses, useCreateClass } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Search, Plus, BookOpen, Users, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { getListClassesQueryKey } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminClasses() {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: classes, isLoading } = useListClasses();
  const createMutation = useCreateClass();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    department: ""
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({ data: formData });
      queryClient.invalidateQueries({ queryKey: getListClassesQueryKey() });
      toast.success("Class created successfully");
      setIsCreateOpen(false);
      setFormData({ name: "", code: "", department: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to create class");
    }
  };

  const filteredClasses = classes?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Classes</h1>
          <p className="text-slate-400">Manage all academic classes.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0F172A] border-slate-800 text-slate-100">
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Class Name</Label>
                <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-[#0A0A0F] border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Class Code</Label>
                <Input id="code" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="bg-[#0A0A0F] border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="bg-[#0A0A0F] border-slate-800" />
              </div>
              <Button type="submit" disabled={createMutation.isPending} className="w-full bg-orange-500 hover:bg-orange-600">
                {createMutation.isPending ? "Creating..." : "Create Class"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[#0F172A]/50 border-slate-800/50 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-800/50 pb-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Search classes..." 
              className="pl-9 bg-[#0A0A0F]/50 border-slate-800 focus-visible:ring-orange-500/50 text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#0A0A0F]/50">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">Class Name & Code</TableHead>
                <TableHead className="text-slate-400">Department</TableHead>
                <TableHead className="text-slate-400">Teacher</TableHead>
                <TableHead className="text-slate-400 text-right">Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-slate-800/50">
                    <TableCell><Skeleton className="h-10 w-48 bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24 bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32 bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-12 ml-auto bg-slate-800" /></TableCell>
                  </TableRow>
                ))
              ) : filteredClasses?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    No classes found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClasses?.map((cls, i) => (
                  <motion.tr
                    key={cls.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                          <BookOpen className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{cls.name}</p>
                          <div className="flex items-center text-xs text-slate-500 mt-1">
                            <Hash className="w-3 h-3 mr-1" />
                            {cls.code}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{cls.department || "—"}</TableCell>
                    <TableCell className="text-slate-300">{cls.teacherName}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-800/50 border border-slate-700">
                        <Users className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                        <span className="text-white font-medium">{cls.studentCount}</span>
                      </div>
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
