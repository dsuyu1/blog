"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wallpaper } from "../desktop/starfield";
import {
  Shield,
  Cloud,
  Cpu,
  Mail,
  ExternalLink,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Network,
} from "lucide-react";
// Brand marks: lucide 1.x dropped Github/Linkedin (trademark), so keep the
// hand-rolled filled versions.
import { Github, Linkedin } from "./icons";

/* Big Sur-style pastel icon tile (from the bigsur-icons reference in the
   user's UI/UX inspo folder): soft gradient superellipse, puffy white glyph. */
function PastelTile({
  from,
  to,
  className = "",
  children,
}: {
  from: string;
  to: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.55),inset_0_-2px_4px_rgba(0,0,0,0.08),0_5px_12px_rgba(0,0,0,0.16)] ${className}`}
      style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}
    >
      {children}
    </span>
  );
}

/* ─── Contact / identity ────────────────────────────────── */

const EMAIL = "damian.villarreal01@utrgv.edu";
const LINKEDIN = "https://linkedin.com/in/dsuyu";
const GITHUB = "https://github.com/dsuyu1";
const THREATSCAPER = "https://security.damianvillarreal.com";




/* ─── Nav ───────────────────────────────────────────────── */

function Nav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? "bg-white/70 dark:bg-[#09090b]/85 backdrop-blur-xl border-black/[0.06] dark:border-white/[0.05]"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-[1120px] mx-auto px-6 h-[60px] flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white tracking-wide transition-colors duration-200"
        >
          Damian Villarreal
        </Link>
        <div className="hidden sm:flex items-center gap-7">
          {[
            { label: "Expertise", href: "#expertise" },
            { label: "Projects", href: "#projects" },
            { label: "Talks", href: "#talks" },
            { label: "Research", href: "#research" },
            { label: "Skills", href: "#skills" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[13px] text-black/55 dark:text-neutral-500 hover:text-black dark:hover:text-neutral-200 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#connect"
            className="apple-gloss-btn-secondary py-1.5 px-3.5 text-[13px]"
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
    <p className="text-[11px] font-medium text-black/45 dark:text-neutral-500 uppercase tracking-[0.18em] mb-3">
      {label}
    </p>
  );
}

/* ─── Chip ──────────────────────────────────────────────── */

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] text-black/50 dark:text-neutral-400 bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.07] dark:border-white/[0.08] rounded-full px-2.5 py-0.5">
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
        className="relative z-10 max-w-[1120px] mx-auto px-6 text-center"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        {/* availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 text-[12px] text-black/55 dark:text-neutral-500 border border-black/[0.1] dark:border-white/[0.08] rounded-full px-3.5 py-1.5 mb-11"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/75 shrink-0" />
          Open to new roles
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-[4.25rem] font-semibold tracking-[-0.02em] mb-5 leading-[1.06] text-transparent bg-clip-text bg-gradient-to-b from-[#1d1d1f] via-[#1d1d1f] to-[#1d1d1f]/60 dark:from-white dark:via-white dark:to-white/55"
        >
          Damian Villarreal
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="text-[17px] text-black/60 dark:text-neutral-400 mb-5 font-light tracking-[-0.01em]"
        >
          Security Operations&nbsp;&nbsp;,&nbsp;&nbsp;Cloud &amp; AI Security Architecture
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="text-[15px] text-black/55 dark:text-neutral-500 max-w-[540px] mx-auto leading-[1.75] mb-12"
        >
          RSOC analyst lead and CS graduate researcher. I run detection &amp;
          response across 20,000+ endpoints and build at the intersection of
          cloud infrastructure, AI systems, and security architecture — including{" "}
          <span className="text-black/80 dark:text-neutral-300">ThreatScaper</span>, an AI-powered
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
            className="apple-gloss-btn gap-2"
          >
            View Projects <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="#connect"
            className="apple-gloss-btn-secondary"
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
          className="w-4 h-4 text-black/30 dark:text-neutral-600"
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
      from: "#F2808A",
      to: "#E05263",
      label: "Security Operations",
      desc: "Detection & response, threat hunting, and malware analysis across a 20,000+ endpoint environment. Leading student analysts at a regional SOC.",
      tags: ["Detection & Response", "Threat Hunting", "SIEM", "Malware Analysis", "Incident Response"],
    },
    {
      Icon: Cloud,
      from: "#A9CBFF",
      to: "#6FA0F6",
      label: "Cloud Architecture",
      desc: "Multi-cloud security and infrastructure-as-code across AWS, Azure, and GCP — Wazuh monitoring, zero-trust design, and secure connectivity at scale.",
      tags: ["AWS", "Azure", "GCP", "Terraform", "Zero Trust", "Wazuh"],
    },
    {
      Icon: Cpu,
      from: "#DDBDF8",
      to: "#B383EC",
      label: "Applied AI",
      desc: "Domain-adaptive LLM pre-training and agentic tooling for security operations — from NeMo pipelines to ML anomaly detection in production defenses.",
      tags: ["LLMs", "DAPT / NeMo", "Agentic Tooling", "Anomaly Detection"],
    },
  ];

  return (
    <section id="expertise" className="py-28 relative z-10">
      <div className="max-w-[1120px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14"
        >
          <SectionLabel label="Focus Areas" />
          <h2 className="text-2xl font-semibold text-black/85 dark:text-white tracking-[-0.02em]">
            Where I operate
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {areas.map(({ Icon, from, to, label, desc, tags }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-60px" }}
              className="group p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white/65 dark:bg-white/[0.055] backdrop-blur-xl hover:border-black/[0.16] dark:hover:border-white/[0.2] hover:bg-white/80 dark:hover:bg-white/[0.075] transition-all duration-300"
            >
              <PastelTile from={from} to={to} className="w-12 h-12 rounded-[15px] mb-5">
                <Icon className="w-6 h-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.22)]" />
              </PastelTile>
              <h3 className="text-[13px] font-medium text-black/85 dark:text-white mb-2.5">{label}</h3>
              <p className="text-[13px] text-black/55 dark:text-neutral-500 leading-[1.7] mb-5">{desc}</p>
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
      Icon: Shield,
      from: "#F2808A",
      to: "#E05263",
      status: "Flagship",
      desc: "AI-powered threat-intelligence enrichment tool for security and business operations — automated IOC enrichment and machine-speed triage.",
      tags: ["AI", "Threat Intel", "Security Ops"],
      year: "2026",
      href: THREATSCAPER,
    },
    {
      name: "Zero-Trust IoT Security Framework",
      Icon: Cpu,
      from: "#93E0AC",
      to: "#4EBE79",
      status: "Open Source",
      desc: "Blockchain-backed IoT architecture with post-quantum crypto and ML anomaly detection, sustaining ~397 TPS.",
      tags: ["Blockchain", "PQ Crypto", "ML", "IoT"],
      year: "2025",
      href: "https://github.com/dsuyu1/seniorproject2025",
    },
    {
      name: "SOAR-EDR Automation Pipeline",
      Icon: Network,
      from: "#FFB86B",
      to: "#F78E3D",
      status: "Open Source",
      desc: "Tines + LimaCharlie pipeline for LLM-augmented, machine-speed triage and enrichment across the detection lifecycle.",
      tags: ["Tines", "LimaCharlie", "SOAR", "LLM"],
      year: "2025",
      href: "https://github.com/dsuyu1/SOAR-EDR-Project",
    },
    {
      name: "ChipNeMo DAPT Pipeline",
      Icon: Sparkles,
      from: "#DDBDF8",
      to: "#B383EC",
      status: "Research",
      desc: "Reproduced NVIDIA's domain-adaptive pre-training pipeline for Llama 2 7B — data curation, custom tokenization, DAPT, and SFT with NeMo.",
      tags: ["NeMo", "Llama 2", "DAPT", "Python"],
      year: "2026",
      href: "/n/4",
    },
    {
      name: "AWS Cloud Security Monitoring",
      Icon: Cloud,
      from: "#A9CBFF",
      to: "#6FA0F6",
      status: "Open Source",
      desc: "Terraform-provisioned Wazuh agents on EC2 with Tailscale for secure home-manager connectivity.",
      tags: ["AWS", "Terraform", "Wazuh", "Tailscale"],
      year: "2025",
      href: "https://github.com/dsuyu1/wazuh-tf",
    },
  ];

  return (
    <section id="projects" className="py-28 relative z-10">
      <div className="max-w-[1120px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14"
        >
          <SectionLabel label="Work" />
          <h2 className="text-2xl font-semibold text-black/85 dark:text-white tracking-[-0.02em]">
            Selected projects
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projects.map((p, i) => {
            const external = p.href.startsWith("http");
            const flagship = p.status === "Flagship";
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
                className={`group flex gap-5 p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white/65 dark:bg-white/[0.055] backdrop-blur-xl hover:border-black/[0.16] dark:hover:border-white/[0.2] hover:bg-white/80 dark:hover:bg-white/[0.075] transition-all duration-300 cursor-pointer ${flagship ? "md:col-span-2" : ""}`}
              >
                <PastelTile from={p.from} to={p.to} className="w-11 h-11 rounded-[14px] shrink-0">
                  <p.Icon className="w-[22px] h-[22px] drop-shadow-[0_2px_2px_rgba(0,0,0,0.22)]" />
                </PastelTile>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2">
                    <h3 className="text-[13px] font-medium text-black/85 dark:text-white">{p.name}</h3>
                    <Chip>{p.status}</Chip>
                  </div>
                  <p className="text-[13px] text-black/55 dark:text-neutral-500 leading-[1.7] mb-4">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <Chip key={tag}>{tag}</Chip>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between shrink-0 pt-0.5">
                  <ExternalLink className="w-3.5 h-3.5 text-black/30 dark:text-neutral-600 group-hover:text-black/55 dark:group-hover:text-black/60 dark:text-neutral-400 transition-colors duration-200" />
                  <span className="text-[11px] text-black/30 dark:text-neutral-600">{p.year}</span>
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
      title: "Empire C2",
      event: "6th Annual BSides RGV",
      date: "May 31, 2025",
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
      <div className="max-w-[1120px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14"
        >
          <SectionLabel label="Speaking" />
          <h2 className="text-2xl font-semibold text-black/85 dark:text-white tracking-[-0.02em]">
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
              className="group grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 sm:gap-8 py-6 border-b border-black/[0.06] dark:border-white/[0.05] last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.018] rounded-sm -mx-3 px-3 transition-colors duration-200"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Chip>{talk.type}</Chip>
                </div>
                <h3 className="text-[13px] font-medium text-black/85 dark:text-white mb-1.5">{talk.title}</h3>
                {talk.desc && (
                  <p className="text-[13px] text-black/55 dark:text-neutral-500 leading-[1.7]">{talk.desc}</p>
                )}
              </div>
              <div className="text-left sm:text-right shrink-0">
                <p className="text-[13px] text-black/60 dark:text-neutral-400">{talk.event}</p>
                <p className="text-[11px] text-black/45 dark:text-neutral-500 mt-0.5">{talk.date}</p>
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
      <div className="max-w-[1120px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14"
        >
          <SectionLabel label="Research" />
          <h2 className="text-2xl font-semibold text-black/85 dark:text-white tracking-[-0.02em]">
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
              className="group p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white/65 dark:bg-white/[0.055] backdrop-blur-xl hover:border-black/[0.16] dark:hover:border-white/[0.2] hover:bg-white/80 dark:hover:bg-white/[0.075] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <Chip>{item.area}</Chip>
                <span className="flex items-center gap-1.5 text-[11px] text-black/45 dark:text-neutral-500">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      item.status === "Active" ? "bg-emerald-500/55" : "bg-amber-500/55"
                    }`}
                  />
                  {item.status}
                </span>
              </div>
              <h3 className="text-[13px] font-medium text-black/85 dark:text-white leading-snug mb-3">
                {item.title}
              </h3>
              <p className="text-[13px] text-black/55 dark:text-neutral-500 leading-[1.7]">{item.summary}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Skills ────────────────────────────────────────────── */

