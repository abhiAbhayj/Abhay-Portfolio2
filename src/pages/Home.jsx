import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Github, Linkedin, Mail, MapPin, Download, ExternalLink,
  Phone, Sun, Moon, Menu, X, Award, ChevronDown, ArrowRight,
  Code, Database, Palette, Terminal, Zap, GitBranch,
  FileJson, PenTool, Cpu, Network, BookOpen, AlertCircle, Cloud, FileCode,
  CheckCircle, Briefcase, Calendar,
} from "lucide-react";
import {
  SiCplusplus, SiPython, SiJavascript, SiHtml5, SiPhp,
  SiMysql, SiSqlite, SiReact, SiGit, SiFigma, SiTailwindcss
} from "react-icons/si";
import { FaJava, FaDatabase } from "react-icons/fa";

const DATA = {
  hero: {
    name: "Abhay J Padmashali",
    title: "Software Engineer Intern | MCA Graduate",
    subtitle: "MCA Graduate from MAHE Manipal with hands-on experience in full-stack web and software engineering.",
    tagline: "I design and build high-performance web applications and software systems with modern UI and dependable backend workflows.",
    location: "Mulki, Mangaluru, Karnataka",
    email: "abhay2003.jp@gmail.com",
    phone: "+91 9353784057",
    github: "https://github.com/abhiAbhayj",
    linkedin: "https://www.linkedin.com/in/abhay-j2003",
    mapsLink: "https://maps.app.goo.gl/HcBa435vabBiLAdA9",
    resumeFile: "Abhay-J-Padmashali-Resume_v1.pdf",
  },
  about:
    `MCA Graduate from MAHE Manipal • Full-Stack Web Developer & Software Engineer Intern
    Skilled in React.js, FastAPI, Python, Java, PHP, SQL, and modern UI/UX design
    Clean code • Scalable Architecture • Responsive Design • Agile Collaboration
    Hands-on experience building full-stack products from AutoML systems to interactive web platforms
    Passionate about combining sleek, minimalist aesthetics with robust engineering performance
    Dedicated to solving real-world problems and engineering high-impact digital experiences`,

  experience: [
    {
      role: "Software Engineer Intern",
      company: "Optimum Codes LLP",
      location: "Remote",
      type: "Internship",
      period: "01/2026 – 05/2026",
      projectLink: "https://github.com/Org-Optimum-Codes/auto-ml-agent/tree/user/abhay",
      description:
        "Collaborated with a cross-functional engineering team in an agile remote environment to design and scale software updates. Participated in codebase roadmaps, translating technical requirements into functional full-stack components. Maintained clean, documented code and managed version control workflows using Git to ensure stable deployment pipelines.",
      highlights: [
        "Architected and developed AutoML Agents (Autonomous Data Scientist) using React.js, Tailwind CSS, and FastAPI to automate end-to-end machine learning workflows.",
        "Built scalable backend pipelines for automated dataset upload, feature engineering, missing value handling, preprocessing (encoding/scaling), and model evaluation.",
        "Delivered responsive, accessible UI components and managed Git deployment pipelines within agile sprint cycles.",
      ],
      skills: ["React.js", "FastAPI", "Python", "Tailwind CSS", "Git", "REST APIs", "Agile"],
    },
  ],

  education: [
    {
      degree: "Master of Computer Application (MCA)",
      institution: "MAHE, Manipal",
      period: "2024 – 2026",
      status: "Completed",
    },
    {
      degree: "Bachelor of Computer Application (BCA)",
      institution: "Mangalore University – Govinda Dasa College, Surathkal",
      period: "2020 – 2023",
      status: "Completed",
    },
    {
      degree: "Pre-University Course (Commerce)",
      institution: "Shree Narayana Guru Composite PU College, Mulki",
      period: "2019 – 2020",
      status: "Completed",
    },
  ],
  skills: [
    { name: "C / C++", level: 80 },
    { name: "Python", level: 75 },
    { name: "Java", level: 78 },
    { name: "JavaScript", level: 82 },
    { name: "HTML / CSS", level: 90 },
    { name: "PHP", level: 70 },
    { name: "MySQL / PostgreSQL", level: 78 },
    { name: "SQLite / XAMPP", level: 72 },
    { name: "React", level: 68 },
    { name: "Git / VS Code", level: 85 },
    { name: "UI/UX Design", level: 73 },
    { name: "SQL", level: 80 },
  ],
  projects: [
    {
      title: "AutoML Agents – Autonomous Data Scientist",
      description:
        "A transparent AutoML system using React.js, Tailwind CSS, and FastAPI to automate end-to-end machine learning workflows including preprocessing, feature engineering, and model evaluation.",
      tech: ["React.js", "FastAPI", "Python", "Tailwind CSS"],
      githubLink: "https://github.com/Org-Optimum-Codes/auto-ml-agent/tree/user/abhay",
      image: "project-automl.png",
      badge: "Internship Project",
    },
    {
      title: "BookPlaza",
      description:
        "A dynamic book e-commerce platform with book search, resale listings, and user reviews. Streamlines the buying/selling of used books.",
      tech: ["HTML", "CSS", "PHP", "XAMPP"],
      githubLink: "https://github.com/abhiAbhayj/bookplaza",
      image: "project-bookplaza.png",
    },
    {
      title: "Movie Ticket Booking",
      description:
        "A Java Swing-based desktop application with MySQL integration for real-time seat selection, multi-theater support, and secure payment flow.",
      tech: ["Java", "MySQL", "XML"],
      githubLink: "https://github.com/abhiAbhayj/MovieTicketBookingSystem",
      image: "project-movie-ticket.png",
    },
    {
      title: "Library Book Management",
      description:
        "A library management system for tracking books, members, and issue/return records with a clean and intuitive interface.",
      tech: ["HTML", "CSS", "PHP", "MySQL"],
      githubLink: "https://github.com/abhiAbhayj/Bookmgt",
      image: "project-library.png",
    },
    {
      title: "Weather App",
      description:
        "A sleek, responsive weather app that fetches real-time weather data for any city using the OpenWeatherMap API.",
      tech: ["HTML", "CSS", "JavaScript", "OpenWeatherMap API"],
      githubLink: "https://github.com/abhiAbhayj",
      liveLink: "https://abhiabhayj.github.io/weather-app/",
      image: "project-weather.png",
    },
    {
      title: "Personal Portfolio Website",
      description:
        "Designed and deployed a personal portfolio to display skills, projects, and contact details. Implemented responsive design and smooth navigation.",
      tech: ["HTML/CSS", "JavaScript", "TailwindCSS"],
      githubLink: "https://github.com/abhiAbhayj",
      liveLink: "https://abhiabhayj.github.io/abhay_portfolio/",
      image: "project-portfolio.png",
    },
  ],
  services: [
    {
      title: "Web Development",
      description: "Building responsive, modern websites and web applications using React, Tailwind CSS, and Node.js.",
      icon: "Code",
    },
    {
      title: "UI/UX Design",
      description: "Creating intuitive and beautiful user interfaces with a focus on user experience principles.",
      icon: "PenTool",
    },
    {
      title: "Responsive Design",
      description: "Ensuring your website looks and works perfectly on all devices from desktop to mobile.",
      icon: "Palette",
    },
    {
      title: "Frontend Development",
      description: "Modern, responsive, and fast-loading websites using HTML, CSS, JavaScript, and Tailwind CSS.",
      icon: "FileJson",
    },
    {
      title: "Backend Development",
      description: "Developing secure server-side applications using PHP, MySQL and XAMPP with authentication and file handling.",
      icon: "Database",
    },
    {
      title: "Mobile App Development",
      description: "Creating native Android applications using Android Studio, Java, and XML with performant UIs.",
      icon: "Terminal",
    },
  ],
  certifications: [
    {
      name: "Software Engineer Intern",
      issuer: "Optimum Codes LLP",
      link: "https://www.linkedin.com/in/abhay-j2003",
    },
    {
      name: "User Interface and User Experience Design",
      issuer: "Coursera (IBM)",
      link: "https://www.coursera.org/account/accomplishments/verify/LX6J4Q1F16R0",
    },
    {
      name: "React Basics",
      issuer: "Coursera (Meta)",
      link: "https://www.coursera.org/account/accomplishments/verify/IXGID5NAY1F8",
    },
    {
      name: "Linear Algebra in Data Science and ML",
      issuer: "Coursera",
      link: "https://www.coursera.org/account/accomplishments/verify/H7653PELLSPO",
    },
    {
      name: "Generative AI: Prompt Engineering Basics",
      issuer: "Coursera (IBM)",
      link: "https://www.coursera.org/account/accomplishments/verify/H7653PELLSPO",
    },
  ],
  languages: [
    { name: "English", proficiency: "Proficient" },
    { name: "Kannada", proficiency: "Proficient" },
    { name: "Hindi", proficiency: "Intermediate" },
    { name: "Tulu", proficiency: "Native" },
  ],
  achievements: [
    "Contributed to community health awareness campaigns via Red Cross Camp",
    "Volunteered in various NSS activities",
  ],
};

const SKILL_GROUPS = [
  {
    title: "Frontend & Design",
    items: ["HTML / CSS", "JavaScript", "React", "UI/UX Design"],
  },
  {
    title: "Backend & Data",
    items: ["Java", "PHP", "Python", "MySQL / PostgreSQL", "SQLite / XAMPP", "SQL"],
  },
  {
    title: "Tools & Workflow",
    items: ["Git / VS Code", "Responsive Web", "Problem Solving"],
  },
];

const THEME_GRADIENTS = [
  "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)",
  "linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)",
  "linear-gradient(135deg, #D4FC79 0%, #96E6A1 100%)",
  "linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)",
  "linear-gradient(135deg, #FCCB90 0%, #D57EEB 100%)",
  "linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)",
  "linear-gradient(135deg, #F093FB 0%, #F5576C 100%)",
  "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
  "linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)",
  "linear-gradient(135deg, #FA709A 0%, #FEE140 100%)",
  "linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)",
  "linear-gradient(135deg, #FF0844 0%, #FFB199 100%)"
];

const LANGUAGE_STRENGTH = {
  "Native": 100,
  "Proficient": 90,
  "Intermediate": 70,
};

const SKILL_ICONS = {
  "C / C++": SiCplusplus,
  "Python": SiPython,
  "Java": FaJava,
  "JavaScript": SiJavascript,
  "HTML / CSS": SiHtml5,
  "PHP": SiPhp,
  "MySQL / PostgreSQL": SiMysql,
  "SQLite / XAMPP": SiSqlite,
  "React": SiReact,
  "Git / VS Code": SiGit,
  "UI/UX Design": SiFigma,
  "SQL": FaDatabase,
};

const getSkillIcon = (skillName) => SKILL_ICONS[skillName] || Code;

const SERVICE_ICON_MAP = {
  Code: Code,
  PenTool: PenTool,
  Palette: Palette,
  FileJson: FileJson,
  Database: Database,
  Terminal: Terminal,
};

const getServiceIcon = (key) => SERVICE_ICON_MAP[key] || Code;

// Tech icons removed - project tech chips are disabled per request

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#services", label: "Services" },
  { href: "#education", label: "Education" },
  { href: "#projects", label: "Projects" },
  { href: "#languages", label: "Languages" },
  { href: "#certifications", label: "Certifications" },
  { href: "#arcade", label: "Arcade" },
  { href: "#contact", label: "Contact" },
];

const QUICK_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#projects", label: "Projects" },
  { href: "#arcade", label: "Arcade" },
  { href: "#contact", label: "Contact" },
];

