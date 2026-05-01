import { useState } from "react";
import { useListProjects, ListProjectsStatus } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Search, Briefcase, Calendar, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProjects() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: projects, isLoading } = useListProjects({
    status: statusFilter !== "all" ? statusFilter as ListProjectsStatus : undefined
  });

  const filteredProjects = projects?.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.className.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    if (status === "open") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (status === "closed") return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    return "text-slate-400 bg-slate-400/10 border-slate-400/20";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">System Projects</h1>
          <p className="text-slate-400">Overview of all active and past projects.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Search projects..." 
            className="pl-9 bg-[#0F172A]/50 border-slate-800 focus-visible:ring-orange-500/50 text-white backdrop-blur-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          {['all', 'open', 'closed', 'draft'].map((status) => (
            <Badge
              key={status}
              variant="outline"
              className={`cursor-pointer capitalize transition-colors ${
                statusFilter === status 
                  ? 'bg-slate-700 text-white border-slate-600' 
                  : 'bg-[#0F172A]/50 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-[#0F172A]/50 border-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4 bg-slate-800" />
                <Skeleton className="h-4 w-full bg-slate-800" />
                <Skeleton className="h-4 w-5/6 bg-slate-800" />
                <div className="flex justify-between pt-4">
                  <Skeleton className="h-5 w-20 bg-slate-800" />
                  <Skeleton className="h-5 w-24 bg-slate-800" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredProjects?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            No projects found matching your criteria.
          </div>
        ) : (
          filteredProjects?.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="bg-[#0F172A]/50 border-slate-800/50 backdrop-blur-sm hover:border-orange-500/30 transition-colors group h-full flex flex-col">
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className={`${getStatusColor(project.status)} capitalize`}>
                      {project.status === "open" ? <CheckCircle className="w-3 h-3 mr-1" /> : null}
                      {project.status}
                    </Badge>
                    <div className="text-xs font-medium text-slate-500 flex items-center">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {project.className}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-orange-400 transition-colors">{project.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-1">
                    {project.description}
                  </p>
                  
                  <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center mt-auto">
                    <div className="flex items-center text-xs text-slate-400">
                      <Calendar className="w-4 h-4 mr-1.5 text-slate-500" />
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </div>
                    <div className="text-xs font-medium text-slate-300">
                      <span className="text-orange-500 font-bold">{project.submissionCount}</span> subs
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
