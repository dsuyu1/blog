export type Post = {
  title: string;
  href: string;
  preview: string;
  date: string;
};

export const posts: Post[] = [
  {
    title: 'Automating SOC Visibility on External Monitors',
    href: '/n/8',
    preview: 'Part 1/2: Scheduled power-on, Sysinternals autologon, SSO, and Playwright.',
    date: 'June 2, 2026',
  },
  {
    title: 'Momoyo and the Network',
    href: '/n/6',
    preview: 'A graph problem combining tree structure, path finding, and optimization.',
    date: 'May 31, 2026',
  },
  {
    title: 'Domain-Adaptive Pre-Training: Tailoring LLMs for Specialized Applications',
    href: '/n/4',
    preview: "Notes and code from NVIDIA's DAPT workshop: data curation, custom tokenization, DAPT, and SFT with NeMo and Llama 2.",
    date: 'Mar 28, 2026',
  },
  {
    title: 'Akira Ransomware Binary Analysis',
    href: '/n/5',
    preview: "Tracing Akira's execution flow from entry point to encryption engine using Ghidra.",
    date: 'Jan 19, 2026',
  },
];
