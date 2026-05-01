import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// Layout
import { PortalLayout } from "@/components/portal-layout";

// Pages
import Home from "@/pages/home";
import Login from "@/pages/login";

// Admin pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminUsers from "@/pages/admin/users";
import AdminClasses from "@/pages/admin/classes";
import AdminProjects from "@/pages/admin/projects";

// Teacher pages
import TeacherDashboard from "@/pages/teacher/dashboard";
import TeacherProjects from "@/pages/teacher/projects";
import TeacherSubmissions from "@/pages/teacher/submissions";
import TeacherClasses from "@/pages/teacher/classes";

// Student pages
import StudentDashboard from "@/pages/student/dashboard";
import StudentProjects from "@/pages/student/projects";
import StudentSubmissions from "@/pages/student/submissions";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ component: Component, allowedRoles }: { component: any, allowedRoles: string[] }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/");
    } else if (!isLoading && user && !allowedRoles.includes(user.role)) {
      setLocation(`/${user.role}/dashboard`);
    }
  }, [user, isLoading, setLocation, allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0A0A0F]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return (
    <PortalLayout>
      <Component />
    </PortalLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login/:role" component={Login} />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard">
        {() => <ProtectedRoute component={AdminDashboard} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/users">
        {() => <ProtectedRoute component={AdminUsers} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/classes">
        {() => <ProtectedRoute component={AdminClasses} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/projects">
        {() => <ProtectedRoute component={AdminProjects} allowedRoles={["admin"]} />}
      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher/dashboard">
        {() => <ProtectedRoute component={TeacherDashboard} allowedRoles={["teacher"]} />}
      </Route>
      <Route path="/teacher/projects">
        {() => <ProtectedRoute component={TeacherProjects} allowedRoles={["teacher"]} />}
      </Route>
      <Route path="/teacher/submissions">
        {() => <ProtectedRoute component={TeacherSubmissions} allowedRoles={["teacher"]} />}
      </Route>
      <Route path="/teacher/classes">
        {() => <ProtectedRoute component={TeacherClasses} allowedRoles={["teacher"]} />}
      </Route>

      {/* Student Routes */}
      <Route path="/student/dashboard">
        {() => <ProtectedRoute component={StudentDashboard} allowedRoles={["student"]} />}
      </Route>
      <Route path="/student/projects">
        {() => <ProtectedRoute component={StudentProjects} allowedRoles={["student"]} />}
      </Route>
      <Route path="/student/submissions">
        {() => <ProtectedRoute component={StudentSubmissions} allowedRoles={["student"]} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <div className="dark min-h-screen text-slate-100 font-sans selection:bg-white/20">
              <Router />
            </div>
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