function Skills() {
  const groups = [
    {
      label: "Languages",
      Icon: Cpu,
      from: "#A9CBFF",
      to: "#6FA0F6",
      items: ["Python", "PowerShell", "Bash"],
    },
    {
      label: "Security",
      Icon: Shield,
      from: "#F2808A",
      to: "#E05263",
      items: [
        "Splunk",
        "SentinelOne",
        "Microsoft Defender",
        "Wazuh",
        "TheHive / Cortex",
        "LimaCharlie",
        "Tines",
        "Ghidra",
      ],
    },
    {
      label: "Cloud & Infrastructure",
      Icon: Cloud,
      from: "#93E0AC",
      to: "#4EBE79",
      items: [
        "AWS",
        "Azure",
        "GCP",
        "Docker",
        "Kubernetes",
        "Terraform",
        "Cloudflare",
        "Tailscale",
        "Hyperledger",
      ],
    },
    {
      label: "AI / ML",
      Icon: Sparkles,
      from: "#DDBDF8",
      to: "#B383EC",
      items: ["NeMo", "Llama 2", "PyTorch", "Hugging Face", "Ollama", "LangChain"],
    },
  ];

  return (
    <section id="skills" className="py-28 relative z-10">
      <div className="max-w-[1120px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14"
        >
          <SectionLabel label="Toolbox" />
          <h2 className="text-2xl font-semibold text-black/85 dark:text-white tracking-[-0.02em]">
            Skills &amp; tools
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((g, i) => (
            <motion.div
              key={g.label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-60px" }}
              className="p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white/65 dark:bg-white/[0.055] backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <PastelTile from={g.from} to={g.to} className="w-9 h-9 rounded-[11px]">
                  <g.Icon className="w-5 h-5 drop-shadow-[0_2px_2px_rgba(0,0,0,0.22)]" strokeWidth={2} />
                </PastelTile>
                <h3 className="text-sm font-semibold text-black/85 dark:text-white">{g.label}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
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
      <div className="max-w-[1120px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="relative overflow-hidden rounded-3xl border border-black/[0.08] dark:border-white/[0.1] bg-white/65 dark:bg-white/[0.055] backdrop-blur-xl p-12 text-center"
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
            <h2 className="text-2xl font-semibold text-black/85 dark:text-white tracking-[-0.02em] mb-4">
              Let&apos;s build something together
            </h2>
            <p className="text-[14px] text-black/55 dark:text-neutral-500 max-w-[420px] mx-auto leading-[1.75] mb-10">
              Open to cloud, AI, and security-architecture roles. Reach out — or
              read the full story on my{" "}
              <Link href="/about" className="text-black/80 dark:text-neutral-300 hover:text-black dark:hover:text-white underline underline-offset-2 transition-colors">
                résumé
              </Link>
              .
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${EMAIL}`}
                className="apple-gloss-btn gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                Email me
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer"
                className="apple-gloss-btn-secondary gap-1.5"
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
              <a
                href={GITHUB}
                target="_blank"
                rel="noreferrer"
                className="apple-gloss-btn-secondary gap-1.5"
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
    <footer className="relative z-10 border-t border-black/[0.06] dark:border-white/[0.05] py-8">
      <div className="max-w-[1120px] mx-auto px-6 flex items-center justify-between">
        <span className="text-[12px] text-black/30 dark:text-neutral-600">© 2026 Damian Villarreal</span>
        <span className="text-[12px] text-black/30 dark:text-neutral-600">Security · Cloud · AI</span>
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
    <div className="min-h-screen text-black/85 dark:text-white overflow-x-hidden">
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
      {/* Big Sur wallpaper behind a frosted scrim — the landing reads like a
          giant glass sheet over the desktop. */}
      <div className="fixed inset-0 z-0">
        <Wallpaper />
        <div className="absolute inset-0 bg-white/60 dark:bg-[#0b0b0d]/62 backdrop-blur-3xl" />
      </div>
      <Nav scrolled={scrollY > 40} />
      <Hero scrollY={scrollY} />
      <Expertise />
      <Projects />
      <Presentations />
      <Research />
      <Skills />
      <Connect />
      <Footer />
    </div>
  );
}
