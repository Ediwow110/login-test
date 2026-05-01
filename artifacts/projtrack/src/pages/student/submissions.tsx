import { useState } from "react";
import { useListSubmissions } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle, XCircle, FileText, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function StudentSubmissions() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSub, setSelectedSub] = useState<any>(null);
  
  // In a real app, this is filtered by the logged in student ID
  const { data: submissions, isLoading } = useListSubmissions();

  const filteredSubs = submissions?.filter(s => 
    s.projectTitle.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "all" || s.status === statusFilter)
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <Badge className="bg-amber-500/20 text-amber-500 border-none"><Clock className="w-3 h-3 mr-1"/> Pending Review</Badge>;
      case 'reviewed': return <Badge className="bg-blue-500/20 text-blue-400 border-none"><MessageSquare className="w-3 h-3 mr-1"/> Reviewed</Badge>;
      case 'approved': return <Badge className="bg-emerald-500/20 text-emerald-400 border-none"><CheckCircle className="w-3 h-3 mr-1"/> Approved</Badge>;
      case 'rejected': return <Badge className="bg-rose-500/20 text-rose-400 border-none"><XCircle className="w-3 h-3 mr-1"/> Needs Revision</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">My Submissions</h1>
          <p className="text-slate-400">View your assignment history and teacher feedback.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Search projects..." 
            className="pl-9 bg-[#0F172A]/50 border-slate-800 focus-visible:ring-cyan-500/50 text-white backdrop-blur-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          {['all', 'pending', 'reviewed', 'approved', 'rejected'].map((status) => (
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

      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-[#0F172A]/50 border-slate-800/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 w-1/2">
                    <Skeleton className="h-5 w-3/4 bg-slate-800" />
                    <Skeleton className="h-4 w-1/3 bg-slate-800" />
                  </div>
                  <Skeleton className="h-6 w-24 bg-slate-800 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredSubs?.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-[#0F172A]/50 rounded-xl border border-slate-800/50">
            No submissions found matching your criteria.
          </div>
        ) : (
          <AnimatePresence>
            {filteredSubs?.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Card 
                  className="bg-[#0F172A]/50 border-slate-800/50 backdrop-blur-sm hover:border-cyan-500/30 hover:bg-[#0F172A]/80 transition-all cursor-pointer group"
                  onClick={() => setSelectedSub(sub)}
                >
                  <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shrink-0 group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-lg text-white font-medium mb-1 group-hover:text-cyan-400 transition-colors">{sub.projectTitle}</h4>
                        <div className="flex items-center text-sm text-slate-400">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end w-full md:w-auto gap-4">
                      {sub.score !== null && sub.score !== undefined && (
                        <div className="text-center px-4 py-1.5 bg-[#0A0A0F] border border-slate-800 rounded-lg">
                          <span className="block text-xs text-slate-500 font-medium">Score</span>
                          <span className="block text-lg font-bold text-white leading-none">{sub.score}<span className="text-sm text-slate-500">/100</span></span>
                        </div>
                      )}
                      {getStatusBadge(sub.status)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <Dialog open={!!selectedSub} onOpenChange={(open) => !open && setSelectedSub(null)}>
        <DialogContent className="bg-[#0F172A] border-slate-800 text-slate-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl border-b border-slate-800 pb-4 flex justify-between items-center">
              <span>{selectedSub?.projectTitle}</span>
              {selectedSub && getStatusBadge(selectedSub.status)}
            </DialogTitle>
          </DialogHeader>
          {selectedSub && (
            <div className="mt-2 space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Your Submission</h4>
                <div className="bg-[#0A0A0F] p-4 rounded-xl border border-slate-800">
                  <p className="text-slate-300 text-sm whitespace-pre-wrap font-mono">{selectedSub.content}</p>
                  {selectedSub.fileUrl && (
                    <a href={selectedSub.fileUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center text-sm text-cyan-400 hover:text-cyan-300 hover:underline">
                      <FileText className="w-4 h-4 mr-2" /> View attachment
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-500 text-right">Submitted on {new Date(selectedSub.submittedAt).toLocaleString()}</p>
              </div>

              {(selectedSub.status === 'reviewed' || selectedSub.status === 'approved' || selectedSub.status === 'rejected') && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                    <span>Teacher Feedback</span>
                    {selectedSub.score && <span className="text-cyan-400 font-bold">Score: {selectedSub.score}/100</span>}
                  </h4>
                  <div className={`p-4 rounded-xl border ${selectedSub.status === 'rejected' ? 'bg-rose-500/5 border-rose-500/20 text-rose-200' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200'}`}>
                    <p className="text-sm whitespace-pre-wrap italic">
                      "{selectedSub.feedback || 'No written feedback provided.'}"
                    </p>
                  </div>
                  {selectedSub.reviewedAt && (
                    <p className="text-xs text-slate-500 text-right">Reviewed on {new Date(selectedSub.reviewedAt).toLocaleString()}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
