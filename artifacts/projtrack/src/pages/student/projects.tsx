import { useState } from "react";
import { useListProjects, useCreateSubmission } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Search, Briefcase, Calendar, UploadCloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { getListSubmissionsQueryKey } from "@workspace/api-client-react";

export default function StudentProjects() {
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  const queryClient = useQueryClient();
  const { data: projects, isLoading } = useListProjects({ status: 'open' });
  const submitMutation = useCreateSubmission();

  const [formData, setFormData] = useState({
    content: "",
    fileUrl: ""
  });

  const filteredProjects = projects?.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.className.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      await submitMutation.mutateAsync({ 
        data: {
          projectId: selectedProject.id,
          content: formData.content,
          fileUrl: formData.fileUrl || undefined
        } 
      });
      queryClient.invalidateQueries({ queryKey: getListSubmissionsQueryKey() });
      toast.success("Assignment submitted successfully!");
      setSelectedProject(null);
      setFormData({ content: "", fileUrl: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit assignment");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Open Projects</h1>
          <p className="text-slate-400">Browse and submit assignments for your classes.</p>
        </div>
      </div>

      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input 
          placeholder="Search projects..." 
          className="pl-9 bg-[#0F172A]/50 border-slate-800 focus-visible:ring-cyan-500/50 text-white backdrop-blur-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-[#0F172A]/50 border-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4 bg-slate-800" />
                <Skeleton className="h-4 w-full bg-slate-800" />
                <Skeleton className="h-4 w-5/6 bg-slate-800" />
                <div className="flex justify-between pt-4 mt-4 border-t border-slate-800/50">
                  <Skeleton className="h-8 w-24 bg-slate-800 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredProjects?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            No open projects found. You're all caught up!
          </div>
        ) : (
          filteredProjects?.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="bg-[#0F172A]/50 border-slate-800/50 backdrop-blur-sm hover:border-cyan-500/30 transition-colors group h-full flex flex-col">
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded">
                      Max Score: {project.maxScore}
                    </div>
                    <div className="text-xs font-medium text-cyan-400 bg-cyan-900/20 px-2 py-1 rounded flex items-center">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {project.className}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-1">
                    {project.description}
                  </p>
                  
                  <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center mt-auto">
                    <div className="flex items-center text-xs text-slate-300">
                      <Calendar className="w-4 h-4 mr-1.5 text-slate-500" />
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                      onClick={() => setSelectedProject(project)}
                    >
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="bg-[#0F172A] border-slate-800 text-slate-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="mt-2">
              <div className="bg-[#0A0A0F] p-4 rounded-lg border border-slate-800 mb-6">
                <h3 className="font-bold text-lg text-white mb-1">{selectedProject.title}</h3>
                <p className="text-sm text-slate-400">{selectedProject.description}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Submission Content</Label>
                  <Textarea 
                    id="content" 
                    required 
                    rows={6}
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    placeholder="Write your submission content, provide links to repositories, etc..."
                    className="bg-[#0A0A0F] border-slate-800 resize-none font-mono text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fileUrl">Attachment URL (Optional)</Label>
                  <div className="flex">
                    <div className="flex items-center justify-center px-3 border border-r-0 border-slate-800 bg-[#0A0A0F] text-slate-500 rounded-l-md">
                      <UploadCloud className="w-4 h-4" />
                    </div>
                    <Input 
                      id="fileUrl" 
                      type="url"
                      value={formData.fileUrl}
                      onChange={e => setFormData({...formData, fileUrl: e.target.value})}
                      placeholder="https://drive.google.com/..."
                      className="bg-[#0A0A0F] border-slate-800 rounded-l-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setSelectedProject(null)}>Cancel</Button>
                  <Button type="submit" disabled={submitMutation.isPending} className="bg-cyan-600 hover:bg-cyan-700 text-white min-w-32">
                    {submitMutation.isPending ? "Submitting..." : "Submit Assignment"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
