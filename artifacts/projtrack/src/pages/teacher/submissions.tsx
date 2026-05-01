import { useState } from "react";
import { useListSubmissions, useUpdateSubmission, UpdateSubmissionBodyStatus } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle, XCircle, FileText, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { getListSubmissionsQueryKey } from "@workspace/api-client-react";

export default function TeacherSubmissions() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSub, setSelectedSub] = useState<any>(null);
  
  const queryClient = useQueryClient();
  const { data: submissions, isLoading } = useListSubmissions();
  const updateMutation = useUpdateSubmission();

  const [reviewData, setReviewData] = useState({
    score: 0,
    feedback: "",
    status: "reviewed" as UpdateSubmissionBodyStatus
  });

  const filteredSubs = submissions?.filter(s => 
    (s.studentName.toLowerCase().includes(search.toLowerCase()) || 
     s.projectTitle.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "all" || s.status === statusFilter)
  );

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    
    try {
      await updateMutation.mutateAsync({ 
        submissionId: selectedSub.id,
        data: reviewData
      });
      queryClient.invalidateQueries({ queryKey: getListSubmissionsQueryKey() });
      toast.success("Review submitted successfully");
      setSelectedSub(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    }
  };

  const openReviewDialog = (sub: any) => {
    setSelectedSub(sub);
    setReviewData({
      score: sub.score || 0,
      feedback: sub.feedback || "",
      status: "reviewed"
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border-none"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
      case 'reviewed': return <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-none"><MessageSquare className="w-3 h-3 mr-1"/> Reviewed</Badge>;
      case 'approved': return <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-none"><CheckCircle className="w-3 h-3 mr-1"/> Approved</Badge>;
      case 'rejected': return <Badge className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border-none"><XCircle className="w-3 h-3 mr-1"/> Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Submissions</h1>
          <p className="text-slate-400">Review and grade student project submissions.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Search by student or project..." 
            className="pl-9 bg-[#0F172A]/50 border-slate-800 focus-visible:ring-purple-500/50 text-white backdrop-blur-sm"
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
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="bg-[#0F172A]/50 border-slate-800/50">
              <CardContent className="p-6 flex justify-between items-center">
                <div className="space-y-3 w-1/2">
                  <Skeleton className="h-5 w-3/4 bg-slate-800" />
                  <Skeleton className="h-4 w-1/2 bg-slate-800" />
                </div>
                <Skeleton className="h-10 w-24 bg-slate-800 rounded-lg" />
              </CardContent>
            </Card>
          ))
        ) : filteredSubs?.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-[#0F172A]/50 rounded-xl border border-slate-800/50">
            No submissions found.
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
                <Card className="bg-[#0F172A]/50 border-slate-800/50 backdrop-blur-sm hover:border-purple-500/30 transition-colors">
                  <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
                        <FileText className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">{sub.projectTitle}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                          <span className="flex items-center text-slate-300">
                            <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] mr-2">
                              {sub.studentName.charAt(0)}
                            </div>
                            {sub.studentName}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <span>Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-2">
                      <div className="flex items-center gap-3">
                        {sub.score !== null && sub.score !== undefined && (
                          <span className="text-sm font-bold text-white bg-slate-800 px-2 py-1 rounded-md">
                            {sub.score}/100
                          </span>
                        )}
                        {getStatusBadge(sub.status)}
                      </div>
                      <Button 
                        size="sm" 
                        variant={sub.status === 'pending' ? 'default' : 'secondary'}
                        className={sub.status === 'pending' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'}
                        onClick={() => openReviewDialog(sub)}
                      >
                        {sub.status === 'pending' ? 'Review Now' : 'Edit Review'}
                      </Button>
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
            <DialogTitle>Review Submission</DialogTitle>
          </DialogHeader>
          {selectedSub && (
            <div className="mt-4">
              <div className="bg-[#0A0A0F] p-4 rounded-xl border border-slate-800 mb-6">
                <h4 className="text-sm text-slate-400 mb-1">Student Content</h4>
                <p className="text-white text-sm whitespace-pre-wrap">{selectedSub.content}</p>
                {selectedSub.fileUrl && (
                  <a href={selectedSub.fileUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center text-sm text-purple-400 hover:text-purple-300">
                    <FileText className="w-4 h-4 mr-2" /> View attached file
                  </a>
                )}
              </div>

              <form onSubmit={handleReview} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Review Decision</Label>
                    <div className="flex gap-2">
                      {['approved', 'rejected', 'reviewed'].map((status) => (
                        <Button
                          key={status}
                          type="button"
                          variant="outline"
                          onClick={() => setReviewData({...reviewData, status: status as UpdateSubmissionBodyStatus})}
                          className={`flex-1 capitalize ${
                            reviewData.status === status 
                              ? status === 'approved' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 hover:bg-emerald-500/30' 
                                : status === 'rejected' ? 'bg-rose-500/20 border-rose-500 text-rose-400 hover:bg-rose-500/30'
                                : 'bg-blue-500/20 border-blue-500 text-blue-400 hover:bg-blue-500/30'
                              : 'bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="score">Score (0-100)</Label>
                    <Input 
                      id="score" 
                      type="number" 
                      min="0" 
                      max="100" 
                      required 
                      value={reviewData.score} 
                      onChange={e => setReviewData({...reviewData, score: parseInt(e.target.value)})} 
                      className="bg-[#0A0A0F] border-slate-800" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback Comments</Label>
                  <Textarea 
                    id="feedback" 
                    rows={4} 
                    value={reviewData.feedback} 
                    onChange={e => setReviewData({...reviewData, feedback: e.target.value})} 
                    className="bg-[#0A0A0F] border-slate-800 resize-none" 
                    placeholder="Provide constructive feedback..."
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <Button type="button" variant="ghost" onClick={() => setSelectedSub(null)}>Cancel</Button>
                  <Button type="submit" disabled={updateMutation.isPending} className="bg-purple-600 hover:bg-purple-700 text-white min-w-32">
                    {updateMutation.isPending ? "Submitting..." : "Submit Review"}
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
