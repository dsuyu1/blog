import type { Metadata } from 'next';
import Bio from './bio.mdx';

export const metadata: Metadata = {
  title: 'About',
};

function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function KaggleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.334" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const experience = [
  {
    title: 'RSOC Student Analyst Lead',
    org: 'UTRGV Regional Security Operations Center',
    period: 'Sep 2024 – Present',
    summary: 'Detection & response, threat hunting, and leading student analysts managing 20,000+ endpoints.',
  },
  {
    title: 'Founder & Executive Director',
    org: 'Vaquero Information Security Initiative',
    period: 'Jan 2026 – Present',
    summary: 'Founded UTRGV\'s cybersecurity nonprofit and student SOC lab; 100+ members.',
  },
  {
    title: 'Student Research Intern',
    org: 'UTRGV',
    period: 'Jun 2023 – Aug 2023',
    summary: 'AI/ML research under a published professor; completed a paper on machine learning systems.',
  },
  {
    title: 'Student Academic Tutor',
    org: 'UTRGV',
    period: 'Sep 2023 – Dec 2023',
    summary: 'In-person instruction for 100+ Calculus I students.',
  },
];

const projects = [
  {
    name: 'Zero-Trust IoT Security Framework',
    href: 'https://github.com/dsuyu1/seniorproject2025',
    summary: 'Blockchain-backed IoT architecture with post-quantum crypto and ML anomaly detection (~397 TPS).',
  },
  {
    name: 'SOAR-EDR Automation Pipeline',
    href: 'https://github.com/dsuyu1/SOAR-EDR-Project',
    summary: 'Tines + LimaCharlie pipeline for LLM-augmented machine-speed triage and enrichment.',
  },
  {
    name: 'ChipNeMo DAPT Pipeline',
    href: 'https://github.com/dsuyu1',
    summary: "Reproduced NVIDIA's domain-adaptive pre-training pipeline for Llama 2 7B.",
  },
  {
    name: 'AWS Cloud Security Monitoring',
    href: 'https://github.com/dsuyu1/wazuh-tf',
    summary: 'Terraform-provisioned Wazuh agents on EC2 with Tailscale for secure home-manager connectivity.',
  },
  {
    name: 'CivicWatch',
    href: 'https://github.com/dsuyu1/civicwatch',
    summary: '1st place hackathon project for the Social Good and ML/AI track.',
  },
];

const skills = [
  { label: 'Languages', value: 'Python, PowerShell, Bash' },
  { label: 'Security', value: 'Splunk, SentinelOne, Microsoft Defender, Wazuh, TheHive/Cortex, LimaCharlie, Tines, Ghidra' },
  { label: 'Cloud & Infra', value: 'AWS, Azure, GCP, Docker, Kubernetes, Terraform, Cloudflare, Tailscale, Hyperledger' },
];

const certs = ['CompTIA Security+ ce', 'CompTIA Network+ ce', 'CompTIA CySA+ ce', 'CompTIA SecAI+ ce'];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function About() {
  return (
    <div className="space-y-12">
      {/* Profile */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <img
            src="/avatar.jpeg"
            alt="Damian Villarreal"
            className="w-32 h-32 rounded-full object-cover shrink-0"
          />
          <div>
            <h1 className="text-xl font-semibold">Damian Villarreal</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            MSCS @ UTRGV
          </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          I like cybersecurity, AI research, and building useful things.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/dsuyu1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <GithubIcon />
            github.com/dsuyu1
          </a>
          <a
            href="https://linkedin.com/in/dsuyu"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <LinkedinIcon />
            linkedin.com/in/dsuyu
          </a>
          <a
            href="https://www.kaggle.com/dsuyu1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <KaggleIcon />
            kaggle.com/dsuyu1
          </a>
        </div>
      </div>

      {/* Bio */}
      <Section title="Bio">
        <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
          <Bio />
        </div>
      </Section>

      {/* Experience */}
      <Section title="Experience">
        <div className="space-y-4">
          {experience.map((job) => (
            <div key={job.title} className="space-y-0.5">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-sm font-medium">{job.title}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{job.period}</p>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">{job.org}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{job.summary}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Projects */}
      <Section title="Projects">
        <div className="space-y-4">
          {projects.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block group space-y-0.5"
            >
              <p className="text-sm font-medium group-hover:text-blue-500 transition-colors">{p.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{p.summary}</p>
            </a>
          ))}
        </div>
      </Section>

      {/* Certifications */}
      <Section title="Certifications">
        <div className="flex flex-wrap gap-2">
          {certs.map((c) => (
            <span
              key={c}
              className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300"
            >
              {c}
            </span>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section title="Skills">
        <div className="space-y-2">
          {skills.map((s) => (
            <div key={s.label} className="flex gap-3 text-sm">
              <span className="text-gray-400 dark:text-gray-500 shrink-0 w-20">{s.label}</span>
              <span className="text-gray-600 dark:text-gray-300">{s.value}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
