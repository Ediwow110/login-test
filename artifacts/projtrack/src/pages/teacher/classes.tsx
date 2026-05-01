import { useState } from "react";
import { useListClasses } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Search, BookOpen, Users, Hash } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherClasses() {
  const [search, setSearch] = useState("");
  
  // In a real app, this would filter by the logged-in teacher's ID on the backend
  const { data: classes, isLoading } = useListClasses();

  const filteredClasses = classes?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">My Classes</h1>
          <p className="text-slate-400">View and manage your assigned classes.</p>
        </div>
      </div>

      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input 
          placeholder="Search classes..." 
          className="pl-9 bg-[#0F172A]/50 border-slate-800 focus-visible:ring-purple-500/50 text-white backdrop-blur-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-[#0F172A]/50 border-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <Skeleton className="w-12 h-12 rounded-xl bg-slate-800" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 bg-slate-800" />
                    <Skeleton className="h-4 w-20 bg-slate-800" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full bg-slate-800" />
              </CardContent>
            </Card>
          ))
        ) : filteredClasses?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            No classes found.
          </div>
        ) : (
          filteredClasses?.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="bg-[#0F172A]/50 border-slate-800/50 backdrop-blur-sm hover:border-purple-500/30 transition-colors h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                        <BookOpen className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{cls.name}</h3>
                        <div className="flex items-center text-sm text-slate-400">
                          <Hash className="w-3.5 h-3.5 mr-1" />
                          {cls.code}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center mt-6">
                    <span className="text-sm text-slate-400">{cls.department || "General"}</span>
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
                      <Users className="w-4 h-4 text-slate-400 mr-2" />
                      <span className="text-white font-medium text-sm">{cls.studentCount} Students</span>
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