const FOOTER_SOCIALS = [
  { href: DATA.hero.github, label: "GitHub", Icon: Github },
  { href: DATA.hero.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: `mailto:${DATA.hero.email}`, label: "Email", Icon: Mail },
];

function useRipple() {
  const addRipple = useCallback((e) => {
    const el = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(el.clientWidth, el.clientHeight);
    const radius = diameter / 2;
    const rect = el.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${clientX - rect.left - radius}px`;
    circle.style.top = `${clientY - rect.top - radius}px`;
    circle.classList.add("ripple");
    const existing = el.querySelector(".ripple");
    if (existing) existing.remove();
    el.appendChild(circle);
  }, []);
  return addRipple;
}

function SectionTitle({ sub, title }) {
  return (
    <div className="section-title">
      <h5>{sub}</h5>
      <h2>{title}</h2>
      <div style={{ width: 60, height: 3, background: "var(--eg-primary)", margin: "0.75rem auto 0", borderRadius: 9 }} />
    </div>
  );
}

const TYPING_ROLES = [
  "Software Engineer Intern",
  "MCA Graduate",
  "Full-Stack Web Developer",
  "React & FastAPI Specialist",
  "AIML Enthusiast",
  "UI/UX Designer",
  "Problem Solver",
];

function TypingRoles() {
  const [displayText, setDisplayText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [phase, setPhase] = useState("typing"); // "typing" | "waiting" | "deleting"

  useEffect(() => {
    const currentRole = TYPING_ROLES[roleIndex];
    let timer;

    if (phase === "typing") {
      if (displayText.length < currentRole.length) {
        timer = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        }, 80);
      } else {
        timer = setTimeout(() => setPhase("waiting"), 0);
      }
    } else if (phase === "waiting") {
      timer = setTimeout(() => setPhase("deleting"), 1800);
    } else if (phase === "deleting") {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 40);
      } else {
        setRoleIndex((prev) => (prev + 1) % TYPING_ROLES.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, roleIndex, phase]);

  const gradientColors = THEME_GRADIENTS[roleIndex % THEME_GRADIENTS.length];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        minHeight: "2rem",
        padding: "0.5rem 1rem",
      }}
    >
      <span style={{ color: "var(--eg-primary)", fontSize: "0.95rem" }}>✦</span>
      <span
        style={{
          color: "var(--eg-primary)",
          fontWeight: 700,
          fontSize: "0.95rem",
          fontFamily: "var(--font-logo)",
          letterSpacing: "0.03em",
          whiteSpace: "nowrap",
        }}
      >
        {displayText}
      </span>
      <span
        className="typing-cursor-blink"
        style={{
          display: "inline-block",
          width: "8px",
          height: "1.1em",
          background: "var(--eg-primary)",
          borderRadius: "1px",
          marginLeft: "2px",
          boxShadow: "0 0 8px var(--eg-primary), 0 0 15px var(--eg-primary)",
          animation: "cursorPulse 0.8s ease-in-out infinite",
        }}
      />
    </div>
  );
}

function ServiceCard({ service, index, addRipple }) {
  const Icon = getServiceIcon(service.icon);
  const bgGradient = THEME_GRADIENTS[index % THEME_GRADIENTS.length];
  const colors = bgGradient.match(/#[A-Fa-f0-9]{6}/g) || ["#4FACFE", "#00F2FE"];

  // Framer Motion variants for parent card hover/tap sync
  const cardVariants = {
    hover: { 
      y: -6, 
      borderColor: colors[0], 
      boxShadow: `0 15px 35px rgba(0, 0, 0, 0.25), 0 0 20px ${colors[0]}25` 
    },
    tap: { 
      scale: 0.98, 
      y: -2, 
      borderColor: colors[0], 
      boxShadow: `0 15px 35px rgba(0, 0, 0, 0.25), 0 0 20px ${colors[0]}25` 
    }
  };

  // Framer Motion variants for child icon hover/tap sync
  const iconVariants = {
    hover: { 
      rotate: 10, 
      scale: 1.1 
    },
    tap: { 
      rotate: 10, 
      scale: 0.95 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        type: "spring", 
        stiffness: 80, 
        damping: 15, 
        delay: index * 0.08 
      }}
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      className="feature-card ripple-container shine-hover"
      onMouseDown={addRipple}
      onTouchStart={addRipple}
      style={{ 
        position: "relative", 
        overflow: "hidden",
        border: "1px solid var(--eg-border)",
        borderRadius: "1.25rem",
        background: "var(--eg-bg-variant)",
        cursor: "pointer",
        padding: "1.5rem"
      }}
    >
      {/* Subtle gradient glow in the background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at top right, ${colors[0]}15, transparent 60%)`,
          zIndex: 0
        }}
      />
      
      {/* Animated corner glow indicator */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "4px",
          height: "20px",
          background: bgGradient,
          borderRadius: "0 0 0 4px",
          opacity: 0.8,
          zIndex: 1
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          {/* Animated Icon Container */}
          <motion.div 
            variants={iconVariants}
            style={{
              width: 46, height: 46, borderRadius: 12,
              background: bgGradient,
              display: "grid", placeItems: "center",
              boxShadow: `0 4px 15px ${colors[0]}44`,
              flexShrink: 0
            }}
          >
            <Icon size={22} style={{ color: "#000" }} />
          </motion.div>
          <h4 style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem" }}>{service.title}</h4>
        </div>
        <p style={{ 
          color: "var(--eg-text-light)", 
          margin: 0, 
          fontFamily: "var(--font-sans)", 
          fontWeight: 400, 
          fontSize: "0.85rem",
          lineHeight: 1.6,
          letterSpacing: "0.01em" 
        }}>
          {service.description}
        </p>
      </div>
    </motion.div>
  );
}

function CursorTrail() {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]); // holds {x, y, age}
  const sparksRef = useRef([]);  // holds {x, y, vx, vy, size, color, alpha}

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const addPoint = (x, y) => {
      // Restrict cursor trail from retro arcade cabinet
      const cabinet = document.querySelector(".arcade-cabinet");
      if (cabinet) {
        const rect = cabinet.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          return;
        }
      }

      pointsRef.current.push({ x, y, age: 0 });
      if (pointsRef.current.length > 25) {
        pointsRef.current.shift();
      }

      const colors = ["#00F2FE", "#4FACFE", "#38F9D7", "#FBC2EB"];
      const count = Math.random() > 0.6 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        sparksRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 3.5,
          vy: (Math.random() - 0.5) * 3.5 - 0.8,
          size: Math.random() * 4.5 + 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.025 + 0.015,
        });
      }
    };

    const handleMouseMove = (e) => {
      addPoint(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        addPoint(touch.clientX, touch.clientY);
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        addPoint(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    let animationFrameId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const points = pointsRef.current;
      if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
          const xc = (points[i].x + points[i - 1].x) / 2;
          const yc = (points[i].y + points[i - 1].y) / 2;
          ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
        }

        const grad = ctx.createLinearGradient(
          points[0].x, points[0].y,
          points[points.length - 1].x, points[points.length - 1].y
        );
        grad.addColorStop(0, "rgba(0, 242, 254, 0)");
        grad.addColorStop(0.5, "rgba(79, 172, 254, 0.55)");
        grad.addColorStop(1, "rgba(56, 249, 215, 0.9)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 4.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#00F2FE";
        ctx.stroke();
        
        ctx.shadowBlur = 0;
      }

      points.forEach((p) => p.age++);
      pointsRef.current = points.filter((p) => p.age < 18);

      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;
        s.size *= 0.95;

        if (s.alpha <= 0 || s.size <= 0.6) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 30,
      }}
    />
  );
}

const HERO_MATH_OBJECTS = [
  { type: "symbol", val: "∫", size: "3rem", top: "15%", left: "8%", duration: 14, delay: 0 },
  { type: "sphere", size: "90px", top: "12%", left: "28%", duration: 22, delay: 0 },
  { type: "symbol", val: "π", size: "2rem", top: "58%", left: "12%", duration: 12, delay: 2 },
  { type: "cone", size: "75px", top: "68%", left: "22%", duration: 14, delay: 1.5 },
  { type: "symbol", val: "Δy/Δx", size: "1.3rem", top: "45%", left: "7%", duration: 13, delay: 3.5 },
  { type: "triangle", size: "80px", top: "78%", left: "5%", duration: 15, delay: 2.5 },
  { type: "symbol", val: "λ", size: "1.8rem", top: "32%", left: "45%", duration: 13, delay: 1 },
  { type: "symbol", val: "θ", size: "1.6rem", top: "10%", left: "85%", duration: 15, delay: 2 }
];

