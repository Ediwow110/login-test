import { useState } from "react";
import logoImg from "../../imports/projtrack-logo-transparent.png";

type PortalType = "student" | "teacher" | "admin";

const UNIV_BG =
  "https://images.unsplash.com/photo-1763770448006-1f641339f28a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYnVpbGRpbmclMjBuaWdodCUyMGRhcmslMjBibHVlJTIwbW9vZHl8ZW58MXx8fHwxNzc3NDkyODg3fDA&ixlib=rb-4.1.0&q=80&w=1080";
const CITY_BG =
  "https://images.unsplash.com/photo-1770751919095-f1283262069a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0JTIwZGFyayUyMHJlZmxlY3Rpb24lMjB3YXRlcnxlbnwxfHx8fDE3Nzc0OTI4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080";

interface PortalCfg {
  id: PortalType;
  badge: string | null;
  bgImg: string;
  headline: string[];
  accentWord: string;
  desc: string;
  color: string;
  colorDark: string;
  btnBg: string;
  btnLabel: string;
  cardIcon: "graduation" | "shield-lock";
  loginSubtitle: string;
  idLabel: string;
  idPlaceholder: string;
  ssoType: "button" | "security" | null;
  pageBg: string;
  rightBg: string;
  cardBg: string;
  features: { icon: FeatureIconType; label: string }[];
}

type FeatureIconType = "clock" | "people" | "bell" | "shield-check" | "user" | "chart" | "shield-gear" | "lock";

const PORTALS: Record<PortalType, PortalCfg> = {
  student: {
    id: "student",
    badge: null,
    bgImg: UNIV_BG,
    headline: ["Manage. Submit.", "Achieve."],
    accentWord: "Together.",
    desc: "ProjTrack helps students stay organized, submit projects on time, and collaborate seamlessly with their teachers.",
    color: "#00BFFF",
    colorDark: "#4A6CF7",
    btnBg: "linear-gradient(90deg, #4A6CF7 0%, #00BFFF 100%)",
    btnLabel: "Sign In",
    cardIcon: "graduation",
    loginSubtitle: "Student Portal Login",
    idLabel: "Email or Student ID",
    idPlaceholder: "Enter your email or student ID",
    ssoType: null,
    pageBg: "#04091c",
    rightBg: "#03071a",
    cardBg: "#070d20",
    features: [
      { icon: "clock", label: "Real-time\nSubmission Tracking" },
      { icon: "people", label: "Easy Class\nManagement" },
      { icon: "bell", label: "Instant Alerts &\nReminders" },
      { icon: "shield-check", label: "Secure & Reliable\nPlatform" },
    ],
  },
  teacher: {
    id: "teacher",
    badge: "TEACHER PORTAL",
    bgImg: UNIV_BG,
    headline: ["Manage. Review.", "Guide."],
    accentWord: "Together.",
    desc: "ProjTrack helps teachers review submissions, manage classes, and provide feedback faster and easier.",
    color: "#8B5CF6",
    colorDark: "#7C3AED",
    btnBg: "linear-gradient(90deg, #7C3AED 0%, #9B5CF6 100%)",
    btnLabel: "Sign In as Teacher",
    cardIcon: "graduation",
    loginSubtitle: "Teacher Portal Login",
    idLabel: "Email or Teacher ID",
    idPlaceholder: "Enter your email or teacher ID",
    ssoType: null,
    pageBg: "#040314",
    rightBg: "#030212",
    cardBg: "#06041a",
    features: [
      { icon: "clock", label: "Real-time\nSubmission Tracking" },
      { icon: "people", label: "Easy Class\nManagement" },
      { icon: "bell", label: "Instant Alerts &\nReminders" },
      { icon: "shield-check", label: "Secure & Reliable\nPlatform" },
    ],
  },
  admin: {
    id: "admin",
    badge: "ADMIN PORTAL",
    bgImg: CITY_BG,
    headline: ["Manage. Monitor.", "Secure."],
    accentWord: "Together.",
    desc: "ProjTrack helps administrators manage users, departments, reports, and system access in one secure platform.",
    color: "#F97316",
    colorDark: "#EA580C",
    btnBg: "linear-gradient(90deg, #EA580C 0%, #F97316 100%)",
    btnLabel: "Sign In as Admin",
    cardIcon: "shield-lock",
    loginSubtitle: "Admin Portal Login",
    idLabel: "Email or Admin ID",
    idPlaceholder: "Enter your email or admin ID",
    ssoType: "security",
    pageBg: "#060408",
    rightBg: "#080408",
    cardBg: "#0f0a0c",
    features: [
      { icon: "user", label: "User\nManagement" },
      { icon: "chart", label: "Reports &\nAnalytics" },
      { icon: "shield-gear", label: "System\nControl" },
      { icon: "lock", label: "Secure\nAccess" },
    ],
  },
};

