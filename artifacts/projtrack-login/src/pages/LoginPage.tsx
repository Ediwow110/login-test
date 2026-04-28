import { useState, useCallback } from "react";
import type { CSSProperties, ElementType, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Clock3,
  UsersRound,
  Bell,
  FileChartColumn,
} from "lucide-react";

type Portal = "student" | "teacher" | "admin";

interface FeatureItem {
  label: string;
  Icon: ElementType;
}

interface PortalConfig {
  id: Portal;
  label: string;
  eyebrow?: string;
  subtitle: string;
  headline: [string, string, string];
  description: string;
  idLabel: string;
  idPlaceholder: string;
  buttonText: string;
  accent: string;
  accent2: string;
  accentMuted: string;
  formIcon: ElementType;
  heroIcon: ElementType;
  scene: "campus" | "city";
  features: FeatureItem[];
}

const PORTALS: PortalConfig[] = [
  {
    id: "student",
    label: "Student",
    subtitle: "Student Portal Login",
    headline: ["Manage. Submit.", "Achieve.", "Together."],
    description:
      "ProjTrack helps students stay organized, submit projects on time, and collaborate seamlessly with their teachers.",
    idLabel: "Email or Student ID",
    idPlaceholder: "Enter your email or student ID",
    buttonText: "Sign In",
    accent: "#08bdf4",
    accent2: "#635bff",
    accentMuted: "rgba(8, 189, 244, 0.18)",
    formIcon: User,
    heroIcon: GraduationCap,
    scene: "campus",
    features: [
      { label: "Real-time\nSubmission Tracking", Icon: Clock3 },
      { label: "Easy Class\nManagement", Icon: UsersRound },
      { label: "Instant Alerts &\nReminders", Icon: Bell },
      { label: "Secure & Reliable\nPlatform", Icon: ShieldCheck },
    ],
  },
  {
    id: "teacher",
    label: "Teacher",
    eyebrow: "Teacher Portal",
    subtitle: "Teacher Portal Login",
    headline: ["Manage. Review.", "Guide.", "Together."],
    description:
      "ProjTrack helps teachers review submissions, manage classes, and provide feedback faster and easier.",
    idLabel: "Email or Teacher ID",
    idPlaceholder: "Enter your email or teacher ID",
    buttonText: "Sign In as Teacher",
    accent: "#8b5cf6",
    accent2: "#6d28d9",
    accentMuted: "rgba(139, 92, 246, 0.18)",
    formIcon: Mail,
    heroIcon: GraduationCap,
    scene: "campus",
    features: [
      { label: "Real-time\nSubmission Tracking", Icon: Clock3 },
      { label: "Easy Class\nManagement", Icon: UsersRound },
      { label: "Instant Alerts &\nReminders", Icon: Bell },
      { label: "Secure & Reliable\nPlatform", Icon: ShieldCheck },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    eyebrow: "Admin Portal",
    subtitle: "Admin Portal Login",
    headline: ["Manage. Monitor.", "Secure.", "Together."],
    description:
      "ProjTrack helps administrators manage users, departments, reports, and system access in one secure platform.",
    idLabel: "Email or Admin ID",
    idPlaceholder: "Enter your email or admin ID",
    buttonText: "Sign In as Admin",
    accent: "#ff7900",
    accent2: "#ff9d00",
    accentMuted: "rgba(255, 121, 0, 0.18)",
    formIcon: Mail,
    heroIcon: ShieldCheck,
    scene: "city",
    features: [
      { label: "User\nManagement", Icon: User },
      { label: "Reports &\nAnalytics", Icon: FileChartColumn },
      { label: "System\nControl", Icon: ShieldCheck },
      { label: "Secure\nAccess", Icon: Lock },
    ],
  },
];

const buildings = Array.from({ length: 17 }, (_, index) => ({
  width: 26 + ((index * 11) % 34),
  height: 78 + ((index * 29) % 92),
  windows: 3 + (index % 4),
}));

function Logo({ accent, compact = false }: { accent: string; compact?: boolean }) {
  return (
    <div className="proj-logo" aria-label="ProjTrack">
      <svg className="proj-logo-mark" viewBox="0 0 88 72" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="barGradient" x1="0" x2="1" y1="1" y2="0">
            <stop offset="0" stopColor="#00d4ff" />
            <stop offset="0.54" stopColor="#25f0d0" />
            <stop offset="1" stopColor="#ffb000" />
          </linearGradient>
          <linearGradient id="arrowGradient" x1="0" x2="1" y1="1" y2="0">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor={accent} />
          </linearGradient>
        </defs>
        <rect x="12" y="34" width="9" height="26" rx="2" fill="url(#barGradient)" />
        <rect x="28" y="24" width="9" height="36" rx="2" fill="url(#barGradient)" />
        <rect x="44" y="14" width="9" height="46" rx="2" fill="url(#barGradient)" />
        <rect x="60" y="27" width="9" height="33" rx="2" fill="#ffb000" />
        <path
          d="M8 58 L29 35 L44 46 L71 15"
          fill="none"
          stroke="url(#arrowGradient)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M67 8 L82 8 L82 23 Z" fill={accent} />
      </svg>
      {!compact && (
        <div className="proj-logo-text">
          <div className="proj-logo-title">
            PROJ<span style={{ color: accent }}>TRACK</span>
          </div>
          <div className="proj-logo-subtitle">Project Submission Management System</div>
        </div>
      )}
    </div>
  );
}

function BackgroundScene({ portal }: { portal: PortalConfig }) {
  return (
    <div className={`scene scene-${portal.scene}`} aria-hidden="true">
      <div className="stars" />
      <div className="dot-grid" style={{ color: portal.accent }} />
      <div className="orb orb-left" style={{ borderColor: portal.accent, boxShadow: `0 0 48px ${portal.accentMuted}` }} />
      <div className="orb orb-right" style={{ borderColor: portal.accent }} />
      <div className="leaf leaf-left" />
      <div className="leaf leaf-right" />
      <div className="scene-horizon">
        {portal.scene === "campus" ? <CampusSilhouette accent={portal.accent} /> : <CitySilhouette accent={portal.accent} />}
      </div>
    </div>
  );
}

function CampusSilhouette({ accent }: { accent: string }) {
  return (
    <div className="campus">
      <div className="campus-wing left" />
      <div className="campus-main">
        <div className="campus-spire" />
        <div className="campus-clock" style={{ borderColor: accent }} />
      </div>
      <div className="campus-wing right" />
      <div className="trees" />
    </div>
  );
}

function CitySilhouette({ accent }: { accent: string }) {
  return (
    <div className="city">
      {buildings.map((building, index) => (
        <div key={index} className="tower" style={{ width: building.width, height: building.height }}>
          {Array.from({ length: building.windows }).map((_, w) => (
            <span key={w} style={{ background: w % 2 ? accent : "#ffc56e" }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function LoginPage() {
  const [activePortal, setActivePortal] = useState<Portal>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const portal = PORTALS.find((item) => item.id === activePortal)!;
  const FieldIcon = portal.formIcon;
  const HeroIcon = portal.heroIcon;

  const switchPortal = useCallback(
    (id: Portal) => {
      if (id === activePortal) return;
      setActivePortal(id);
      setEmail("");
      setPassword("");
      setFormError("");
      setShowPassword(false);
    },
    [activePortal],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!email.trim()) {
      setFormError("Please enter your email or ID.");
      return;
    }

    if (!password.trim()) {
      setFormError("Please enter your password.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setLoading(false);
    setFormError("Invalid credentials. Please try again.");
  };

  return (
    <main className="login-shell" style={{ "--accent": portal.accent, "--accent-2": portal.accent2 } as CSSProperties}>
      <AnimatePresence mode="wait">
        <motion.div
          key={portal.id}
          className="login-stage"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <BackgroundScene portal={portal} />

          <nav className="portal-switch" aria-label="Choose login portal">
            {PORTALS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === activePortal ? "active" : ""}
                onClick={() => switchPortal(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <section className="intro-panel" aria-labelledby="portal-headline">
            <Logo accent={portal.accent} />

            <div className="intro-copy">
              {portal.eyebrow && <div className="eyebrow">{portal.eyebrow}</div>}
              <h1 id="portal-headline">
                {portal.headline[0]}
                <br />
                {portal.headline[1]} <span>{portal.headline[2]}</span>
              </h1>
              <p>{portal.description}</p>
              <div className="accent-rule" />
            </div>

            <div className="feature-grid">
              {portal.features.map(({ Icon, label }) => (
                <div className="feature-card" key={label}>
                  <Icon className="feature-icon" aria-hidden="true" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>

          <motion.section
            className="login-card"
            aria-label={`${portal.label} login form`}
            initial={{ opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="card-icon" aria-hidden="true">
              <HeroIcon size={42} strokeWidth={1.65} />
            </div>

            <h2>Welcome Back!</h2>
            <div className="card-subtitle">
              <span />
              <p>{portal.subtitle}</p>
              <span />
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <label htmlFor="login-id">{portal.idLabel}</label>
                <div className="input-wrap">
                  <FieldIcon aria-hidden="true" size={24} />
                  <input
                    id="login-id"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={portal.idPlaceholder}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="login-password">Password</label>
                <div className="input-wrap">
                  <Lock aria-hidden="true" size={24} />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    className="icon-button"
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-row">
                <label className="remember-control" htmlFor="remember-me">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                  />
                  <span aria-hidden="true" />
                  Remember me
                </label>
                <button type="button" className="text-button">
                  Forgot password?
                </button>
              </div>

              <AnimatePresence>
                {formError && (
                  <motion.p
                    className="form-error"
                    role="alert"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    {formError}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button className="submit-button" type="submit" disabled={loading} whileHover={{ y: -1 }} whileTap={{ scale: 0.985 }}>
                {loading ? "Signing in..." : portal.buttonText}
                <ArrowRight aria-hidden="true" size={25} />
              </motion.button>

              {portal.id === "admin" ? (
                <div className="admin-note">
                  <Lock size={24} aria-hidden="true" />
                  <p>Your data is protected with enterprise-grade security.</p>
                </div>
              ) : (
                <div className="continue-row">
                  <span />
                  <p>{portal.id === "student" ? "or continue with" : "secure teacher access"}</p>
                  <span />
                  <div className="mini-shield">
                    <ShieldCheck size={26} aria-hidden="true" />
                  </div>
                </div>
              )}
            </form>
          </motion.section>

          <footer className="page-footer">
            <p>© 2026 ProjTrack. All rights reserved.</p>
            <div>
              <a href="#privacy">Privacy Policy</a>
              <span>•</span>
              <a href="#terms">Terms of Service</a>
              <span>•</span>
              <a href="#help">Help Center</a>
            </div>
          </footer>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
