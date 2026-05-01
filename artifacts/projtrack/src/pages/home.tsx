import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, GraduationCap, Users } from "lucide-react";

export default function Home() {
  const roles = [
    {
      id: "admin",
      title: "Administrator",
      description: "Manage users, classes, and system settings.",
      icon: Shield,
      color: "from-orange-500 to-orange-400",
      bgBase: "bg-orange-500/10",
      borderHover: "hover:border-orange-500/50",
    },
    {
      id: "teacher",
      title: "Teacher",
      description: "Create projects, review submissions, and manage classes.",
      icon: GraduationCap,
      color: "from-purple-600 to-purple-500",
      bgBase: "bg-purple-500/10",
      borderHover: "hover:border-purple-500/50",
    },
    {
      id: "student",
      title: "Student",
      description: "View projects, submit assignments, and track progress.",
      icon: Users,
      color: "from-cyan-500 to-blue-500",
      bgBase: "bg-cyan-500/10",
      borderHover: "hover:border-cyan-500/50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-flex items-center justify-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">ProjTrack</h1>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Select your portal</h2>
        <p className="text-slate-400 max-w-lg mx-auto text-lg">
          Welcome to the Project Submission Management System. Please select your role to continue.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full relative z-10">
        {roles.map((role, index) => {
          const Icon = role.icon;
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/login/${role.id}`}>
                <div className={`h-full cursor-pointer group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 transition-all duration-300 overflow-hidden ${role.borderHover}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <div className={`w-16 h-16 rounded-2xl ${role.bgBase} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 text-transparent bg-clip-text bg-gradient-to-br ${role.color}`} style={{ color: "white" }} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{role.title}</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
