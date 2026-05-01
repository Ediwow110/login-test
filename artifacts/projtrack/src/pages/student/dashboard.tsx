import { useGetDashboardStats, useListSubmissions, useListProjects } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Briefcase, CheckCircle, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function StudentDashboard() {
  // In a real app, these would be filtered by student ID on the backend
  const { data: projects, isLoading: projectsLoading } = useListProjects({ status: 'open' });
  const { data: submissions, isLoading: submissionsLoading } = useListSubmissions();

  const mySubmissions = submissions?.filter(s => s.status !== 'draft') || [];
  const pendingSubs = mySubmissions.filter(s => s.status === 'pending').length;
  const approvedSubs = mySubmissions.filter(s => s.status === 'approved').length;

  const statCards = [
    { title: "Open Projects", value: projects?.length || 0, icon: Briefcase, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { title: "My Submissions", value: mySubmissions.length, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Pending Review", value: pendingSubs, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Approved", value: approvedSubs, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Student Dashboard</h1>
          <p className="text-slate-400">Track your progress and upcoming deadlines.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="bg-[#0F172A]/50 border-slate-800/50 backdrop-blur-sm h-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                    {projectsLoading || submissionsLoading ? (
                      <Skeleton className="h-8 w-16 bg-slate-800" />
                    ) : (
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    )}
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="bg-[#0F172A]/50 border-slate-800/50 backdrop-blur-sm h-[400px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800/50">
              <CardTitle className="text-white text-lg">Upcoming Deadlines</CardTitle>
              <Link href="/student/projects">
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20">View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0 custom-scrollbar">
              {projectsLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full bg-slate-800 rounded-lg" />)}
                </div>
              ) : projects?.length === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-500">No open projects</div>
              ) : (
                <div className="divide-y divide-slate-800/50">
                  {projects?.slice(0, 5).map(project => {
                    const deadline = new Date(project.deadline);
                    const isNear = deadline.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;
                    
                    return (
                      <div key={project.id} className="p-4 hover:bg-slate-800/30 transition-colors flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium text-white line-clamp-1">{project.title}</h4>
                          <p className="text-xs text-slate-400 mt-1">{project.className}</p>
                        </div>
                        <div className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${isNear ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-300'}`}>
                          {deadline.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="bg-[#0F172A]/50 border-slate-800/50 backdrop-blur-sm h-[400px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800/50">
              <CardTitle className="text-white text-lg">Recent Feedback</CardTitle>
              <Link href="/student/submissions">
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20">View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0 custom-scrollbar">
              {submissionsLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full bg-slate-800 rounded-lg" />)}
                </div>
              ) : mySubmissions?.filter(s => s.status === 'reviewed' || s.status === 'approved' || s.status === 'rejected').length === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-500">No feedback yet</div>
              ) : (
                <div className="divide-y divide-slate-800/50">
                  {mySubmissions
                    ?.filter(s => s.status === 'reviewed' || s.status === 'approved' || s.status === 'rejected')
                    .slice(0, 5)
                    .map(sub => (
                      <div key={sub.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-medium text-white line-clamp-1">{sub.projectTitle}</h4>
                          {sub.score && (
                            <span className="text-xs font-bold bg-slate-800 text-cyan-400 px-2 py-0.5 rounded ml-2">
                              {sub.score}/100
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2 italic border-l-2 border-slate-700 pl-3 py-0.5">
                          "{sub.feedback || 'No written feedback'}"
                        </p>
                      </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
