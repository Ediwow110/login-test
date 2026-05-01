import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLogout } from "@workspace/api-client-react";
import { Shield, Users, BookOpen, Briefcase, FileText, CheckSquare, Settings, LogOut, LayoutDashboard, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PortalLayoutProps {
  children: React.ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const { user, logout: clearLocalAuth } = useAuth();
  const [, setLocation] = useLocation();
  const logoutMutation = useLogout();
  const [location] = useLocation();

  if (!user) return null;

  const roleConfigs = {
    admin: {
      color: "text-orange-500",
      bgHover: "hover:bg-orange-500/10 hover:text-orange-500",
      bgActive: "bg-orange-500/20 text-orange-500 border-r-2 border-orange-500",
      navItems: [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/classes", label: "Classes", icon: BookOpen },
        { href: "/admin/projects", label: "Projects", icon: Briefcase },
      ]
    },
    teacher: {
      color: "text-purple-500",
      bgHover: "hover:bg-purple-500/10 hover:text-purple-500",
      bgActive: "bg-purple-500/20 text-purple-500 border-r-2 border-purple-500",
      navItems: [
        { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/teacher/projects", label: "My Projects", icon: Briefcase },
        { href: "/teacher/submissions", label: "Submissions", icon: CheckSquare },
        { href: "/teacher/classes", label: "My Classes", icon: BookOpen },
      ]
    },
    student: {
      color: "text-cyan-500",
      bgHover: "hover:bg-cyan-500/10 hover:text-cyan-500",
      bgActive: "bg-cyan-500/20 text-cyan-500 border-r-2 border-cyan-500",
      navItems: [
        { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/student/projects", label: "Open Projects", icon: Briefcase },
        { href: "/student/submissions", label: "My Submissions", icon: FileText },
      ]
    }
  };

  const config = roleConfigs[user.role as keyof typeof roleConfigs];

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (e) {
      // ignore
    } finally {
      clearLocalAuth();
      setLocation("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-slate-100 flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 bg-[#0F172A]/50 flex flex-col backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight">ProjTrack</span>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 ml-3">Menu</p>
            {config.navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? config.bgActive : `text-slate-400 ${config.bgHover}`}`}>
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800/50 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold border border-slate-700">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize truncate">{user.role}</p>
            </div>
          </div>
          
          <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-400/10" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8 relative">
          {/* Subtle background glow */}
          <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-20 ${
            user.role === 'admin' ? 'bg-orange-600' : 
            user.role === 'teacher' ? 'bg-purple-600' : 'bg-cyan-600'
          }`} />
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}