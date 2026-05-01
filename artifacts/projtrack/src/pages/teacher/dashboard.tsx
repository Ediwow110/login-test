import { useGetDashboardStats, useGetRecentActivity, useGetSubmissionTrends } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Users, BookOpen, Briefcase, FileText, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function TeacherDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity();
  const { data: trends, isLoading: trendsLoading } = useGetSubmissionTrends();

  // For a real app, these would be filtered by teacher ID on the backend
  const statCards = [
    { title: "My Classes", value: stats?.activeClasses || 0, icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Active Projects", value: Math.floor((stats?.totalProjects || 0) * 0.3), icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Total Submissions", value: Math.floor((stats?.totalSubmissions || 0) * 0.4), icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Pending Reviews", value: Math.floor((stats?.pendingReviews || 0) * 0.5), icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Teacher Dashboard</h1>
          <p className="text-slate-400">Overview of your classes, projects, and pending reviews.</p>
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
                    {statsLoading ? (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card className="bg-[#0F172A]/50 border-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Your Class Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {trendsLoading ? (
                  <Skeleton className="w-full h-full bg-slate-800" />
                ) : trends && trends.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSubmissionsT" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorReviewsT" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                      <XAxis dataKey="week" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', color: '#F8FAFC' }}
                        itemStyle={{ color: '#F8FAFC' }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="submissions" name="Submissions" stroke="#A855F7" strokeWidth={2} fillOpacity={1} fill="url(#colorSubmissionsT)" />
                      <Area type="monotone" dataKey="reviews" name="Reviews" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorReviewsT)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-500">No trend data available</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="bg-[#0F172A]/50 border-slate-800/50 backdrop-blur-sm h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-white">Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {activityLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <Skeleton className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full bg-slate-800" />
                        <Skeleton className="h-3 w-24 bg-slate-800" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activity && activity.length > 0 ? (
                <div className="space-y-6">
                  {activity.filter(a => a.type === 'submission').map((item) => (
                    <div key={item.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-purple-400 bg-purple-400/10 border border-purple-400/20">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-200">
                          <span className="font-semibold text-white">{item.actorName}</span> submitted a project
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">No recent activity</div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
