import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLogin, LoginBodyRole } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Shield, GraduationCap, Lock, Mail, Eye, EyeOff, ArrowRight, BookOpen, Users, Briefcase, CheckSquare, Settings } from "lucide-react";
import projtrackLogo from "@assets/ChatGPT_Image_Apr_30,_2026,_03_29_17_AM_1777652096982.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type RoleType = "admin" | "teacher" | "student";

const ROLE_CONFIGS = {
  admin: {
    color: "orange",
    bgClass: "bg-orange-500",
    textClass: "text-orange-500",
    gradientClass: "from-[#F97316] to-[#FB923C]",
    gradientText: "from-orange-400 to-orange-600",
    glowClass: "shadow-orange-500/20",
    ringClass: "focus-visible:ring-orange-500/50",
    bgGradient: "from-orange-950/40 via-[#0A0A0F] to-[#0A0A0F]",
    accentOrb: "bg-orange-600/20",
    icon: Shield,
    headline: "Manage. Monitor. Secure. Together.",
    subtitle: "Admin Portal",
    description: "Access the central command center to manage users, configure system settings, and oversee all academic activities.",
    badgeText: "ADMINISTRATOR ACCESS",
    loginExtra: (
      <div className="flex items-center justify-center space-x-2 mt-6 text-xs text-slate-400">
        <Lock className="w-3 h-3" />
        <span>Secure connection established</span>
      </div>
    )
  },
  teacher: {
    color: "purple",
    bgClass: "bg-purple-600",
    textClass: "text-purple-500",
    gradientClass: "from-[#7C3AED] to-[#A855F7]",
    gradientText: "from-purple-400 to-purple-600",
    glowClass: "shadow-purple-500/20",
    ringClass: "focus-visible:ring-purple-500/50",
    bgGradient: "from-purple-950/40 via-[#0A0A0F] to-[#0A0A0F]",
    accentOrb: "bg-purple-600/20",
    icon: GraduationCap,
    headline: "Manage. Review. Guide. Together.",
    subtitle: "Teacher Portal",
    description: "Create engaging projects, provide meaningful feedback, and guide your students to academic success.",
    badgeText: "FACULTY ACCESS",
    loginExtra: null
  },
  student: {
    color: "cyan",
    bgClass: "bg-cyan-500",
    textClass: "text-cyan-500",
    gradientClass: "from-[#06B6D4] to-[#3B82F6]",
    gradientText: "from-cyan-400 to-blue-500",
    glowClass: "shadow-cyan-500/20",
    ringClass: "focus-visible:ring-cyan-500/50",
    bgGradient: "from-cyan-950/40 via-[#0A0A0F] to-[#0A0A0F]",
    accentOrb: "bg-cyan-600/20",
    icon: GraduationCap,
    headline: "Manage. Submit. Achieve. Together.",
    subtitle: "Student Portal",
    description: "Access your assignments, track your progress, and collaborate on projects to achieve your goals.",
    badgeText: "STUDENT ACCESS",
    loginExtra: null
  }
};