/* ─── SVG Icons ─── */

function IconClock({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  );
}
function IconPeople({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconBell({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function IconShieldCheck({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}
function IconUser({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconChart({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function IconShieldGear({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function IconLock({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IconEnvelope({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}
function IconKey({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <circle cx="12" cy="16" r="1" fill={color} />
    </svg>
  );
}
function IconEye({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconEyeOff({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
function IconArrowRight({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function IconShieldSSO({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}
function IconShieldLockCard() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <rect x="9" y="11" width="6" height="5" rx="1" />
      <path d="M10 11V9a2 2 0 0 1 4 0v2" />
    </svg>
  );
}
function IconGraduationCap() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3.33 3 8.67 3 12 0v-5" />
    </svg>
  );
}

function FeatureIconComp({ type, color }: { type: FeatureIconType; color: string }) {
  switch (type) {
    case "clock": return <IconClock color={color} />;
    case "people": return <IconPeople color={color} />;
    case "bell": return <IconBell color={color} />;
    case "shield-check": return <IconShieldCheck color={color} />;
    case "user": return <IconUser color={color} />;
    case "chart": return <IconChart color={color} />;
    case "shield-gear": return <IconShieldGear color={color} />;
    case "lock": return <IconLock color={color} />;
  }
}

/* ─── ProjTrack Logo ─── */
function ProjTrackLogo() {
  return (
    <div
      className="logo-reveal logo-float"
      style={{
        alignItems: "center",
        background: "transparent",
        borderRadius: 0,
        padding: 0,
        boxShadow: "none",
      }}
    >
      <img
        src={logoImg}
        alt="ProjTrack"
        style={{
          height: "86px",
          width: "auto",
          display: "block",
          objectFit: "contain",
          filter: "drop-shadow(0 0 14px rgba(0, 191, 255, 0.28))",
        }}
      />
    </div>
  );
}

/* ─── Glowing Arc Divider ─── */
function GlowArc({ color }: { color: string }) {
  return (
    <div
      className="glow-arc"
      style={{
        position: "absolute",
        right: -1,
        top: 0,
        bottom: 0,
        width: "160px",
        pointerEvents: "none",
        zIndex: 4,
      }}
    >
      <svg width="160" height="100%" viewBox="0 0 160 800" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id={`glow-${color.replace("#", "")}`} x="-50%" y="-10%" width="200%" height="120%">
            <feGaussianBlur stdDeviation="10" result="blur1" />
            <feGaussianBlur stdDeviation="4" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`arcGrad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="25%" stopColor={color} stopOpacity="0.7" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="75%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Outer wide glow */}
        <path
          d="M 140 0 Q 30 400 140 800"
          stroke={color}
          strokeWidth="20"
          fill="none"
          opacity="0.08"
          filter={`url(#glow-${color.replace("#", "")})`}
        />
        {/* Middle glow */}
        <path
          d="M 140 0 Q 30 400 140 800"
          stroke={color}
          strokeWidth="6"
          fill="none"
          opacity="0.3"
          filter={`url(#glow-${color.replace("#", "")})`}
        />
        {/* Sharp core */}
        <path
          d="M 140 0 Q 30 400 140 800"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          opacity="0.9"
        />
        {/* Bright inner highlight */}
        <path
          d="M 140 0 Q 30 400 140 800"
          stroke="white"
          strokeWidth="0.5"
          fill="none"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}

/* ─── Dot Grid Background ─── */
function DotGrid() {
  return (
    <div
      className="dot-grid-animate"
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── Scattered sparkle dots ─── */
function Sparkles({ color }: { color: string }) {
  const dots = [
    { x: "12%", y: "18%", r: 2, o: 0.4 },
    { x: "28%", y: "8%", r: 1.5, o: 0.3 },
    { x: "65%", y: "12%", r: 2.5, o: 0.35 },
    { x: "80%", y: "25%", r: 1.5, o: 0.25 },
    { x: "45%", y: "35%", r: 2, o: 0.3 },
    { x: "90%", y: "55%", r: 1.5, o: 0.2 },
    { x: "18%", y: "72%", r: 2, o: 0.25 },
    { x: "55%", y: "80%", r: 1.5, o: 0.3 },
    { x: "72%", y: "68%", r: 2, o: 0.25 },
    { x: "35%", y: "60%", r: 1, o: 0.2 },
    { x: "8%", y: "45%", r: 1.5, o: 0.2 },
    { x: "95%", y: "80%", r: 2, o: 0.3 },
  ];
  return (
    <>
      {dots.map((d, i) => (
        <div
          key={i}
          className="sparkle-dot"
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            width: d.r * 2,
            height: d.r * 2,
            borderRadius: "50%",
            background: color,
            opacity: d.o,
            boxShadow: `0 0 ${d.r * 3}px ${color}`,
            pointerEvents: "none",
            animationDelay: `${i * 0.35}s`,
          }}
        />
      ))}
    </>
  );
}

/* ─── Green Leaf Decorations ─── */
function Leaves() {
  return (
    <>
      {/* Bottom-left leaf */}
      <div
        className="leaf-float-left"
        style={{
          position: "absolute",
          bottom: 44,
          left: -55,
          pointerEvents: "none",
          zIndex: 10,
          transform: "rotate(-15deg)",
        }}
      >
        <svg width="130" height="120" viewBox="0 0 130 120" fill="none">
          <path
            d="M10 110 C 10 110 -10 60 30 30 C 60 5 110 10 115 15 C 120 20 110 70 80 90 C 55 108 10 110 10 110Z"
            fill="url(#leafGrad1)"
          />
          <path
            d="M10 110 C 30 90 55 75 80 55 C 95 43 108 28 115 15"
            stroke="#1a7a2e"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
          />
          {/* Leaf veins */}
          <path d="M55 85 C 65 70 72 55 80 38" stroke="#1a7a2e" strokeWidth="0.8" fill="none" opacity="0.4" />
          <path d="M38 92 C 50 78 58 62 62 44" stroke="#1a7a2e" strokeWidth="0.8" fill="none" opacity="0.4" />
          <defs>
            <linearGradient id="leafGrad1" x1="115" y1="15" x2="10" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2ecc71" />
              <stop offset="50%" stopColor="#27ae60" />
              <stop offset="100%" stopColor="#1e8449" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Bottom-right small leaf */}
      <div
        className="leaf-float-right"
        style={{
          position: "absolute",
          bottom: 44,
          right: -10,
          pointerEvents: "none",
          zIndex: 10,
          transform: "scaleX(-1) rotate(-20deg)",
        }}
      >
        <svg width="100" height="90" viewBox="0 0 100 90" fill="none">
          <path
            d="M8 82 C 8 82 -8 45 22 22 C 45 3 85 7 88 11 C 91 15 84 52 60 68 C 40 81 8 82 8 82Z"
            fill="url(#leafGrad2)"
          />
          <path
            d="M8 82 C 24 68 42 58 60 42 C 73 32 83 20 88 11"
            stroke="#1a7a2e"
            strokeWidth="1.2"
            fill="none"
            opacity="0.5"
          />
          <path d="M42 63 C 50 53 55 42 60 30" stroke="#1a7a2e" strokeWidth="0.7" fill="none" opacity="0.4" />
          <defs>
            <linearGradient id="leafGrad2" x1="88" y1="11" x2="8" y2="82" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2ecc71" />
              <stop offset="50%" stopColor="#27ae60" />
              <stop offset="100%" stopColor="#1e8449" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
}

/* ─── Feature Item ─── */
function FeatureItem({ icon, label, color }: { icon: FeatureIconType; label: string; color: string }) {
  return (
    <div
      className="feature-item-animate"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        flex: 1,
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: "50%",
          border: `1.5px solid ${color}55`,
          background: `${color}12`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FeatureIconComp type={icon} color={color} />
      </div>
      <span
        style={{
          color: "rgba(255,255,255,0.65)",
          fontSize: "11px",
          fontWeight: 400,
          textAlign: "center",
          lineHeight: 1.4,
          whiteSpace: "pre-line",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Portal Badge ─── */
function PortalBadge({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="badge-reveal"
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 14px",
        borderRadius: "20px",
        border: `1.5px solid ${color}`,
        marginBottom: "18px",
        background: `${color}10`,
      }}
    >
      <span
        style={{
          color: color,
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.12em",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Login Card ─── */
function LoginCard({
  cfg,
  showPassword,
  togglePassword,
  rememberMe,
  toggleRemember,
}: {
  cfg: PortalCfg;
  showPassword: boolean;
  togglePassword: () => void;
  rememberMe: boolean;
  toggleRemember: () => void;
}) {
  return (
    <div
      className="login-card-animate"
      style={{
        width: "100%",
        maxWidth: "390px",
        background: cfg.cardBg,
        borderRadius: "18px",
        border: `1px solid ${cfg.color}35`,
        boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 40px ${cfg.color}15`,
        padding: "36px 32px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Card icon */}
      <div
        className="card-icon-pulse"
        style={{
          width: 62,
          height: 62,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, ${cfg.color}50 0%, ${cfg.colorDark}40 100%)`,
          border: `2px solid ${cfg.color}60`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "18px",
          boxShadow: `0 0 20px ${cfg.color}35`,
        }}
      >
        {cfg.cardIcon === "graduation" ? <IconGraduationCap /> : <IconShieldLockCard />}
      </div>

      {/* Title */}
      <h2
        style={{
          color: "#ffffff",
          fontSize: "24px",
          fontWeight: 700,
          margin: "0 0 8px 0",
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        Welcome Back!
      </h2>

      {/* Subtitle with lines */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "26px",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.12)" }} />
        <span
          style={{
            color: "rgba(200,215,240,0.55)",
            fontSize: "12px",
            fontWeight: 400,
            whiteSpace: "nowrap",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {cfg.loginSubtitle}
        </span>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.12)" }} />
      </div>

      {/* Form */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Email/ID field */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "13px",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {cfg.idLabel}
          </label>
          <div
            className="input-shell"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${cfg.color}45`,
              borderRadius: "10px",
              padding: "0 14px",
              height: "48px",
            }}
          >
            <span style={{ marginRight: "10px", display: "flex", alignItems: "center" }}>
              <IconEnvelope color={`${cfg.color}90`} />
            </span>
            <input
              type="email"
              placeholder={cfg.idPlaceholder}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "rgba(255,255,255,0.85)",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                flex: 1,
                caretColor: cfg.color,
              }}
            />
          </div>
        </div>

        {/* Password field */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "13px",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Password
          </label>
          <div
            className="input-shell"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${cfg.color}45`,
              borderRadius: "10px",
              padding: "0 14px",
              height: "48px",
            }}
          >
            <span style={{ marginRight: "10px", display: "flex", alignItems: "center" }}>
              <IconKey color={`${cfg.color}90`} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "rgba(255,255,255,0.85)",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                flex: 1,
                caretColor: cfg.color,
              }}
            />
            <button
              onClick={togglePassword}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: 0,
              }}
            >
              {showPassword ? (
                <IconEyeOff color="rgba(255,255,255,0.35)" />
              ) : (
                <IconEye color="rgba(255,255,255,0.35)" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me + Forgot */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
            onClick={toggleRemember}
          >
            <div
              className="checkbox-animate"
              style={{
                width: 16,
                height: 16,
                borderRadius: "4px",
                background: rememberMe ? cfg.color : "transparent",
                border: `1.5px solid ${rememberMe ? cfg.color : "rgba(255,255,255,0.3)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.15s ease",
              }}
            >
              {rememberMe && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "13px",
                fontFamily: "Inter, sans-serif",
                userSelect: "none",
              }}
            >
              Remember me
            </span>
          </label>
          <button
            className="link-hover-underline"
            style={{
              background: "none",
              border: "none",
              color: cfg.color,
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              padding: 0,
            }}
          >
            Forgot password?
          </button>
        </div>

        {/* Sign In button */}
        <button
          className="signin-button-animate"
          style={{
            width: "100%",
            height: "50px",
            borderRadius: "10px",
            background: cfg.btnBg,
            border: "none",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginTop: "4px",
            boxShadow: `0 6px 24px ${cfg.color}40`,
            letterSpacing: "0.01em",
          }}
        >
          {cfg.btnLabel}
          <IconArrowRight color="white" />
        </button>

        {/* SSO section */}
        {cfg.ssoType === "button" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginTop: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>
                or continue with
              </span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
            </div>
            <button
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${cfg.color}35`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <IconShieldSSO color={cfg.color} />
            </button>
          </div>
        )}

        {cfg.ssoType === "security" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginTop: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", fontFamily: "Inter, sans-serif" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${cfg.color}25`,
                width: "100%",
              }}
            >
              <IconShieldLockCard />
              <span
                style={{
                  color: "rgba(200,215,240,0.5)",
                  fontSize: "12px",
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.4,
                }}
              >
                Your data is protected with enterprise-grade security.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export function ProjTrackLogin() {
  const [activePortal, setActivePortal] = useState<PortalType>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const cfg = PORTALS[activePortal];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(160,180,220,0.35) !important; }
        input:focus { outline: none !important; }
        .portal-switcher-btn:hover { opacity: 1 !important; }
        .footer-link:hover { color: rgba(255,255,255,0.7) !important; }
        .feature-sep { width: 1px; background: rgba(255,255,255,0.08); align-self: stretch; }
        @keyframes pageFade { from { opacity: 0; transform: scale(.992); } to { opacity: 1; transform: scale(1); } }
        @keyframes riseIn { from { opacity: 0; transform: translateY(28px); filter: blur(8px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-32px); filter: blur(8px); } to { opacity: 1; transform: translateX(0); filter: blur(0); } }
        @keyframes cardPop { 0% { opacity: 0; transform: translateY(36px) scale(.96); filter: blur(10px); } 70% { opacity: 1; transform: translateY(-4px) scale(1.012); filter: blur(0); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
        @keyframes kenburns { 0% { transform: scale(1) translate3d(0,0,0); } 50% { transform: scale(1.06) translate3d(-10px,-8px,0); } 100% { transform: scale(1.02) translate3d(8px,5px,0); } }
        @keyframes shimmerLine { 0% { transform: translateX(-120%); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateX(220%); opacity: 0; } }
        @keyframes floatSoft { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulseGlow { 0%,100% { opacity: .75; filter: drop-shadow(0 0 4px currentColor); } 50% { opacity: 1; filter: drop-shadow(0 0 18px currentColor); } }
        @keyframes twinkle { 0%, 100% { opacity: .15; transform: scale(.7); } 50% { opacity: .9; transform: scale(1.25); } }
        @keyframes gridDrift { 0% { background-position: 0 0; } 100% { background-position: 26px 26px; } }
        @keyframes breathe { 0%,100% { transform: translate(-50%, -50%) scale(.92); opacity: .75; } 50% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; } }
        @keyframes checkboxPop { 0% { transform: scale(.75); } 60% { transform: scale(1.18); } 100% { transform: scale(1); } }
        @keyframes leafSwayLeft { 0%,100% { transform: rotate(-15deg) translateY(0); } 50% { transform: rotate(-10deg) translateY(-10px); } }
        @keyframes leafSwayRight { 0%,100% { transform: scaleX(-1) rotate(-20deg) translateY(0); } 50% { transform: scaleX(-1) rotate(-15deg) translateY(-9px); } }
        .page-reveal { animation: pageFade .55s ease both; }
        .portal-switcher-animate { animation: riseIn .55s .15s ease both; }
        .bg-photo-kenburns { animation: kenburns 22s ease-in-out infinite alternate; transform-origin: center; will-change: transform; }
        .left-content-reveal { animation: slideInLeft .75s .14s cubic-bezier(.2,.8,.2,1) both; }
        .logo-reveal { animation: slideInLeft .7s .18s cubic-bezier(.2,.8,.2,1) both; }
        .logo-float img { transition: transform .35s ease, filter .35s ease; }
        .logo-float:hover img { transform: translateY(-3px) scale(1.015); filter: drop-shadow(0 0 22px rgba(0,191,255,.42)) !important; }
        .badge-reveal { animation: riseIn .55s .28s ease both; }
        .headline-rise { animation: riseIn .72s .36s cubic-bezier(.2,.8,.2,1) both; }
        .copy-fade { animation: riseIn .72s .48s cubic-bezier(.2,.8,.2,1) both; }
        .underline-scan { position: relative; overflow: hidden; animation: riseIn .6s .58s ease both; }
        .underline-scan::after { content: ''; position: absolute; inset: 0; width: 45%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.9), transparent); animation: shimmerLine 2.7s 1.1s ease-in-out infinite; }
        .features-rise { animation: riseIn .8s .68s cubic-bezier(.2,.8,.2,1) both; }
        .feature-item-animate { transition: transform .28s ease, filter .28s ease; }
        .feature-item-animate:hover { transform: translateY(-7px); filter: drop-shadow(0 0 12px rgba(255,255,255,.18)); }
        .feature-item-animate > div { transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease; }
        .feature-item-animate:hover > div { transform: scale(1.08); box-shadow: 0 0 24px rgba(255,255,255,.12); }
        .glow-arc { animation: pulseGlow 4.8s ease-in-out infinite; }
        .dot-grid-animate { animation: gridDrift 16s linear infinite; }
        .sparkle-dot { animation: twinkle 3s ease-in-out infinite; }
        .leaf-float-left { animation: leafSwayLeft 6.5s ease-in-out infinite; transform-origin: 70% 80%; }
        .leaf-float-right { animation: leafSwayRight 7.2s ease-in-out infinite; transform-origin: 70% 80%; }
        .radial-glow-breathe { animation: breathe 5.5s ease-in-out infinite; }
        .login-card-animate { animation: cardPop .82s .32s cubic-bezier(.18,.9,.22,1) both; transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease; }
        .login-card-animate:hover { transform: translateY(-6px); box-shadow: 0 34px 80px rgba(0,0,0,.65), 0 0 55px rgba(0,191,255,.13) !important; }
        .card-icon-pulse { animation: floatSoft 4s ease-in-out infinite; }
        .input-shell { transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease, background .2s ease; }
        .input-shell:focus-within { transform: translateY(-2px); background: rgba(255,255,255,.065) !important; box-shadow: 0 0 0 3px rgba(255,255,255,.035), 0 0 20px rgba(0,191,255,.12); }
        .checkbox-animate { animation: checkboxPop .25s ease; }
        .link-hover-underline { position: relative; }
        .link-hover-underline::after { content: ''; position: absolute; left: 0; right: 0; bottom: -3px; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform .22s ease; }
        .link-hover-underline:hover::after { transform: scaleX(1); transform-origin: left; }
        .signin-button-animate { position: relative; overflow: hidden; transition: transform .24s ease, box-shadow .24s ease, filter .24s ease; }
        .signin-button-animate::before { content: ''; position: absolute; top: 0; bottom: 0; width: 55px; left: -80px; transform: skewX(-24deg); background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent); animation: shimmerLine 3.6s 1.4s ease-in-out infinite; }
        .signin-button-animate:hover { transform: translateY(-3px); filter: brightness(1.08); }
        .signin-button-animate:active { transform: translateY(0) scale(.99); }
        .signin-button-animate svg { transition: transform .24s ease; }
        .signin-button-animate:hover svg { transform: translateX(4px); }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
        }
      `}</style>

      <div
        key={activePortal}
        className="page-reveal"
        style={{
          width: "100%",
          minHeight: "100vh",
          background: cfg.pageBg,
          fontFamily: "Inter, sans-serif",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Portal Switcher (top-right) ── */}
        <div
          className="portal-switcher-animate"
          style={{
            position: "absolute",
            top: "16px",
            right: "20px",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            gap: "2px",
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "4px",
            backdropFilter: "blur(12px)",
          }}
        >
          {(["student", "teacher", "admin"] as PortalType[]).map((p) => {
            const pc = PORTALS[p];
            const isActive = activePortal === p;
            return (
              <button
                key={p}
                className="portal-switcher-btn"
                onClick={() => {
                  setActivePortal(p);
                  setShowPassword(false);
                }}
                style={{
                  padding: "5px 13px",
                  borderRadius: "7px",
                  border: "none",
                  background: isActive ? `${pc.color}20` : "transparent",
                  color: isActive ? pc.color : "rgba(255,255,255,0.35)",
                  fontSize: "12px",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  outline: isActive ? `1px solid ${pc.color}40` : "none",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.02em",
                }}
              >
                {pc.id.charAt(0).toUpperCase() + pc.id.slice(1)}
              </button>
            );
          })}
        </div>

        {/* ── Main Body ── */}
        <div style={{ display: "flex", flex: 1, minHeight: "calc(100vh - 56px)" }}>

          {/* ── LEFT PANEL ── */}
          <div
            style={{
              flex: "0 0 55%",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "32px 40px 36px 44px",
            }}
          >
            {/* Background photo */}
            <div
              className="bg-photo-kenburns"
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${cfg.bgImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                filter: "brightness(0.55) saturate(0.8)",
              }}
            />
            {/* Dark overlay gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to right, ${cfg.pageBg}cc 0%, ${cfg.pageBg}55 60%, transparent 100%)`,
              }}
            />
            {/* Bottom dark fade */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "35%",
                background: `linear-gradient(to top, ${cfg.pageBg}ee 0%, transparent 100%)`,
              }}
            />
            {/* Left side darkener */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse at 20% 50%, transparent 40%, ${cfg.pageBg}88 100%)`,
              }}
            />

            {/* Sparkle particles for admin */}
            {cfg.id === "admin" && (
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}>
                <Sparkles color={cfg.color} />
              </div>
            )}

            {/* Glowing arc on right edge of left panel */}
            <GlowArc color={cfg.color} />

            {/* Content */}
            <div className="left-content-reveal" style={{ position: "relative", zIndex: 3 }}>
              {/* Logo */}
              <div style={{ marginBottom: "36px" }}>
                <ProjTrackLogo />
              </div>

              {/* Badge */}
              {cfg.badge && <PortalBadge label={cfg.badge} color={cfg.color} />}

              {/* Headline */}
              <div style={{ marginBottom: "16px" }}>
                <h1
                  className="headline-rise"
                  style={{
                    color: "#ffffff",
                    fontSize: "38px",
                    fontWeight: 800,
                    lineHeight: 1.18,
                    margin: 0,
                    fontFamily: "Inter, sans-serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {cfg.headline[0]}
                  <br />
                  {cfg.headline[1]}{" "}
                  <span style={{ color: cfg.color }}>{cfg.accentWord}</span>
                </h1>
              </div>

              {/* Description */}
              <p
                className="copy-fade"
                style={{
                  color: "rgba(190,210,240,0.7)",
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: 1.65,
                  maxWidth: "340px",
                  margin: "0 0 14px 0",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {cfg.desc}
              </p>

              {/* Accent underline */}
              <div
                className="underline-scan"
                style={{
                  width: 38,
                  height: 3,
                  borderRadius: "2px",
                  background: cfg.color,
                  boxShadow: `0 0 8px ${cfg.color}80`,
                }}
              />
            </div>

            {/* Feature icons row */}
            <div className="features-rise" style={{ position: "relative", zIndex: 3 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
                {cfg.features.map((f, i) => (
                  <div key={f.label} style={{ display: "flex", flex: 1, alignItems: "stretch" }}>
                    <FeatureItem icon={f.icon} label={f.label} color={cfg.color} />
                    {i < cfg.features.length - 1 && (
                      <div className="feature-sep" style={{ width: "1px", background: "rgba(255,255,255,0.08)", alignSelf: "stretch", margin: "8px 0" }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div
            style={{
              flex: "0 0 45%",
              position: "relative",
              background: cfg.rightBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 32px 32px 40px",
            }}
          >
            {/* Dot grid */}
            <DotGrid />

            {/* Subtle radial glow behind card */}
            <div
              className="radial-glow-breathe"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "500px",
                height: "500px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${cfg.color}08 0%, transparent 65%)`,
                pointerEvents: "none",
              }}
            />

            {/* Login Card */}
            <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", justifyContent: "center" }}>
              <LoginCard
                cfg={cfg}
                showPassword={showPassword}
                togglePassword={() => setShowPassword(!showPassword)}
                rememberMe={rememberMe}
                toggleRemember={() => setRememberMe(!rememberMe)}
              />
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer
          style={{
            position: "relative",
            zIndex: 20,
            background: "rgba(0,0,0,0.5)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "10px 0",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "12px",
              margin: "0 0 4px 0",
              fontFamily: "Inter, sans-serif",
            }}
          >
            © 2026 ProjTrack. All rights reserved.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", alignItems: "center" }}>
            {["Privacy Policy", "Terms of Service", "Help Center"].map((link, i, arr) => (
              <span key={link} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <a
                  href="#"
                  className="footer-link"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "12px",
                    textDecoration: "none",
                    fontFamily: "Inter, sans-serif",
                    transition: "color 0.15s",
                  }}
                >
                  {link}
                </a>
                {i < arr.length - 1 && (
                  <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>•</span>
                )}
              </span>
            ))}
          </div>
        </footer>

        {/* ── LEAF DECORATIONS ── */}
        <Leaves />
      </div>
    </>
  );
}