"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Cloud,
  Cpu,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  ArrowRight,
  ChevronDown,
} from "./icons";

/* ─── Contact / identity ────────────────────────────────── */

const EMAIL = "damian.villarreal01@utrgv.edu";
const LINKEDIN = "https://linkedin.com/in/dsuyu";
const GITHUB = "https://github.com/dsuyu1";
const THREATSCAPER = "https://security.damianvillarreal.com";

/* ─── Starfield ─────────────────────────────────────────── */

function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.15 + 0.1,
      o: Math.random() * 0.5 + 0.08,
      vx: (Math.random() - 0.5) * 0.055,
      vy: Math.random() * 0.038 + 0.006,
      tp: Math.random() * Math.PI * 2,
      ts: Math.random() * 0.007 + 0.002,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.tp += s.ts;
        const opacity = s.o * (0.8 + 0.2 * Math.sin(s.tp));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 225, 255, ${opacity})`;
        ctx.fill();
        s.x += s.vx;
        s.y += s.vy;
        if (s.y > canvas.height + 2) {
          s.y = -2;
          s.x = Math.random() * canvas.width;
        }
        if (s.x < -2) s.x = canvas.width + 2;
        if (s.x > canvas.width + 2) s.x = -2;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

/* ─── Nav ───────────────────────────────────────────────── */

function Nav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(9,9,11,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.05)"
          : "1px solid transparent",
      }}
    >
      <div className="max-w-[900px] mx-auto px-6 h-[60px] flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium text-white/70 hover:text-white tracking-wide transition-colors duration-200"
        >
          Damian Villarreal
        </Link>
        <div className="hidden sm:flex items-center gap-7">
          {[
            { label: "Expertise", href: "#expertise" },
            { label: "Projects", href: "#projects" },
            { label: "Talks", href: "#talks" },
            { label: "Research", href: "#research" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[13px] text-neutral-500 hover:text-neutral-300 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#connect"
            className="text-[13px] text-neutral-300 border border-white/10 rounded-md px-3.5 py-1.5 hover:border-white/20 hover:text-white transition-all duration-200"
          >
            Connect
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ─── Section label ─────────────────────────────────────── */

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[11px] font-medium text-neutral-600 uppercase tracking-[0.18em] mb-3">
      {label}
    </p>
  );
}

/* ─── Chip ──────────────────────────────────────────────── */

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] text-neutral-600 bg-white/[0.04] border border-white/[0.06] rounded px-2 py-0.5">
      {children}
    </span>
  );
}

/* ─── Hero ──────────────────────────────────────────────── */

function Hero({ scrollY }: { scrollY: number }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* background glow — the only place cosmic color lives */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full pointer-events-none"
        style={{
          height: "75vh",
          background:
            "radial-gradient(ellipse 75% 65% at 50% -2%, rgba(59,130,246,0.14) 0%, rgba(109,40,217,0.07) 48%, transparent 100%)",
        }}
      />

      <div
        className="relative z-10 max-w-[900px] mx-auto px-6 text-center"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        {/* availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 text-[12px] text-neutral-500 border border-white/[0.08] rounded-full px-3.5 py-1.5 mb-11"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/75 shrink-0" />
          Open to new roles
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-[4.25rem] font-semibold tracking-[-0.02em] text-white mb-5 leading-[1.06]"
        >
          Damian Villarreal
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="text-[17px] text-neutral-400 mb-5 font-light tracking-[-0.01em]"
        >
          Security Operations&nbsp;&nbsp;→&nbsp;&nbsp;Cloud &amp; AI Security Architecture
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="text-[15px] text-neutral-500 max-w-[540px] mx-auto leading-[1.75] mb-12"
        >
          RSOC analyst lead and CS graduate researcher. I run detection &amp;
          response across 20,000+ endpoints and build at the intersection of
          cloud infrastructure, AI systems, and security architecture — including{" "}
          <span className="text-neutral-300">ThreatScaper</span>, an AI-powered
          threat-intelligence enrichment tool.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 text-[13px] text-white bg-white/[0.07] hover:bg-white/[0.11] border border-white/[0.1] hover:border-white/[0.2] rounded-md px-5 py-2.5 transition-all duration-200"
          >
            View Projects <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="#connect"
            className="inline-flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-neutral-300 transition-colors duration-200 px-2 py-2.5"
          >
            Get in touch
          </a>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.7 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <ChevronDown
          className="w-4 h-4 text-neutral-700"
          style={{ animation: "bounce 3s ease-in-out infinite" }}
        />
      </motion.div>
    </section>
  );
}

/* ─── Expertise ─────────────────────────────────────────── */

function Expertise() {
  const areas = [
    {
      Icon: Shield,
      label: "Security Operations",
      desc: "Detection & response, threat hunting, and malware analysis across a 20,000+ endpoint environment. Leading student analysts at a regional SOC.",
      tags: ["Detection & Response", "Threat Hunting", "SIEM", "Malware Analysis", "Incident Response"],
    },
    {
      Icon: Cloud,
      label: "Cloud Architecture",
      desc: "Multi-cloud security and infrastructure-as-code across AWS, Azure, and GCP — Wazuh monitoring, zero-trust design, and secure connectivity at scale.",
      tags: ["AWS", "Azure", "GCP", "Terraform", "Zero Trust", "Wazuh"],
    },
    {
      Icon: Cpu,
      label: "Applied AI",
      desc: "Domain-adaptive LLM pre-training and agentic tooling for security operations — from NeMo pipelines to ML anomaly detection in production defenses.",
      tags: ["LLMs", "DAPT / NeMo", "Agentic Tooling", "Anomaly Detection"],
    },
  ];

  return (
    <section id="expertise" className="py-28 relative z-10">
      <div className="max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14"
        >
          <SectionLabel label="Focus Areas" />
          <h2 className="text-2xl font-medium text-white tracking-[-0.02em]">
            Where I operate
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {areas.map(({ Icon, label, desc, tags }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-60px" }}
              className="group p-6 rounded-lg border border-white/[0.06] bg-[#111113] hover:border-white/[0.11] transition-all duration-300"
            >
              <Icon className="w-[18px] h-[18px] text-neutral-500 mb-5 group-hover:text-neutral-400 transition-colors duration-200" />
              <h3 className="text-[13px] font-medium text-white mb-2.5">{label}</h3>
              <p className="text-[13px] text-neutral-500 leading-[1.7] mb-5">{desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Projects ──────────────────────────────────────────── */

function Projects() {
  const projects = [
    {
      name: "ThreatScaper",
      status: "Flagship",
      desc: "AI-powered threat-intelligence enrichment tool for security and business operations — automated IOC enrichment and machine-speed triage.",
      tags: ["AI", "Threat Intel", "Security Ops"],
      year: "2026",
      href: THREATSCAPER,
    },
    {
      name: "Zero-Trust IoT Security Framework",
      status: "Open Source",
      desc: "Blockchain-backed IoT architecture with post-quantum crypto and ML anomaly detection, sustaining ~397 TPS.",
      tags: ["Blockchain", "PQ Crypto", "ML", "IoT"],
      year: "2025",
      href: "https://github.com/dsuyu1/seniorproject2025",
    },
    {
      name: "SOAR-EDR Automation Pipeline",
      status: "Open Source",
      desc: "Tines + LimaCharlie pipeline for LLM-augmented, machine-speed triage and enrichment across the detection lifecycle.",
      tags: ["Tines", "LimaCharlie", "SOAR", "LLM"],
      year: "2025",
      href: "https://github.com/dsuyu1/SOAR-EDR-Project",
    },
    {
      name: "ChipNeMo DAPT Pipeline",
      status: "Research",
      desc: "Reproduced NVIDIA's domain-adaptive pre-training pipeline for Llama 2 7B — data curation, custom tokenization, DAPT, and SFT with NeMo.",
      tags: ["NeMo", "Llama 2", "DAPT", "Python"],
      year: "2026",
      href: "/n/4",
    },
    {
      name: "AWS Cloud Security Monitoring",
      status: "Open Source",
      desc: "Terraform-provisioned Wazuh agents on EC2 with Tailscale for secure home-manager connectivity.",
      tags: ["AWS", "Terraform", "Wazuh", "Tailscale"],
      year: "2025",
      href: "https://github.com/dsuyu1/wazuh-tf",
    },
  ];

  return (
    <section id="projects" className="py-28 relative z-10">
      <div className="max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14"
        >
          <SectionLabel label="Work" />
          <h2 className="text-2xl font-medium text-white tracking-[-0.02em]">
            Selected projects
          </h2>
        </motion.div>

        <div className="space-y-3">
          {projects.map((p, i) => {
            const external = p.href.startsWith("http");
            return (
              <motion.a
                key={p.name}
                href={p.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-60px" }}
                className="group flex gap-5 p-6 rounded-lg border border-white/[0.06] bg-[#111113] hover:border-white/[0.11] transition-all duration-300 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2">
                    <h3 className="text-[13px] font-medium text-white">{p.name}</h3>
                    <Chip>{p.status}</Chip>
                  </div>
                  <p className="text-[13px] text-neutral-500 leading-[1.7] mb-4">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <Chip key={tag}>{tag}</Chip>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between shrink-0 pt-0.5">
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-700 group-hover:text-neutral-500 transition-colors duration-200" />
                  <span className="text-[11px] text-neutral-700">{p.year}</span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Presentations ─────────────────────────────────────── */

function Presentations() {
  const talks: {
    title: string;
    event: string;
    date: string;
    type: string;
    desc?: string;
  }[] = [
    {
      title: "Smarter SecOps: Leveraging Private, Federated Transfer Learning",
      event: "BSides RGV 2026",
      date: "2026",
      type: "SecOps",
    },
    {
      title:
        "Federated Domain-Adaptive Pre-Training for Privacy-Preserving Security Language Models in Multi-Tenant Environments",
      event: "UTRGV STEM Conference",
      date: "April 2026",
      type: "AI Security",
    },
    {
      // TODO: confirm the exact talk title with Damian (phrasing is a placeholder).
      title: "Hands-On with the Empire C2 Framework",
      event: "6th Annual BSides RGV",
      date: "2025",
      type: "Red Team",
    },
    {
      title: "Zero-Trust at the Edge: Privacy-First Security for IoT Surveillance",
      event: "Region One ESC Cybersecurity Summit",
      date: "Edinburg, TX · Oct 30, 2025",
      type: "Zero Trust",
    },
  ];

  return (
    <section id="talks" className="py-28 relative z-10">
      <div className="max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14"
        >
          <SectionLabel label="Speaking" />
          <h2 className="text-2xl font-medium text-white tracking-[-0.02em]">
            Presentations &amp; talks
          </h2>
        </motion.div>

        <div>
          {talks.map((talk, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-60px" }}
              className="group grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 sm:gap-8 py-6 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.018] rounded-sm -mx-3 px-3 transition-colors duration-200"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Chip>{talk.type}</Chip>
                </div>
                <h3 className="text-[13px] font-medium text-white mb-1.5">{talk.title}</h3>
                {talk.desc && (
                  <p className="text-[13px] text-neutral-500 leading-[1.7]">{talk.desc}</p>
                )}
              </div>
              <div className="text-left sm:text-right shrink-0">
                <p className="text-[13px] text-neutral-400">{talk.event}</p>
                <p className="text-[11px] text-neutral-600 mt-0.5">{talk.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Research ──────────────────────────────────────────── */

function Research() {
  const items = [
    {
      title:
        "FeDAPT: Federated Domain-Adaptive Pre-Training for Privacy-Preserving Security Language Models in Multi-Tenant Environments",
      area: "AI Security",
      status: "Active",
      summary:
        "Training security-domain language models across multiple tenants without sharing raw data — combining federated learning with domain-adaptive pre-training to preserve privacy in multi-tenant SOC environments.",
    },
    {
      title:
        "AI as Co-Presenter: Designing for Real-Time Human-AI Collaborative Presentation Delivery",
      area: "HCI",
      status: "Designing",
      summary:
        "Does an AI co-presenter reduce presenter anxiety and cognitive load while maintaining audience engagement and perceived authenticity? Measured via NASA-TLX, self-report, and audience perception. Targeting CHI / CSCW.",
    },
  ];

  return (
    <section id="research" className="py-28 relative z-10">
      <div className="max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14"
        >
          <SectionLabel label="Research" />
          <h2 className="text-2xl font-medium text-white tracking-[-0.02em]">
            Current work
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-60px" }}
              className="group p-6 rounded-lg border border-white/[0.06] bg-[#111113] hover:border-white/[0.11] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <Chip>{item.area}</Chip>
                <span className="flex items-center gap-1.5 text-[11px] text-neutral-600">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      item.status === "Active" ? "bg-emerald-500/55" : "bg-amber-500/55"
                    }`}
                  />
                  {item.status}
                </span>
              </div>
              <h3 className="text-[13px] font-medium text-white leading-snug mb-3">
                {item.title}
              </h3>
              <p className="text-[13px] text-neutral-500 leading-[1.7]">{item.summary}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Connect ───────────────────────────────────────────── */