export default function Login() {
  const { role } = useParams<{ role: string }>();
  const [, setLocation] = useLocation();
  const { setUser } = useAuth();
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const loginMutation = useLogin();

  // Validate role
  if (!role || !["admin", "teacher", "student"].includes(role)) {
    setLocation("/");
    return null;
  }

  const currentRole = role as RoleType;
  const config = ROLE_CONFIGS[currentRole];
  const Icon = config.icon;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error("Please enter both identifier and password");
      return;
    }

    try {
      const response = await loginMutation.mutateAsync({
        data: {
          identifier,
          password,
          role: currentRole as LoginBodyRole,
        }
      });
      setUser(response.user);
      toast.success("Login successful");
      setLocation(`/${currentRole}/dashboard`);
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background decorations */}
      <div className={`absolute top-0 right-0 w-[800px] h-full bg-gradient-to-l ${config.gradientClass} opacity-[0.15] blur-[150px] pointer-events-none rounded-l-full translate-x-1/3`} />
      
      {/* Leaves (abstract representations) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] pointer-events-none rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 blur-[80px] pointer-events-none rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-[1400px] h-[90vh] min-h-[700px] max-h-[900px] flex rounded-3xl overflow-hidden shadow-2xl relative z-10 mx-6">
        
        {/* Left Panel */}
        <div className="hidden lg:flex w-[58%] relative flex-col p-12 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient}`} />
            {/* Decorative orbs */}
            <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] ${config.accentOrb} pointer-events-none`} />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-[100px] bg-slate-800/30 pointer-events-none" />
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
          </div>

          {/* Logo — pinned upper-left */}
          <div className="absolute top-4 left-4 z-10">
            <img
              src={projtrackLogo}
              alt="ProjTrack"
              className="w-[480px] h-auto"
              style={{ mixBlendMode: 'screen', filter: 'brightness(1.4) saturate(1.2)' }}
            />
          </div>

          {/* Spacer — clears the logo area */}
          <div className="flex-1 min-h-[220px]" />

          {/* Main content — lower half */}
          <div className="relative z-10 max-w-lg mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`inline-flex px-3 py-1 rounded-full bg-[#0F172A] border border-slate-800 text-xs font-bold tracking-wider mb-6 ${config.textClass}`}>
                {config.badgeText}
              </div>
              <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
                {config.headline.split('. ').map((part, i, arr) => (
                  <span key={i}>
                    {part}{i < arr.length - 1 ? '. ' : ''}
                    {i === arr.length - 2 && <br />}
                  </span>
                ))}
              </h1>
              <div className={`w-24 h-1.5 rounded-full bg-gradient-to-r ${config.gradientClass} mb-8`} />
              <p className="text-lg text-slate-300 leading-relaxed">
                {config.description}
              </p>
            </motion.div>
          </div>

          {/* Icon row — very bottom */}
          <div className="relative z-10 flex space-x-8 mb-6">
            {[
              { icon: BookOpen, label: "Courses" },
              { icon: Briefcase, label: "Projects" },
              { icon: Users, label: "Community" },
              { icon: Shield, label: "Secure" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center space-y-2 opacity-70 hover:opacity-100 transition-opacity cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-[#0F172A]/80 border border-slate-800 flex items-center justify-center backdrop-blur-md">
                  <item.icon className="w-5 h-5 text-slate-300" />
                </div>
                <span className="text-xs font-medium text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="relative z-10 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} ProjTrack. All rights reserved.
          </div>
        </div>

        {/* Right Panel - Login Card */}
        <div className="w-full lg:w-[42%] relative flex items-center justify-center p-8 lg:p-12 z-20">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md bg-[#0F172A]/85 backdrop-blur-2xl rounded-3xl border border-slate-800/50 p-10 shadow-2xl relative"
          >
            {/* Role Icon Top Center */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              <div className={`w-20 h-20 rounded-full bg-[#0F172A] border-4 border-[#0A0A0F] flex items-center justify-center shadow-xl ${config.glowClass}`}>
                <div className={`w-14 h-14 rounded-full bg-gradient-to-tr ${config.gradientClass} flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <div className="text-center mt-12 mb-10">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back!</h2>
              <div className="flex items-center justify-center space-x-3">
                <div className="h-px w-8 bg-slate-700" />
                <span className={`text-sm font-semibold tracking-wide uppercase bg-clip-text text-transparent bg-gradient-to-r ${config.gradientText}`}>
                  {config.subtitle}
                </span>
                <div className="h-px w-8 bg-slate-700" />
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-slate-300 font-medium">
                    {currentRole === 'student' ? 'Student ID / Email' : 
                     currentRole === 'teacher' ? 'Faculty ID / Email' : 'Admin ID / Email'}
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 group-focus-within:text-slate-300 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <Input
                      id="identifier"
                      placeholder="Enter your ID or email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className={`pl-11 h-14 bg-[#0A0A0F]/50 border-slate-700 text-white placeholder:text-slate-600 rounded-xl ${config.ringClass} transition-all`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300 font-medium">Password</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 group-focus-within:text-slate-300 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-11 pr-11 h-14 bg-[#0A0A0F]/50 border-slate-700 text-white placeholder:text-slate-600 rounded-xl ${config.ringClass} transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(c) => setRememberMe(c as boolean)}
                    className="border-slate-600 data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-700" 
                  />
                  <Label htmlFor="remember" className="text-sm font-medium leading-none text-slate-400 cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <a href="#" className={`text-sm font-medium hover:underline transition-all ${config.textClass}`}>
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className={`w-full h-14 text-base font-bold text-white rounded-xl bg-gradient-to-r ${config.gradientClass} hover:opacity-90 shadow-lg ${config.glowClass} transition-all flex items-center justify-center space-x-2 group`}
              >
                <span>{loginMutation.isPending ? "Logging in..." : "Sign In"}</span>
                {!loginMutation.isPending && (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </Button>
            </form>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