function TechStackMarquee() {
  const row1 = [
    { name: "React", Icon: SiReact, color: "#61DAFB" },
    { name: "Python", Icon: SiPython, color: "#3776AB" },
    { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
    { name: "HTML5", Icon: SiHtml5, color: "#E34F26" },
    { name: "C++", Icon: SiCplusplus, color: "#00599C" },
    { name: "Java", Icon: FaJava, color: "#007396" },
    { name: "PHP", Icon: SiPhp, color: "#777BB4" },
  ];

  const row2 = [
    { name: "MySQL", Icon: SiMysql, color: "#4479A1" },
    { name: "SQLite", Icon: SiSqlite, color: "#003B57" },
    { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
    { name: "Git", Icon: SiGit, color: "#F05032" },
    { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
    { name: "XAMPP", Icon: FaDatabase, color: "#FB7A24" },
  ];

  const renderRow = (items, direction) => {
    const doubleItems = [...items, ...items, ...items];
    return (
      <div className="marquee-wrapper">
        <div className={`marquee-content ${direction}`}>
          {doubleItems.map((item, idx) => {
            const Icon = item.Icon;
            return (
              <div
                key={idx}
                className="marquee-item shine-hover"
              >
                <Icon size={18} style={{ color: item.color }} />
                <span>
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="tech-marquee-section" style={{ marginTop: "3rem", overflow: "hidden", width: "100%" }}>
      <h4 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "0.9rem", color: "var(--eg-text-light)", fontFamily: "var(--font-accent)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
        ✦ Technology Marquee ✦
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
        {renderRow(row1, "left")}
        {renderRow(row2, "right")}
      </div>
    </div>
  );
}

function RetroArcade({ theme }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("insert_coin"); // "insert_coin" | "inserting_coin" | "playing" | "gameover" | "victory"
  const [score, setScore] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const coinAnimStartRef = useRef(0);
  
  const ballRef = useRef({ x: 300, y: 320, dx: 4, dy: -4, radius: 7, speed: 5.5 });
  const paddleRef = useRef({ x: 250, width: 100, height: 12, speed: 8 });
  const bricksRef = useRef([]);
  const keysRef = useRef({ left: false, right: false });
  const confettiRef = useRef([]);

  const audioCtxRef = useRef(null);

  const joystickStickRef = useRef(null);
  const joystickDeflectionRef = useRef(0);
  const [joystickActive, setJoystickActive] = useState(false);
  const lastPaddleXRef = useRef(250);
  const currentTiltRef = useRef(0);
  const isScreenDraggingRef = useRef(false);

  const handleDragStart = (e) => {
    getAudioContext();

    if (gameState !== "playing" || isPaused) {
      if (e.currentTarget === canvasRef.current) {
        if (gameState === "insert_coin" || gameState === "gameover" || gameState === "victory") {
          insertCoin();
        } else if (gameState === "playing" && isPaused) {
          togglePause();
        }
        e.preventDefault();
      }
      return;
    }

    e.preventDefault();
    setJoystickActive(true);

    const isTouch = e.type.startsWith("touch");
    const pointerEvent = isTouch ? e.touches[0] : e;
    
    const isJoystick = e.currentTarget !== canvasRef.current;
    isScreenDraggingRef.current = !isJoystick;
    
    const startX = pointerEvent.clientX;
    const startPaddleX = paddleRef.current.x; // Record starting paddle position for relative movement
    const maxDragDistance = 22;

    const canvas = canvasRef.current;
    const rect = canvas ? canvas.getBoundingClientRect() : null;

    // Set initial position to current position to avoid joystick visual twitch
    lastPaddleXRef.current = paddleRef.current.x;

    const handlePointerMove = (moveEvent) => {
      // Prevent browser scrolling and swipe gestures to stabilize pointer tracking
      if (moveEvent.cancelable) {
        moveEvent.preventDefault();
      }

      const currentEvent = isTouch
        ? (moveEvent.touches && moveEvent.touches.length > 0 ? moveEvent.touches[0] : moveEvent)
        : moveEvent;
      if (!currentEvent) return;

      if (isJoystick) {
        const dx = currentEvent.clientX - startX;
        const deflectionRatio = Math.max(-1, Math.min(1, dx / maxDragDistance));
        joystickDeflectionRef.current = deflectionRatio;
      } else if (canvas && rect) {
        const scaleX = canvas.width / rect.width;
        const dx = currentEvent.clientX - startX;
        const paddle = paddleRef.current;
        
        // Move paddle relative to its starting position when this drag session began, using 1.35x sensitivity
        paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, startPaddleX + dx * scaleX * 1.35));
        
        const diff = paddle.x - lastPaddleXRef.current;
        if (Math.abs(diff) > 0.1) {
          joystickDeflectionRef.current = Math.max(-1, Math.min(1, diff / 12));
        } else {
          joystickDeflectionRef.current = 0;
        }
        lastPaddleXRef.current = paddle.x;
      }
    };

    const handlePointerEnd = () => {
      setJoystickActive(false);
      joystickDeflectionRef.current = 0;
      isScreenDraggingRef.current = false;
      if (isTouch) {
        window.removeEventListener("touchmove", handlePointerMove);
        window.removeEventListener("touchend", handlePointerEnd);
      } else {
        window.removeEventListener("mousemove", handlePointerMove);
        window.removeEventListener("mouseup", handlePointerEnd);
      }
    };

    handlePointerMove(e);

    if (isTouch) {
      window.addEventListener("touchmove", handlePointerMove, { passive: false });
      window.addEventListener("touchend", handlePointerEnd, { passive: true });
    } else {
      window.addEventListener("mousemove", handlePointerMove);
      window.addEventListener("mouseup", handlePointerEnd);
    }
  };

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const BRICK_ROWS = 4;
  const BRICK_COLS = 6;
  const BRICK_HEIGHT = 20;
  const BRICK_PADDING = 10;
  const BRICK_OFFSET_TOP = 40;
  const BRICK_OFFSET_LEFT = 35;
  const BRICK_WIDTH = 80;

  const OBSTACLES = [
    "Bugs", "Merge Conflict", "Legacy Code", "Downtime", "Syntax Error", "Callback Hell"
  ];
  const BRICK_COLORS = ["#ef4444", "#f97316", "#eab308", "#ec4899", "#a855f7", "#3b82f6"];

  const playSound = (type) => {
    if (audioMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === "bounce") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(180, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "brick") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "gameover") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "victory") {
        osc.type = "square";
        osc.frequency.setValueAtTime(261.63, now);
        osc.frequency.setValueAtTime(329.63, now + 0.1);
        osc.frequency.setValueAtTime(392.00, now + 0.2);
        osc.frequency.setValueAtTime(523.25, now + 0.3);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (err) {
      console.warn("Audio Context not allowed yet", err);
    }
  };

  const initBricks = () => {
    const bricks = [];
    for (let r = 0; r < BRICK_ROWS; r++) {
      bricks[r] = [];
      for (let c = 0; c < BRICK_COLS; c++) {
        bricks[r][c] = {
          x: 0,
          y: 0,
          status: 1,
          label: OBSTACLES[c % OBSTACLES.length],
          color: BRICK_COLORS[r % BRICK_COLORS.length]
        };
      }
    }
    bricksRef.current = bricks;
  };

  const startGame = () => {
    setGameState("playing");
    setIsPaused(false);
    setScore(0);
    initBricks();
    ballRef.current = { x: 300, y: 320, dx: (Math.random() > 0.5 ? 3.5 : -3.5), dy: -4, radius: 7, speed: 5.5 };
    paddleRef.current = { x: 250, width: 100, height: 12, speed: 8 };
    confettiRef.current = [];
    playSound("victory");
  };

  const insertCoin = () => {
    setGameState("inserting_coin");
    coinAnimStartRef.current = Date.now();
    playSound("victory");
    setTimeout(() => {
      startGame();
    }, 1200);
  };

  const togglePause = () => {
    if (gameState === "playing") {
      setIsPaused((p) => !p);
      playSound("bounce");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        keysRef.current.left = true;
        if (!joystickActive) {
          joystickDeflectionRef.current = -1;
        }
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        keysRef.current.right = true;
        if (!joystickActive) {
          joystickDeflectionRef.current = 1;
        }
      }
      if (e.key === "Escape" || e.key === "p" || e.key === "P" || e.key === "b" || e.key === "B") {
        if (gameState === "playing") {
          setIsPaused((p) => !p);
          playSound("bounce");
          e.preventDefault();
        }
      }
      if (["Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key) && gameState === "playing") {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        keysRef.current.left = false;
        if (!joystickActive) {
          joystickDeflectionRef.current = keysRef.current.right ? 1 : 0;
        }
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        keysRef.current.right = false;
        if (!joystickActive) {
          joystickDeflectionRef.current = keysRef.current.left ? -1 : 0;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState, audioMuted, joystickActive]);

  const spawnConfetti = () => {
    const colors = ["#00F2FE", "#4FACFE", "#38F9D7", "#FBC2EB", "#a855f7"];
    for (let i = 0; i < 60; i++) {
      confettiRef.current.push({
        x: Math.random() * 600,
        y: Math.random() * -100 - 10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;

    const render = () => {
      const isDark = theme === "dark";
      const screenBg = isDark ? "#0c0f1a" : "#eff6ff";
      const gridColor = isDark ? "rgba(0, 242, 254, 0.04)" : "rgba(37, 99, 235, 0.08)";
      const textColor = isDark ? "#00F2FE" : "#1e1b4b";
      const subTextColor = isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(71, 85, 105, 0.8)";
      const insertCoinColor = isDark ? "#f43f5e" : "#db2777";
      const ballColor = isDark ? "#00F2FE" : "#2563eb";
      const ballGlow = isDark ? "#00F2FE" : "#2563eb";
      const paddleColor = isDark ? "rgba(56, 249, 215, 0.85)" : "#0d9488";
      const paddleGlow = isDark ? "#38F9D7" : "#0d9488";

      ctx.fillStyle = screenBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (gameState === "insert_coin") {
        ctx.shadowBlur = isDark ? 15 : 0;
        ctx.shadowColor = isDark ? "#00F2FE" : "transparent";
        
        ctx.font = "bold 34px 'Orbitron', sans-serif";
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.fillText("ABHAY ARCADE", canvas.width / 2, 130);

        ctx.font = "14px 'Orbitron', sans-serif";
        ctx.fillStyle = subTextColor;
        ctx.fillText("SMASH OBSTACLES • UNLEASH VICTORY", canvas.width / 2, 175);

        const isVisible = Math.floor(Date.now() / 500) % 2 === 0;
        ctx.font = "bold 20px 'Audiowide', sans-serif";
        ctx.shadowColor = isDark ? insertCoinColor : "transparent";
        ctx.fillStyle = isVisible ? insertCoinColor : (isDark ? "rgba(244, 63, 94, 0.2)" : "rgba(225, 29, 72, 0.15)");
        ctx.fillText("INSERT COIN TO PLAY", canvas.width / 2, 260);
        ctx.shadowBlur = 0;
      }

      if (gameState === "inserting_coin") {
        const elapsed = Date.now() - coinAnimStartRef.current;
        const progress = Math.min(1, elapsed / 1200);

        ctx.fillStyle = screenBg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 40) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 40) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }

        // Drop coin: from y = 40 to y = 280
        const coinY = 40 + progress * 240;
        const coinRadius = 18;
        const spinScale = Math.abs(Math.cos(progress * Math.PI * 4.5));

        ctx.save();
        ctx.translate(canvas.width / 2, coinY);
        ctx.scale(spinScale, 1);

        ctx.shadowBlur = isDark ? 20 : 8;
        ctx.shadowColor = "#eab308";

        ctx.fillStyle = "#fbbf24";
        ctx.strokeStyle = "#d97706";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, coinRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#d97706";
        ctx.font = "bold 14px 'Orbitron', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("¢", 0, 0);

        ctx.restore();

        // Slot receptacle at the bottom
        ctx.fillStyle = isDark ? "#1e293b" : "#cbd5e1";
        ctx.strokeStyle = isDark ? "#3b82f6" : "#2563eb";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(canvas.width / 2 - 25, 290, 50, 12, 3);
        ctx.fill();
        ctx.stroke();

        // Neon text
        ctx.font = "bold 24px 'Orbitron', sans-serif";
        ctx.fillStyle = isDark ? "#00F2FE" : "#1e1b4b";
        ctx.textAlign = "center";
        ctx.fillText("COIN ACCEPTED", canvas.width / 2, 120);

        ctx.font = "14px 'Orbitron', sans-serif";
        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(15, 23, 42, 0.7)";
        ctx.fillText("LOADING SYSTEM...", canvas.width / 2, 160);

        // Progress bar
        const barWidth = 160;
        const barHeight = 8;
        const barX = canvas.width / 2 - barWidth / 2;
        const barY = 190;

        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)";
        ctx.fillRect(barX, barY, barWidth, barHeight);

        ctx.fillStyle = "#0d9488";
        ctx.fillRect(barX, barY, barWidth * progress, barHeight);
      }

      if (gameState === "playing") {
        const ball = ballRef.current;
        const paddle = paddleRef.current;
        const bricks = bricksRef.current;

        if (!isPaused) {
          if (!isScreenDraggingRef.current) {
            paddle.x += paddle.speed * joystickDeflectionRef.current * 1.25;
            paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x));
          }

          ball.x += ball.dx;
          ball.y += ball.dy;

          if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx;
            playSound("bounce");
          }
          if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
            playSound("bounce");
          }

          if (
            ball.y + ball.radius >= canvas.height - 25 - paddle.height &&
            ball.y - ball.radius <= canvas.height - 25 &&
            ball.x >= paddle.x &&
            ball.x <= paddle.x + paddle.width
          ) {
            const hitPos = (ball.x - paddle.x) / paddle.width;
            const angle = (hitPos - 0.5) * (Math.PI / 2.5);
            ball.dx = ball.speed * Math.sin(angle);
            ball.dy = -ball.speed * Math.cos(angle);
            ball.y = canvas.height - 25 - paddle.height - ball.radius;
            playSound("bounce");
          }

          if (ball.y - ball.radius > canvas.height) {
            setGameState("gameover");
            playSound("gameover");
          }

          let activeBricks = 0;
          for (let r = 0; r < BRICK_ROWS; r++) {
            for (let c = 0; c < BRICK_COLS; c++) {
              const b = bricks[r][c];
              if (b.status === 1) {
                activeBricks++;
                const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
                const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
                b.x = brickX;
                b.y = brickY;

                if (
                  ball.x + ball.radius >= brickX &&
                  ball.x - ball.radius <= brickX + BRICK_WIDTH &&
                  ball.y + ball.radius >= brickY &&
                  ball.y - ball.radius <= brickY + BRICK_HEIGHT
                ) {
                  b.status = 0;
                  ball.dy = -ball.dy;
                  setScore((s) => s + 100);
                  playSound("brick");
                  break;
                }
              }
            }
          }

          if (activeBricks === 0) {
            setGameState("victory");
            spawnConfetti();
            playSound("victory");
          }
        }

        for (let r = 0; r < BRICK_ROWS; r++) {
          for (let c = 0; c < BRICK_COLS; c++) {
            const b = bricks[r][c];
            if (b.status === 1) {
              ctx.shadowBlur = isDark ? 6 : 0;
              ctx.shadowColor = b.color;
              ctx.fillStyle = b.color;
              ctx.fillRect(b.x, b.y, BRICK_WIDTH, BRICK_HEIGHT);

              ctx.shadowBlur = 0;
              ctx.fillStyle = "#fff";
              ctx.font = "bold 9px 'Orbitron', sans-serif";
              ctx.textAlign = "center";
              ctx.fillText(b.label, b.x + BRICK_WIDTH / 2, b.y + BRICK_HEIGHT / 2 + 3);
            }
          }
        }

        ctx.shadowBlur = isDark ? 10 : 0;
        ctx.shadowColor = paddleGlow;
        ctx.fillStyle = paddleColor;
        ctx.fillRect(paddle.x, canvas.height - 25, paddle.width, paddle.height);

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#000";
        ctx.font = "900 10px 'Audiowide', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("ABHAY", paddle.x + paddle.width / 2, canvas.height - 15);

        ctx.shadowBlur = isDark ? 12 : 0;
        ctx.shadowColor = ballGlow;
        ctx.fillStyle = ballColor;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (isPaused) {
          ctx.fillStyle = isDark ? "rgba(12, 15, 26, 0.8)" : "rgba(241, 245, 249, 0.85)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.shadowBlur = isDark ? 15 : 0;
          ctx.shadowColor = isDark ? "#f59e0b" : "transparent";
          ctx.font = "bold 32px 'Orbitron', sans-serif";
          ctx.fillStyle = isDark ? "#f59e0b" : "#d97706";
          ctx.textAlign = "center";
          ctx.fillText("GAME PAUSED", canvas.width / 2, canvas.height / 2 - 10);

          ctx.font = "14px 'Orbitron', sans-serif";
          ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(15, 23, 42, 0.8)";
          ctx.fillText("CLICK SCREEN / PRESS B TO RESUME", canvas.width / 2, canvas.height / 2 + 30);
          ctx.shadowBlur = 0;
        }
      }

      if (gameState === "gameover") {
        ctx.shadowBlur = isDark ? 15 : 0;
        ctx.shadowColor = isDark ? "#ef4444" : "transparent";
        ctx.font = "bold 38px 'Orbitron', sans-serif";
        ctx.fillStyle = isDark ? "#ef4444" : "#dc2626";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, 150);

        ctx.font = "bold 14px 'Orbitron', sans-serif";
        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(15, 23, 42, 0.8)";
        ctx.fillText(`FINAL SCORE: ${score}`, canvas.width / 2, 200);

        const isVisible = Math.floor(Date.now() / 400) % 2 === 0;
        ctx.font = "bold 16px 'Audiowide', sans-serif";
        ctx.shadowColor = isDark ? "#00F2FE" : "transparent";
        ctx.fillStyle = isVisible 
          ? (isDark ? "#00F2FE" : "#3b82f6") 
          : (isDark ? "rgba(0, 242, 254, 0.2)" : "rgba(59, 130, 246, 0.2)");
        ctx.fillText("CLICK HERE / TAP TO RESTART", canvas.width / 2, 270);
        ctx.shadowBlur = 0;
      }

      if (gameState === "victory") {
        confettiRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        });

        ctx.shadowBlur = isDark ? 20 : 0;
        ctx.shadowColor = isDark ? "#38F9D7" : "transparent";
        ctx.font = "bold 40px 'Orbitron', sans-serif";
        ctx.fillStyle = isDark ? "#38F9D7" : "#059669";
        ctx.textAlign = "center";
        ctx.fillText("VICTORY!", canvas.width / 2, 130);

        ctx.font = "16px 'Orbitron', sans-serif";
        ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
        ctx.fillText("YOU DESTROYED ALL BUGS!", canvas.width / 2, 175);

        ctx.font = "12px 'Orbitron', sans-serif";
        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(15, 23, 42, 0.6)";
        ctx.fillText("Code Quality: Perfect 100% 🏆", canvas.width / 2, 202);

        ctx.font = "11px 'Orbitron', sans-serif";
        ctx.fillStyle = isDark ? "#00F2FE" : "#2563eb";
        ctx.fillText("SECRET UNLOCKED: CODING_LEGEND_2026", canvas.width / 2, 227);

        const isVisible = Math.floor(Date.now() / 400) % 2 === 0;
        ctx.font = "bold 16px 'Audiowide', sans-serif";
        ctx.shadowColor = isDark ? "#f43f5e" : "transparent";
        ctx.fillStyle = isVisible 
          ? (isDark ? "#f43f5e" : "#e11d48") 
          : (isDark ? "rgba(244, 63, 94, 0.2)" : "rgba(225, 29, 72, 0.2)");
        ctx.fillText("INSERT COIN TO PLAY AGAIN", canvas.width / 2, 285);
        ctx.shadowBlur = 0;
      }

      if (joystickStickRef.current) {
        const targetTilt = joystickDeflectionRef.current;
        const currentTilt = currentTiltRef.current;
        const newTilt = currentTilt + (targetTilt - currentTilt) * 0.15;
        currentTiltRef.current = newTilt;

        joystickStickRef.current.style.transform = `translateX(${newTilt * 15}px) rotate(${newTilt * 20}deg)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, score, audioMuted, isPaused, theme]);

  return (
    <div className="arcade-cabinet shine-hover" style={{ position: "relative", overflow: "hidden" }}>
      <button
        onClick={() => setAudioMuted(!audioMuted)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 20,
          background: "rgba(0, 0, 0, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          color: "#fff",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          cursor: "pointer",
          display: "grid",
          placeItems: "center"
        }}
        title={audioMuted ? "Unmute Sound" : "Mute Sound"}
      >
        {audioMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        )}
      </button>

      <div className="arcade-marquee">
        <span>ABHAY ARCADE</span>
      </div>

      <div className="arcade-screen-bezel">
        <div className="arcade-screen-inner">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              aspectRatio: "3 / 2",
              cursor: gameState === "playing" && !isPaused ? "grab" : "pointer",
              touchAction: "none",
            }}
          />
          <div className="arcade-scanlines" />
        </div>
      </div>

      <div className="arcade-controls">
        <div className="arcade-joystick-wrap">
          <div
            className="arcade-joystick-base"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            style={{ cursor: gameState === "playing" && !isPaused ? "grab" : "default" }}
          >
            <div
              className="arcade-joystick-stick-wrapper"
              ref={joystickStickRef}
              style={{
                position: "absolute",
                width: "0px",
                height: "0px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transformOrigin: "center 10px",
                transition: "transform 0.05s ease-out"
              }}
            >
              <div className="arcade-joystick-shaft" />
              <div className="arcade-joystick-knob" />
            </div>
          </div>
          <span className="control-label">PADDLE</span>
        </div>

        <div className="arcade-coin-slot-wrap" onClick={() => {
          if (gameState === "insert_coin" || gameState === "gameover" || gameState === "victory") insertCoin();
        }}>
          <div className="coin-slot-light" style={{ animation: gameState === "insert_coin" ? "coinBlink 1s infinite" : "none" }} />
          <div className="coin-entry-hole" />
          <span className="coin-label">25¢ INSERT COIN</span>
        </div>

        <div className="arcade-buttons">
          <div className="arcade-btn-group">
            <button className="arcade-btn btn-red" onClick={() => {
              if (gameState === "insert_coin" || gameState === "gameover" || gameState === "victory") insertCoin();
            }}><span>A</span></button>
            <span className="control-label">START</span>
          </div>
          <div className="arcade-btn-group">
            <button className="arcade-btn btn-blue" onClick={togglePause}>
              <span>B</span>
            </button>
            <span className="control-label">{isPaused ? "RESUME" : "PAUSE"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const base = "/";
  const [theme, setTheme] = useState("dark");
  const [mobileNav, setMobileNav] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const addRipple = useRipple();
  const visibleProjects = showAllProjects ? DATA.projects : DATA.projects.slice(0, 3);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const handleCopyEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(DATA.hero.email).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    });
  };

  const [formValues, setFormValues] = useState({ name: "", email: "", message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | "success" | "error"

  const successTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvzydlrd";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.name.trim()) {
      errors.name = "Name is required";
    } else if (formValues.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formValues.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formValues.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!formValues.message.trim()) {
      errors.message = "Message is required";
    } else if (formValues.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    setSubmitStatus(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          name: formValues.name,
          email: formValues.email,
          message: formValues.message,
        }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormValues({ name: "", email: "", message: "" });
        setFormErrors({});
        successTimeoutRef.current = setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      } else {
        setSubmitStatus("error");
      }
    } catch (err) {
      console.error("Formspree submission error:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const sections = ["hero", "about", "experience", "skills", "services", "education", "projects", "languages", "certifications", "arcade", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="app-shell" style={{ background: "var(--eg-bg)", color: "var(--eg-text)", minHeight: "100vh" }}>
      {/* ── SCROLL PROGRESS BAR ── */}
      <motion.div
        style={{
          scaleX,
          transformOrigin: "left",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #00F2FE 0%, #4FACFE 100%)",
          zIndex: 100,
          boxShadow: "0 0 10px #00F2FE, 0 0 20px rgba(0, 242, 254, 0.5)"
        }}
      />

      <CursorTrail />

      {/* ── FLOATING SIDE NAV (desktop) ── */}
      <nav
        className="fixed left-0 top-1/2 z-50 hidden md:flex flex-col items-center gap-5 pl-4"
        style={{ transform: "translateY(-50%)" }}
      >
        {NAV_LINKS.map((l) => {
          const id = l.href.replace("#", "");
          const active = activeSection === id;
          return (
            <a
              key={l.href}
              href={l.href}
              title={l.label}
              style={{
                width: active ? 14 : 10,
                height: active ? 14 : 10,
                borderRadius: "50%",
                background: active ? "var(--eg-primary)" : "var(--eg-primary-var)",
                border: `2px solid var(--eg-primary)`,
                display: "block",
                transition: "all 0.3s ease",
              }}
            />
          );
        })}
      </nav>

      {/* ── TOP NAVBAR ── */}
      <header className="top-nav fixed top-0 left-0 right-0 z-40">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="#hero" style={{
            fontFamily: "var(--font-logo)",
            fontSize: "1.6rem",
            fontWeight: 900,
            textDecoration: "none",
            background: "linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.05em",
            textTransform: "uppercase"
          }}>
            Abhay<span style={{ color: "var(--eg-text)", WebkitTextFillColor: "var(--eg-text)" }}>.</span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => {
              const active = activeSection === l.href.replace("#", "");
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={`nav-link${active ? " active" : ""}`}
                  style={{
                    position: "relative",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "999px",
                    textDecoration: "none",
                    zIndex: 1,
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="activeNavPill"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "var(--eg-primary-var)",
                        borderRadius: "999px",
                        zIndex: -1,
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {l.label}
                </a>
              );
            })}
            <button
              onClick={toggleTheme}
              className="nav-toggle ripple-container"
              onMouseDown={addRipple}
              onTouchStart={addRipple}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              style={{ background: "none", border: "none", color: "var(--eg-primary)", cursor: "pointer" }}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileNav((v) => !v)}
              style={{ background: "none", border: "none", color: "var(--eg-text)", cursor: "pointer" }}
            >
              {mobileNav ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <div
          className={`mobile-menu flex flex-col gap-3 md:hidden ${mobileNav ? "open" : ""}`}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => {
                setMobileNav(false);
              }}
              className="nav-link"
            >
              {l.label}
            </a>
          ))}
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <section id="hero" className="page-section hero-section flex items-center justify-center" style={{ position: "relative", overflow: "hidden" }}>
          {/* Floating mathematical background objects */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
            {HERO_MATH_OBJECTS.map((obj, idx) => {
              const isSphere = obj.type === "sphere";
              const isCone = obj.type === "cone";
              const isTriangle = obj.type === "triangle";
              const isSymbol = obj.type === "symbol";
              
              const isDark = theme === "dark";
              const opacityRange = isDark ? [0.18, 0.45, 0.18] : [0.38, 0.68, 0.38];
              
              let elementContent = null;
              let customStyle = {};
              
              if (isSymbol) {
                elementContent = obj.val;
                customStyle = {
                  color: isDark ? "rgba(0, 242, 254, 0.65)" : "rgba(79, 70, 229, 0.8)",
                  textShadow: isDark 
                    ? "0 0 12px rgba(0, 242, 254, 0.5), 0 0 25px rgba(0, 242, 254, 0.25)"
                    : "0 0 8px rgba(79, 70, 229, 0.35)",
                  fontSize: obj.size,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 800,
                };
              } else if (isSphere) {
                customStyle = {
                  width: obj.size,
                  height: obj.size,
                  borderRadius: "50%",
                  background: isDark
                    ? "radial-gradient(circle at 30% 30%, rgba(0, 242, 254, 0.6) 0%, rgba(79, 172, 254, 0.3) 50%, rgba(139, 92, 246, 0.1) 80%, rgba(0,0,0,0.65) 100%)"
                    : "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(79, 172, 254, 0.65) 45%, rgba(79, 70, 229, 0.35) 75%, rgba(67, 56, 202, 0.45) 100%)",
                  border: isDark 
                    ? "2px solid rgba(0, 242, 254, 0.55)"
                    : "2px solid rgba(79, 172, 254, 0.85)",
                  boxShadow: isDark
                    ? "0 10px 30px rgba(0, 242, 254, 0.25), inset 0 3px 6px rgba(255,255,255,0.4)"
                    : "0 12px 28px rgba(79, 172, 254, 0.4), inset 0 3px 6px rgba(255,255,255,0.75), 0 4px 8px rgba(0,0,0,0.08)",
                  backdropFilter: "blur(2px)",
                };
              } else if (isCone) {
                const gradId = `cone-grad-${idx}`;
                elementContent = (
                  <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <defs>
                      <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={isDark ? "rgba(0, 242, 254, 0.75)" : "rgba(79, 70, 229, 0.9)"} />
                        <stop offset="50%" stopColor={isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(79, 172, 254, 0.4)"} />
                        <stop offset="100%" stopColor={isDark ? "rgba(0, 242, 254, 0.9)" : "rgba(79, 70, 229, 0.98)"} />
                      </linearGradient>
                    </defs>
                    <path d="M 50,15 L 80,75 A 30,12 0 1,1 20,75 Z" fill={`url(#${gradId})`} stroke={isDark ? "rgba(0, 242, 254, 0.7)" : "rgba(79, 70, 229, 0.8)"} strokeWidth="2.5" />
                    <ellipse cx="50" cy="75" rx="30" ry="12" fill="none" stroke={isDark ? "rgba(0, 242, 254, 0.85)" : "rgba(79, 70, 229, 0.9)"} strokeWidth="1.5" />
                  </svg>
                );
                customStyle = {
                  width: obj.size,
                  height: obj.size,
                  filter: isDark ? "drop-shadow(0 0 12px rgba(0, 242, 254, 0.45))" : "drop-shadow(0 4px 10px rgba(79, 70, 229, 0.35))",
                };
              } else if (isTriangle) {
                elementContent = (
                  <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <polygon 
                      points="50,15 15,80 53,62" 
                      fill={isDark ? "rgba(0, 242, 254, 0.25)" : "rgba(79, 172, 254, 0.3)"} 
                      stroke={isDark ? "rgba(0, 242, 254, 0.8)" : "rgba(79, 172, 254, 0.85)"} 
                      strokeWidth="2.5" 
                    />
                    <polygon 
                      points="50,15 85,80 53,62" 
                      fill={isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(79, 70, 229, 0.35)"} 
                      stroke={isDark ? "rgba(139, 92, 246, 0.8)" : "rgba(79, 70, 229, 0.85)"} 
                      strokeWidth="2.5" 
                    />
                    <polygon 
                      points="15,80 85,80 53,62" 
                      fill={isDark ? "rgba(0, 242, 254, 0.15)" : "rgba(79, 70, 229, 0.15)"} 
                      stroke={isDark ? "rgba(0, 242, 254, 0.55)" : "rgba(79, 70, 229, 0.6)"} 
                      strokeWidth="1.5" 
                      strokeDasharray="2,2"
                    />
                    <polygon 
                      points="50,15 15,80 85,80" 
                      fill="none" 
                      stroke={isDark ? "rgba(0, 242, 254, 0.6)" : "rgba(79, 70, 229, 0.6)"} 
                      strokeWidth="1" 
                    />
                  </svg>
                );
                customStyle = {
                  width: obj.size,
                  height: obj.size,
                  filter: isDark ? "drop-shadow(0 0 12px rgba(0, 242, 254, 0.35))" : "drop-shadow(0 4px 10px rgba(79, 70, 229, 0.3))",
                };
              }

              return (
                <motion.div
                  key={idx}
                  animate={{
                    y: [0, -40, 0],
                    x: [0, 25 * (idx % 2 === 0 ? 1 : -1), 0],
                    rotate: isSphere ? 0 : [0, 360 * (idx % 2 === 0 ? 1 : -1)],
                    opacity: opacityRange,
                  }}
                  transition={{
                    duration: obj.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: obj.delay,
                  }}
                  style={{
                    position: "absolute",
                    top: obj.top,
                    left: obj.left,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                    ...customStyle,
                  }}
                >
                  {elementContent}
                </motion.div>
              );
            })}
          </div>
          <div className="max-w-6xl mx-auto px-6 w-full" style={{ position: "relative", zIndex: 1 }}>
            <div className="hero-grid">
              <div className="hero-copy">

                {/* MCA Student tag - glowing badge entrance */}
                <motion.span
                  className="hero-tag"
                  initial={{ opacity: 0, x: -30, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{
                    display: "inline-block",
                    background: "rgba(79, 172, 254, 0.1)",
                    border: "1px solid rgba(79, 172, 254, 0.25)",
                    padding: "0.5rem 1rem",
                    borderRadius: "999px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      display: "inline-block",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#4FACFE",
                      marginRight: 8,
                      boxShadow: "0 0 8px #4FACFE",
                      verticalAlign: "middle",
                    }}
                  />
                  MCA Graduate
                </motion.span>

                {/* Name heading - staggered letter reveal */}
                <motion.h1
                  className="hero-heading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  style={{ position: "relative", zIndex: 1 }}
                >
                {"Abhay J".split("").map((char, i) => (
                    <motion.span
                      key={`first-${i}`}
                      initial={{ opacity: 0, y: 40, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.4 + i * 0.035,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                      style={{ display: "inline-block", whiteSpace: "pre" }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}

                  <br />

                  {"Padmashali".split("").map((char, i) => (
                    <motion.span
                      key={`second-${i}`}
                      initial={{ opacity: 0, y: 40, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.4 + ("Abhay J".length + i) * 0.035,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                      style={{ display: "inline-block", whiteSpace: "pre" }}
                    >
                      {char}
                    </motion.span>
                  ))}
                  {/* Animated underline */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{
                      height: 4,
                      background: "linear-gradient(90deg, #4FACFE, #00F2FE, transparent)",
                      borderRadius: 4,
                      transformOrigin: "left",
                      marginTop: "0.5rem",
                    }}
                  />
                </motion.h1>

                {/* Subtitle - blur and slide in */}
                <motion.p
                  className="hero-subtitle"
                  initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
                  style={{ marginBottom: "1.8rem", position: "relative", zIndex: 1 }}
                >
                  {DATA.hero.subtitle}
                </motion.p>

                {/* Tagline - slide up with fade */}
                <motion.p
                  className="section-lead"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.6, ease: "easeOut" }}
                  style={{ maxWidth: 520, marginBottom: "2rem", position: "relative", zIndex: 1 }}
                >
                  {DATA.hero.tagline}
                </motion.p>

                {/* Buttons - staggered spring entrance */}
                <motion.div
                  className="hero-actions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 1.8 }}
                  style={{ marginTop: "2rem", flexWrap: "wrap", position: "relative", zIndex: 1 }}
                >
                  {[
                    { href: "#contact", className: "btn-primary ripple-container", children: "Let's Talk", icon: null },
                    { href: DATA.hero.github, className: "btn-outline ripple-container", children: "GitHub", icon: <Github size={16} style={{ display: "inline", marginRight: 6 }} />, external: true },
                    { href: `${base}${DATA.hero.resumeFile}`, className: "btn-outline ripple-container", children: "Resume", icon: <Download size={16} style={{ display: "inline", marginRight: 6 }} />, download: "Abhay-J-Padmashali-Resume.pdf", external: true },
                  ].map((btn, i) => (
                    <motion.a
                      key={i}
                      href={btn.href}
                      className={btn.className}
                      onMouseDown={addRipple}
                      onTouchStart={addRipple}
                      {...(btn.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      {...(btn.download ? { download: btn.download } : {})}

                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 1.9 + i * 0.15,
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {btn.icon}
                      {btn.children}
                    </motion.a>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative"
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
              >
                <div className="hero-image-glow" />
                <div className="hero-image-ring" />
                <div className="hero-profile hero-profile-large anim-float">
                  <img src={`${base}images/abhay-profile.jpg`} alt="Abhay J Padmashali" />
                </div>
                <div className="hero-image-border" />
                <div className="hero-badge hero-badge-large">
                  MCA Graduate @ MAHE Manipal
                </div>
              </motion.div>
            </div>

            <div className="flex justify-center mt-14">
              <motion.a
                href="#about"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="scroll-hint"
              >
                <span>Scroll Down</span>
                <ChevronDown size={20} />
              </motion.a>
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" className="page-section">
          <div className="max-w-6xl mx-auto px-6">
            <SectionTitle sub="Get To Know" title="About Me" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
              className="section-panel max-w-3xl mx-auto"
              style={{ position: "relative", overflow: "hidden" }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: THEME_GRADIENTS[0],
                  opacity: 0.04,
                  zIndex: 0,
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="section-lead"
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.9,
                    color: "var(--eg-text-light)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "1rem",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    textShadow: "0 0 20px rgba(79, 172, 254, 0.1)",
                    marginBottom: "2rem",
                    textAlign: "center",
                  }}
                >
                  {DATA.about}
                </motion.p>

                {/* Typing Animation Roles at Bottom */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex justify-center"
                  style={{
                    marginTop: "2rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid var(--eg-border)",
                  }}
                >
                  <TypingRoles />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── WORK EXPERIENCE ── */}
        <section id="experience" className="page-section">
          <div className="max-w-6xl mx-auto px-6">
            <SectionTitle sub="Career Journey" title="Work Experience" />

            <div className="experience-timeline-container max-w-4xl mx-auto">
              {DATA.experience.map((exp, i) => {
                const bgGradient = THEME_GRADIENTS[(i + 1) % THEME_GRADIENTS.length];
                const colors = bgGradient.match(/#[A-Fa-f0-9]{6}/g) || ["#00F2FE", "#4FACFE"];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, damping: 14, delay: i * 0.1 }}
                    className="feature-card"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      border: "1px solid var(--eg-border)",
                      borderRadius: "1.5rem",
                      background: "var(--eg-bg-variant)",
                      padding: "2rem",
                      marginBottom: "2rem",
                    }}
                  >
                    {/* Background subtle radial glow */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: `radial-gradient(circle at top right, ${colors[0]}15, transparent 65%)`,
                        zIndex: 0,
                      }}
                    />

                    {/* Top colored highlight strip */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: bgGradient,
                        opacity: 0.85,
                      }}
                    />

                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 14,
                              background: bgGradient,
                              display: "grid",
                              placeItems: "center",
                              boxShadow: `0 8px 20px ${colors[0]}35`,
                              flexShrink: 0,
                            }}
                          >
                            <Briefcase size={24} style={{ color: "#000" }} />
                          </div>
                          <div>
                            <h3
                              style={{
                                margin: 0,
                                fontWeight: 700,
                                fontSize: "1.35rem",
                                color: "var(--eg-text)",
                                fontFamily: "var(--font-display)",
                                letterSpacing: "0.02em",
                              }}
                            >
                              {exp.role}
                            </h3>
                            <h4
                              style={{
                                margin: "0.2rem 0 0",
                                fontWeight: 600,
                                fontSize: "1.05rem",
                                color: colors[0],
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              {exp.company}
                              <span style={{ fontSize: "0.8rem", opacity: 0.7, color: "var(--eg-text-light)" }}>
                                • {exp.location}
                              </span>
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "0.4rem 0.9rem",
                              borderRadius: "999px",
                              background: `${colors[0]}15`,
                              border: `1px solid ${colors[0]}35`,
                              color: colors[0],
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              fontFamily: "var(--font-accent)",
                              letterSpacing: "0.03em",
                            }}
                          >
                            <Calendar size={13} />
                            {exp.period}
                          </span>
                          <span
                            style={{
                              padding: "0.4rem 0.85rem",
                              borderRadius: "999px",
                              background: "var(--eg-primary-var)",
                              border: "1px solid var(--eg-border)",
                              color: "var(--eg-text)",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            {exp.type}
                          </span>
                        </div>
                      </div>

                      <p
                        style={{
                          color: "var(--eg-text-light)",
                          fontSize: "0.95rem",
                          lineHeight: 1.7,
                          marginBottom: "1.25rem",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {exp.description}
                      </p>

                      {exp.highlights && exp.highlights.length > 0 && (
                        <div style={{ marginBottom: "1.5rem" }}>
                          <h5
                            style={{
                              fontSize: "0.85rem",
                              color: "var(--eg-text)",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              marginBottom: "0.6rem",
                              fontFamily: "var(--font-accent)",
                            }}
                          >
                            Key Responsibilities & Achievements:
                          </h5>
                          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                            {exp.highlights.map((hl, hIdx) => (
                              <li
                                key={hIdx}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: "0.65rem",
                                  fontSize: "0.9rem",
                                  color: "var(--eg-text-light)",
                                  lineHeight: 1.6,
                                  fontFamily: "var(--font-sans)",
                                }}
                              >
                                <span style={{ color: colors[0], marginTop: "3px", fontSize: "1rem" }}>✦</span>
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {exp.skills && exp.skills.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4" style={{ borderTop: "1px solid var(--eg-border)" }}>
                          <div className="flex flex-wrap gap-2">
                            {exp.skills.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                style={{
                                  fontSize: "0.78rem",
                                  fontWeight: 600,
                                  padding: "0.3rem 0.75rem",
                                  borderRadius: "8px",
                                  background: "rgba(255, 255, 255, 0.05)",
                                  border: "1px solid var(--eg-border)",
                                  color: "var(--eg-text)",
                                  fontFamily: "var(--font-sans)",
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          {exp.projectLink && (
                            <a
                              href={exp.projectLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-outline ripple-container"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "0.8rem",
                                padding: "0.4rem 0.95rem",
                                borderRadius: "999px",
                                textDecoration: "none",
                              }}
                            >
                              <Github size={14} />
                              <span>View AutoML Repository</span>
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" className="page-section">
          <div className="max-w-7xl mx-auto px-6">
            <SectionTitle sub="What I Know" title="Skills" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="skill-summary section-panel w-full"
              >
                <p className="section-lead text-center" style={{ marginBottom: "1.5rem" }}>
                  I use these skills to turn concepts into interactive products. The progress bars show where I focus most of my time and polish.
                </p>
                <div className="skills-grid-3cols">
                  {DATA.skills.map((skill, index) => {
                    const SkillIcon = getSkillIcon(skill.name);
                    const gradients = [
                      "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)",
                      "linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)",
                      "linear-gradient(135deg, #D4FC79 0%, #96E6A1 100%)",
                      "linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)",
                      "linear-gradient(135deg, #FCCB90 0%, #D57EEB 100%)",
                      "linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)",
                      "linear-gradient(135deg, #F093FB 0%, #F5576C 100%)",
                      "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
                      "linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)",
                      "linear-gradient(135deg, #FA709A 0%, #FEE140 100%)",
                      "linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)",
                      "linear-gradient(135deg, #FF0844 0%, #FFB199 100%)"
                    ];
                    const bgGradient = gradients[index % gradients.length];

                    return (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 100, damping: 12, delay: index * 0.03 }}
                        className="skill-row-compact"
                        style={{
                          position: "relative",
                          overflow: "hidden"
                        }}
                      >
                        {/* Subtle gradient glow in the background */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: bgGradient,
                            opacity: 0.03,
                            zIndex: 0
                          }}
                        />

                        <div style={{ position: "relative", zIndex: 1 }}>
                             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", minWidth: 0 }}>
                              <div style={{
                                width: 44,
                                height: 44,
                                borderRadius: "12px",
                                background: bgGradient,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: `0 4px 15px ${(bgGradient.match(/#[A-Fa-f0-9]{6}/g)?.[0] || "#4FACFE")}40`,
                                position: "relative",
                                flexShrink: 0
                              }}>
                                <SkillIcon size={22} style={{ color: "#000" }} />
                              </div>
                              <strong className="skill-name-compact">{skill.name}</strong>
                            </div>

                            <div className="skill-score-compact">
                              <span
                                className="skill-score-number"
                                style={{
                                  display: "inline-block",
                                  background: bgGradient,
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                }}
                              >
                                {skill.level}
                              </span>
                              <span className="skill-score-total">/ 100</span>
                            </div>
                          </div>

                          {/* Gaming Fuel Tank */}
                          <div style={{
                            width: "100%",
                            height: "28px",
                            background: "rgba(0, 0, 0, 0.6)",
                            border: "2px solid rgba(255,255,255,0.08)",
                            borderRadius: "4px",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: "inset 0 0 12px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)",
                          }}>
                            {/* Inner bevel / frame effect */}
                            <div style={{
                              position: "absolute",
                              inset: "1px",
                              border: "1px solid rgba(255,255,255,0.04)",
                              borderRadius: "3px",
                              pointerEvents: "none",
                              zIndex: 4,
                            }} />

                            {/* Fuel Fill */}
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.06 }}
                              style={{
                                height: "100%",
                                background: bgGradient,
                                position: "relative",
                                boxShadow: `0 0 15px ${bgGradient.match(/#[A-Fa-f0-9]{6}/g)?.[0] || "#4FACFE"}66, inset 0 1px 0 rgba(255,255,255,0.25)`,
                              }}
                            >
                              {/* Top glass reflection */}
                              <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "35%",
                                background: "linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0))",
                                borderRadius: "2px 2px 0 0",
                              }} />

                              {/* Animated shimmer sweep */}
                              <div style={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
                                animation: "fuelShimmer 2.5s ease-in-out infinite",
                              }} />

                              {/* Glowing right edge */}
                              <div style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                width: "4px",
                                height: "100%",
                                background: "rgba(255,255,255,0.5)",
                                boxShadow: `0 0 10px ${bgGradient.match(/#[A-Fa-f0-9]{6}/g)?.[0] || "#4FACFE"}, 0 0 20px ${bgGradient.match(/#[A-Fa-f0-9]{6}/g)?.[0] || "#4FACFE"}88`,
                                filter: "blur(1px)",
                              }} />
                            </motion.div>

                            {/* Thick black cell dividers */}
                            <div style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              justifyContent: "space-evenly",
                              pointerEvents: "none",
                              zIndex: 5,
                            }}>
                              {[...Array(9)].map((_, i) => (
                                <div key={i} style={{
                                  width: "3px",
                                  height: "100%",
                                  background: "rgba(0, 0, 0, 0.85)",
                                  boxShadow: "1px 0 0 rgba(0,0,0,0.4), -1px 0 0 rgba(0,0,0,0.4)",
                                }} />
                              ))}
                            </div>

                            {/* Scanline overlay */}
                            <div style={{
                              position: "absolute",
                              inset: 0,
                              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
                              pointerEvents: "none",
                              zIndex: 2,
                            }} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>

            {/* Technology stack horizontal marquee */}
            <TechStackMarquee />
          </div>

        </section>
        {/* ── SERVICES (moved after Skills) ── */}
        <section id="services" className="page-section">
          <div className="max-w-6xl mx-auto px-6">
            <SectionTitle sub="What I Offer" title="Services I Offer" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DATA.services.map((s, i) => (
                <ServiceCard 
                  key={s.title}
                  service={s}
                  index={i}
                  addRipple={addRipple}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── LANGUAGES ── */}
        <section id="languages" className="page-section">
          <div className="max-w-6xl mx-auto px-6">
            <SectionTitle sub="What I Speak" title="Languages" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lang-ring-grid"
            >
              {DATA.languages.map((lang, i) => {
                const bgGradient = THEME_GRADIENTS[(i + 2) % THEME_GRADIENTS.length];
                const colors = bgGradient.match(/#[A-Fa-f0-9]{6}/g) || ["#4FACFE", "#00F2FE"];
                const strength = LANGUAGE_STRENGTH[lang.proficiency] || 60;
                const radius = 54;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference - (strength / 100) * circumference;

                return (
                  <motion.div
                    key={lang.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, damping: 14, delay: i * 0.1 }}
                    whileHover={{ 
                      y: -6, 
                      scale: 1.04,
                      borderColor: colors[0],
                      boxShadow: `0 15px 35px rgba(0, 0, 0, 0.2), 0 0 20px ${colors[0]}20`
                    }}
                    whileTap={{ 
                      scale: 0.98, 
                      y: -2,
                      borderColor: colors[0],
                      boxShadow: `0 15px 35px rgba(0, 0, 0, 0.2), 0 0 20px ${colors[0]}20`
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "2rem 1.25rem 1.5rem",
                      background: "var(--eg-bg-variant)",
                      border: "1px solid var(--eg-border)",
                      borderRadius: "1.25rem",
                      position: "relative",
                      overflow: "hidden",
                      cursor: "default",
                    }}
                  >
                    {/* Background gradient glow */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(circle at 50% 30%, ${colors[0]}15, transparent 70%)`,
                      zIndex: 0,
                    }} />

                    {/* Ring gauge */}
                    <div className="lang-ring-container" style={{ position: "relative", zIndex: 1, marginBottom: "1rem" }}>
                      <svg viewBox="0 0 130 130" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                        {/* Background track */}
                        <circle
                          cx="65" cy="65" r={radius}
                          fill="none"
                          stroke="rgba(255,255,255,0.06)"
                          strokeWidth="10"
                        />
                        {/* Animated fill ring */}
                        <motion.circle
                          cx="65" cy="65" r={radius}
                          fill="none"
                          stroke={`url(#lang-grad-${i})`}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          initial={{ strokeDashoffset: circumference }}
                          whileInView={{ strokeDashoffset }}
                          viewport={{ once: true }}
                          transition={{ duration: 2, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.15 }}
                          style={{
                            filter: `drop-shadow(0 0 6px ${colors[0]}88)`,
                          }}
                        />
                        <defs>
                          <linearGradient id={`lang-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={colors[0]} />
                            <stop offset="100%" stopColor={colors[1]} />
                          </linearGradient>
                        </defs>
                      </svg>
                      {/* Center percentage */}
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <span 
                          className="lang-percent-text"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 800,
                            background: bgGradient,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            lineHeight: 1,
                          }}
                        >
                          {strength}%
                        </span>
                      </div>
                    </div>

                    {/* Language name */}
                    <strong style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      marginBottom: "0.35rem",
                      color: "var(--eg-text)",
                      position: "relative",
                      zIndex: 1,
                    }}>
                      {lang.name}
                    </strong>

                    {/* Proficiency badge */}
                    <span 
                      className="lang-proficiency-badge"
                      style={{
                        background: `${colors[0]}15`,
                        border: `1px solid ${colors[0]}30`,
                        color: colors[0],
                      }}
                    >
                      {lang.proficiency}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ── CERTIFICATIONS ── */}
        <section id="certifications" className="page-section">
          <div className="max-w-6xl mx-auto px-6">
            <SectionTitle sub="My Credentials" title="Certifications" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {DATA.certifications.map((cert, i) => {
                const bgGradient = THEME_GRADIENTS[(i + 4) % THEME_GRADIENTS.length];
                return (
                  <motion.a
                    key={i}
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, damping: 12, delay: i * 0.08 }}
                    className="cert-card ripple-container shine-hover"
                    onMouseDown={addRipple}
                    onTouchStart={addRipple}
                    style={{ position: "relative", overflow: "hidden" }}
                  >
                    {/* Subtle gradient glow in the background */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: bgGradient,
                        opacity: 0.03,
                        zIndex: 0
                      }}
                    />
                    <div
                      className="section-panel"
                      style={{ padding: 0, border: "none", background: "transparent", position: "relative", zIndex: 1 }}
                    >
                      <div
                        style={{
                          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                          background: bgGradient,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          marginBottom: "1rem",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
                        }}
                      >
                        <Award size={20} style={{ color: "#000" }} />
                      </div>
                      <h4 style={{ fontWeight: 600, fontSize: "1rem", marginBottom: 6 }}>{cert.name}</h4>
                      <p style={{ color: "var(--eg-text)", fontSize: "0.85rem", marginBottom: 6 }}>{cert.issuer}</p>
                      <p style={{ color: "var(--eg-text-light)", fontSize: "0.82rem" }}>
                        Click to verify →
                      </p>
                    </div>
                  </motion.a>
                )
              })}
            </motion.div>

            <div className="mt-14">
              <SectionTitle sub="Beyond Code" title="Achievements" />
              <div className="grid gap-4 max-w-xl mx-auto">
                {DATA.achievements.map((a, i) => {
                  const bgGradient = THEME_GRADIENTS[(i + 9) % THEME_GRADIENTS.length];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 100, damping: 12, delay: i * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="achievement-card"
                      style={{ position: "relative", overflow: "hidden", padding: "1.25rem", border: "1px solid var(--eg-border)", borderRadius: "1.25rem", display: "flex", alignItems: "flex-start", gap: "1rem" }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: bgGradient,
                          opacity: 0.04,
                          zIndex: 0
                        }}
                      />
                      <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                        <span style={{
                          background: bgGradient,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontSize: "1.5rem",
                          lineHeight: 1
                        }}>✦</span>
                        <p style={{ color: "var(--eg-text-light)", fontSize: "0.95rem", margin: 0, fontFamily: "var(--font-sans)", fontWeight: 400, letterSpacing: "0.01em", lineHeight: 1.6 }}>{a}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── EDUCATION ── */}
        <section id="education" className="page-section">
          <div className="max-w-6xl mx-auto px-6">
            <SectionTitle sub="My Academic" title="Education" />
            <div className="education-timeline-container">
              <div className="education-timeline-line" />
              {DATA.education.map((edu, i) => {
                const bgGradient = THEME_GRADIENTS[(i + 7) % THEME_GRADIENTS.length];
                const colors = bgGradient.match(/#[A-Fa-f0-9]{6}/g) || ["#4FACFE", "#00F2FE"];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, damping: 14, delay: i * 0.1 }}
                    className="education-timeline-item"
                  >
                    <div 
                      className="education-timeline-dot"
                      style={{
                        border: `3px solid ${colors[0]}`,
                        boxShadow: `0 0 10px ${colors[0]}`
                      }}
                    >
                      <div 
                        className="education-timeline-dot-inner"
                        style={{
                          background: colors[1] || "var(--eg-primary)"
                        }}
                      />
                    </div>
                    <motion.div
                      className="education-timeline-card"
                      whileHover={{ 
                        borderColor: colors[0],
                        y: -4,
                        boxShadow: `0 15px 30px rgba(0, 0, 0, 0.15), 0 0 15px ${colors[0]}15`
                      }}
                      whileTap={{ 
                        scale: 0.99,
                        y: -1,
                        borderColor: colors[0],
                        boxShadow: `0 15px 30px rgba(0, 0, 0, 0.15), 0 0 15px ${colors[0]}15`
                      }}
                      style={{ cursor: "pointer" }}
                      onClick={() => {}}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: bgGradient,
                          opacity: 0.03,
                          zIndex: 0
                        }}
                      />
                      <div style={{ position: "relative", zIndex: 1 }} className="education-timeline-header">
                        <div>
                          <h3 className="education-timeline-title">{edu.degree}</h3>
                          <p className="education-timeline-institution">{edu.institution}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {edu.status && (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                background: "rgba(34, 197, 94, 0.12)",
                                border: "1px solid rgba(34, 197, 94, 0.3)",
                                color: "#22c55e",
                                padding: "0.25rem 0.65rem",
                                borderRadius: "999px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                              }}
                            >
                              <CheckCircle size={12} />
                              {edu.status}
                            </span>
                          )}
                          <span 
                            className="education-timeline-period"
                            style={{
                              background: `${colors[0]}15`,
                              border: `1px solid ${colors[0]}30`,
                              color: colors[0],
                            }}
                          >
                            {edu.period}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" className="page-section">
          <div className="max-w-6xl mx-auto px-6">
            <SectionTitle sub="My Recent Work" title="Projects" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {visibleProjects.map((project, i) => (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 100, damping: 14, delay: i * 0.08 }}
                    className="project-card shine-hover"
                  >
                    <div className="project-image">
                      <img
                        src={`${base}images/${project.image}`}
                        alt={project.title}
                        className="project-media"
                      />
                      {/* HTML / CSS badge - unique stacked ribbon */}
                    {/* badges removed from image - rendered below description */}
                      <div className="project-overlay">
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
                          >
                            <Github size={14} style={{ display: "inline", marginRight: 4 }} />
                            GitHub
                          </a>
                        )}
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline"
                            style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
                          >
                            <ExternalLink size={14} style={{ display: "inline", marginRight: 4 }} />
                            Live
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="project-body" style={{ padding: "1rem" }}>
                      <div className="project-card-top" style={{ marginBottom: "0.4rem" }}>
                        <span className="project-tag" style={{ fontSize: "0.65rem", padding: "0.2rem 0.6rem" }}>
                          {project.badge || "Project"}
                        </span>
                      </div>
                      <h3 style={{ fontWeight: 700, marginBottom: "0.4rem", fontSize: "1rem", fontFamily: "var(--font-display)" }}>
                        {project.title}
                      </h3>
                      <p style={{ color: "var(--eg-text-light)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "0.75rem", fontFamily: "var(--font-sans)", fontWeight: 400, letterSpacing: "0.01em" }}>
                        {project.description}
                      </p>
                      
                        {/* Render tech badges below project description */}
                        <div className="project-badges">
                          {(() => {
                            const raw = project.tech || [];
                            const splitTokens = (s) => String(s).split(/[\/|,&]+/).map(x => x.trim()).filter(Boolean);
                            const tokens = raw.flatMap(splitTokens).map(t => t.replace(/\s+/g, ' ').trim());

                            const normalize = (tok) => {
                              const k = tok.toLowerCase();
                              if (k.includes('fastapi')) return 'FastAPI';
                              if (k.includes('python')) return 'Python';
                              if (k.includes('openweather')) return 'OpenWeatherMap';
                              if (k === 'openweathermap api' || k === 'openweathermap api') return 'OpenWeatherMap';
                              if (k.includes('tailwind')) return 'TailwindCSS';
                              if (k.includes('html')) return 'HTML';
                              if (k.includes('css')) return 'CSS';
                              if (k === 'js') return 'JavaScript';
                              if (k.includes('javascript')) return 'JavaScript';
                              if (k.includes('php')) return 'PHP';
                              if (k.includes('mysql')) return 'MySQL';
                              if (k.includes('sqlite')) return 'SQLite';
                              if (k.includes('xampp')) return 'XAMPP';
                              if (k.includes('react')) return 'React';
                              if (k.includes('xml')) return 'XML';
                              if (k.includes('java') && !k.includes('javascript')) return 'Java';
                              return tok.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                            };

                            const mapped = tokens.map(normalize);
                            // If a combined HTML/CSS token exists, prefer separate HTML and CSS badges
                            const expanded = mapped.flatMap(m => m === 'HTML/CSS' ? ['HTML', 'CSS'] : m);
                            const unique = Array.from(new Set(expanded));

                            return unique.map((tech, ti) => {
                              const key = tech.toLowerCase();

                              let Icon = null;
                              if (key === 'html') Icon = SiHtml5;
                              else if (key === 'css') Icon = SiHtml5;
                              else if (key === 'javascript') Icon = SiJavascript;
                              else if (key === 'php') Icon = SiPhp;
                              else if (key === 'mysql') Icon = SiMysql;
                              else if (key === 'sqlite') Icon = SiSqlite;
                              else if (key === 'react') Icon = SiReact;
                              else if (key === 'tailwindcss') Icon = SiTailwindcss;
                              else if (key === 'java') Icon = FaJava;
                              else if (key === 'xampp') Icon = Database;
                              else if (key === 'xml') Icon = FileCode;
                              else if (key === 'openweathermap') Icon = Cloud;

                              let cls = 'badge-default';
                              if (key === 'html') cls = 'badge-html';
                              else if (key === 'css') cls = 'badge-css';
                              else if (key === 'javascript') cls = 'badge-js';
                              else if (key === 'php') cls = 'badge-php';
                              else if (key === 'mysql') cls = 'badge-mysql';
                              else if (key === 'sqlite') cls = 'badge-sqlite';
                              else if (key === 'react') cls = 'badge-react';
                              else if (key === 'fastapi') cls = 'badge-fastapi';
                              else if (key === 'python') cls = 'badge-python';
                              else if (key === 'tailwindcss') cls = 'badge-tailwind';
                              else if (key === 'openweathermap') cls = 'badge-api';
                              else if (key === 'xml') cls = 'badge-xml';
                              else if (key === 'xampp') cls = 'badge-xampp';
                              else if (key === 'java') cls = 'badge-java';
                              else if (key === 'vite') cls = 'badge-vite';

                              return (
                                <div key={ti} className={`badge-chip ${cls}`} title={tech}>
                                  {Icon ? <Icon size={14} /> : <span style={{ fontSize: 12, fontWeight: 800 }}>{tech.split(/\s|\//)[0]}</span>}
                                  <span style={{ marginLeft: 8 }}>{tech}</span>
                                </div>
                              );
                            });
                          })()}
                        </div>

                        <div style={{ marginTop: "0.5rem" }}>
                            {project.githubLink && (
                              <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                style={{ color: "var(--eg-primary)", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem", textDecoration: "none" }}>
                                <Github size={14} /> GitHub
                              </a>
                            )}
                          {project.liveLink && (
                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                              style={{ color: "var(--eg-primary)", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem", textDecoration: "none" }}>
                              <ExternalLink size={14} /> Live Demo
                            </a>
                          )}
                        </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {DATA.projects.length > 3 && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setShowAllProjects((p) => !p)}
                  className="btn-outline ripple-container"
                  onMouseDown={addRipple}
                  onTouchStart={addRipple}
                >
                  {showAllProjects
                    ? "Show Less"
                    : `View More Projects (${DATA.projects.length - 3} more)`}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── ARCADE ── */}
        <section id="arcade" className="page-section flex flex-col items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
            <SectionTitle sub="Interactive Game" title="Retro Arcade" />
            <p className="section-lead text-center" style={{ marginBottom: "2rem" }}>
              Take a quick break and play a game of Brick Breaker! Clear all blocks to unlock the Coding Legend Badge!
            </p>
            <div className="flex justify-center w-full">
              <RetroArcade theme={theme} />
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="page-section">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionTitle sub="Get In Touch" title="Contact Me" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">
              {/* Contact options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="flex flex-col gap-5 w-full"
              >
                {[
                  { icon: <Mail size={22} />, label: "Email", value: DATA.hero.email, href: `mailto:${DATA.hero.email}` },
                  { icon: <Phone size={22} />, label: "Phone", value: DATA.hero.phone, href: `tel:${DATA.hero.phone}` },
                  { icon: <MapPin size={22} />, label: "Location", value: DATA.hero.location, href: DATA.hero.mapsLink },
                  { icon: <Github size={22} />, label: "GitHub", value: "abhiAbhayj", href: DATA.hero.github },
                  { icon: <Linkedin size={22} />, label: "LinkedIn", value: "abhay-j2003", href: DATA.hero.linkedin },
                ].map((item, i) => {
                  const bgGradient = THEME_GRADIENTS[(i + 3) % THEME_GRADIENTS.length];
                  const colors = bgGradient.match(/#[A-Fa-f0-9]{6}/g) || ["#4FACFE", "#00F2FE"];
                  const primaryColor = colors[0];
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="contact-card ripple-container shine-hover"
                      onMouseDown={addRipple}
                      onTouchStart={addRipple}
                      whileHover={{ scale: 1.03, y: -3 }}
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        textDecoration: "none",
                        border: "1px solid var(--eg-border)",
                        borderRadius: "1.5rem",
                        "--glow-color": primaryColor
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: bgGradient,
                          opacity: 0.04,
                          zIndex: 0
                        }}
                      />
                      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", width: "100%", gap: "1rem" }} className="w-full flex items-center justify-between contact-inner-flex">
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }} className="contact-left-group">
                          <div
                            className="contact-icon-wrap"
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: "50%",
                              flexShrink: 0,
                              background: bgGradient,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#000",
                              boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
                            }}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <p className="contact-text-label" style={{ fontSize: "0.85rem", color: "var(--eg-text-light)", margin: 0, marginBottom: 4 }}>{item.label}</p>
                            <p className="contact-text-value" style={{ fontWeight: 600, fontSize: "0.95rem", margin: 0, color: "var(--eg-text)" }}>{item.value}</p>
                          </div>
                        </div>

                        {item.label === "Email" && (
                          <button
                            onClick={handleCopyEmail}
                            title="Copy to Clipboard"
                            className="contact-copy-btn"
                            style={{
                              marginLeft: "auto",
                              background: "rgba(255,255,255,0.08)",
                              border: "1px solid rgba(255,255,255,0.12)",
                              color: "var(--eg-text)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                              zIndex: 10,
                              width: "36px",
                              height: "36px",
                            }}
                          >
                            <AnimatePresence mode="wait">
                              {copiedEmail ? (
                                <motion.span
                                  key="check"
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.5, opacity: 0 }}
                                  style={{ color: "#10b981", display: "flex", alignItems: "center" }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                                </motion.span>
                              ) : (
                                <motion.span
                                  key="copy"
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.5, opacity: 0 }}
                                  style={{ display: "flex", alignItems: "center" }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </button>
                        )}
                      </div>
                    </motion.a>
                  )
                })}
              </motion.div>

              {/* Quick message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                whileHover={{ scale: 1.01 }}
                className="w-full contact-form-card"
                style={{ position: "relative", overflow: "hidden", borderRadius: "1.5rem", border: "1px solid var(--eg-border)", background: "var(--eg-bg-variant)" }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: THEME_GRADIENTS[1],
                    opacity: 0.03,
                    zIndex: 0
                  }}
                />
                <form
                  onSubmit={handleFormSubmit}
                  className="flex flex-col gap-4"
                  style={{ position: "relative", zIndex: 1, padding: "1.5rem" }}
                  noValidate
                >
                  <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Send a Message</h3>
                  
                  <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formValues.name}
                      onChange={handleInputChange}
                      className={`input-field ${formErrors.name ? "error" : formValues.name.trim().length >= 2 ? "success" : ""}`}
                      disabled={isSubmitting}
                    />
                    {formErrors.name && (
                      <span className="validation-error-text">{formErrors.name}</span>
                    )}
                  </div>

                  <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formValues.email}
                      onChange={handleInputChange}
                      className={`input-field ${formErrors.email ? "error" : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formValues.email.trim()) ? "success" : ""}`}
                      disabled={isSubmitting}
                    />
                    {formErrors.email && (
                      <span className="validation-error-text">{formErrors.email}</span>
                    )}
                  </div>

                  <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      rows={5}
                      value={formValues.message}
                      onChange={handleInputChange}
                      className={`input-field ${formErrors.message ? "error" : formValues.message.trim().length >= 10 ? "success" : ""}`}
                      style={{ resize: "vertical", minHeight: 150 }}
                      disabled={isSubmitting}
                    />
                    {formErrors.message && (
                      <span className="validation-error-text">{formErrors.message}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-primary ripple-container"
                    onMouseDown={addRipple}
                    onTouchStart={addRipple}
                    disabled={isSubmitting}
                    style={{ 
                      width: "100%", 
                      textAlign: "center", 
                      background: THEME_GRADIENTS[1], 
                      color: "#000", 
                      border: "none", 
                      fontWeight: 800,
                      opacity: isSubmitting ? 0.7 : 1,
                      cursor: isSubmitting ? "not-allowed" : "pointer"
                    }}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>

                  <AnimatePresence>
                    {submitStatus === "success" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="form-feedback success-banner"
                        style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}
                      >
                        <CheckCircle size={16} />
                        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Message sent successfully! Thank you.</span>
                      </motion.div>
                    )}

                    {submitStatus === "error" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="form-feedback error-banner"
                        style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}
                      >
                        <AlertCircle size={16} />
                        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Failed to send. Please try again.</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-strip">
          <p>Connect on GitHub, LinkedIn, or send a quick note.</p>
          <div className="footer-social-links">
            {FOOTER_SOCIALS.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                <item.Icon size={18} />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="footer-quick-links footer-compact-links">
          {QUICK_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="footer-link footer-link-chip">
              {link.label}
            </a>
          ))}
        </div>
        <div className="footer-meta">
          <p>&copy; {new Date().getFullYear()} Abhay J Padmashali. Built with React + Vite.</p>
        </div>
      </footer>

      {/* Inline styles for badges and small UI tweaks */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Ensure project-card is positioned for badge placement */
        .project-card { position: relative; overflow: hidden; }

        /* Project badges container (below description) */
        .project-badges {
          display: flex;
          gap: 8px;
          margin-top: 2px; /* small 2px gap below description as requested */
          flex-wrap: wrap;
          align-items: center;
        }

        /* Individual badge chip */
        .badge-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 8px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          box-shadow: 0 6px 18px rgba(0,0,0,0.25);
          transform: translateY(0) rotate(0deg);
          transition: transform 220ms cubic-bezier(.2,.9,.2,1), box-shadow 220ms;
          pointer-events: auto;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .badge-chip span { display: inline-block; line-height: 1; }

        .badge-html { background: linear-gradient(135deg,#FF6A00 0%, #FF8A3D 100%); }
        .badge-css { background: linear-gradient(135deg,#0060FF 0%, #00A6FF 100%); }
        .badge-js { background: linear-gradient(135deg,#F7DF1E 0%, #E6C21A 100%); color: #000; }
        .badge-php { background: linear-gradient(135deg,#777BB3 0%, #6f52b8 100%); }
        .badge-mysql { background: linear-gradient(135deg,#00758F 0%, #00A2B5 100%); }
        .badge-sqlite { background: linear-gradient(135deg,#3C8DBC 0%, #66B3D6 100%); }
        .badge-react { background: linear-gradient(135deg,#61DAFB 0%, #39C5F0 100%); color: #000; }
        .badge-java { background: linear-gradient(135deg,#EA4C2A 0%, #BF2E1C 100%); }
        .badge-vite { background: linear-gradient(135deg,#646cff 0%, #8e9bff 100%); }
        .badge-default { background: linear-gradient(135deg,#555 0%, #777 100%); }
        .badge-tailwind { background: linear-gradient(135deg,#06B6D4 0%, #0EA5A4 100%); }
        .badge-fastapi { background: linear-gradient(135deg,#009688 0%, #059669 100%); }
        .badge-python { background: linear-gradient(135deg,#3776AB 0%, #2b5b84 100%); }
        .badge-api { background: linear-gradient(135deg,#8E44AD 0%, #6D28D9 100%); }
        .badge-xml { background: linear-gradient(135deg,#00A3E0 0%, #0077B6 100%); }
        .badge-xampp { background: linear-gradient(135deg,#FF6B6B 0%, #FF9A8B 100%); }

        /* Hover lift on the project card badges */
        .project-card:hover .badge-chip { transform: translateY(-4px) rotate(0deg); box-shadow: 0 12px 28px rgba(0,0,0,0.25); }

        /* Make the icons crisp inside badge */
        .badge-chip svg { filter: drop-shadow(0 1px 0 rgba(0,0,0,0.12)); }

        /* ensure badges stand out on light backgrounds */
        .badge-chip { color: #fff !important; }
        .badge-js, .badge-react { color: #000 !important; }

        /* Small responsive tweak */
        @media (max-width: 640px) {
          .badge-chip { padding: 5px 7px; font-size: 0.7rem; }
        }
      `}</style>
    </div>
  );
}