function Connect() {
  return (
    <section id="connect" className="py-28 relative z-10">
      <div className="max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="relative overflow-hidden rounded-lg border border-white/[0.06] bg-[#111113] p-12 text-center"
        >
          {/* subtle glow inside card */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 65% 90% at 50% 115%, rgba(59,130,246,0.06) 0%, transparent 65%)",
            }}
          />
          <div className="relative z-10">
            <SectionLabel label="Contact" />
            <h2 className="text-2xl font-medium text-white tracking-[-0.02em] mb-4">
              Let&apos;s build something together
            </h2>
            <p className="text-[14px] text-neutral-500 max-w-[420px] mx-auto leading-[1.75] mb-10">
              Open to cloud, AI, and security-architecture roles. Reach out — or
              read the full story on my{" "}
              <Link href="/about" className="text-neutral-300 hover:text-white underline underline-offset-2 transition-colors">
                résumé
              </Link>
              .
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 text-[13px] text-neutral-300 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.16] rounded-md px-5 py-2.5 transition-all duration-200"
              >
                <Mail className="w-3.5 h-3.5" />
                Email me
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] text-neutral-600 hover:text-neutral-300 transition-colors duration-200"
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
              <a
                href={GITHUB}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] text-neutral-600 hover:text-neutral-300 transition-colors duration-200"
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.05] py-8">
      <div className="max-w-[900px] mx-auto px-6 flex items-center justify-between">
        <span className="text-[12px] text-neutral-700">© 2026 Damian Villarreal</span>
        <span className="text-[12px] text-neutral-700">Security · Cloud · AI</span>
      </div>
    </footer>
  );
}

/* ─── Landing ───────────────────────────────────────────── */

export default function PortfolioLanding() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
      <Starfield />
      <Nav scrolled={scrollY > 40} />
      <Hero scrollY={scrollY} />
      <Expertise />
      <Projects />
      <Presentations />
      <Research />
      <Connect />
      <Footer />
    </div>
  );
}
