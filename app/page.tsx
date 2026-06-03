'use client';

import Link from 'next/link';
import { useState } from 'react';

type Tag = 'codeforces' | 'aws' | 'microsoft' | 'nvidia';

type Post = {
  title: string;
  href: string;
  preview: string;
  date: string;
  tag?: Tag;
};

const posts: Post[] = [
  {
    title: 'Domain-Adaptive Pre-Training: Tailoring LLMs for Specialized Applications',
    href: '/n/4',
    preview: "Notes and code from NVIDIA's DAPT workshop: data curation, custom tokenization, DAPT, and SFT with NeMo and Llama 2.",
    date: 'Mar 28, 2026',
    tag: 'nvidia',
  },
  {
    title: 'Akira Ransomware Binary Analysis',
    href: '/n/5',
    preview: "Tracing Akira's execution flow from entry point to encryption engine using Ghidra.",
    date: 'Jan 19, 2026',
  },
  {
    title: 'Momoyo and the Network',
    href: '/n/6',
    preview: 'A graph problem combining tree structure, path finding, and optimization.',
    date: 'May 31, 2026',
    tag: 'codeforces',
  },
  {
    title: 'Automating SOC Visibility on External Monitors',
    href: '/n/8',
    preview: 'Part 1/2: Scheduled power-on, Sysinternals autologon, SSO, and Playwright.',
    date: 'June 2, 2026',
  },
  // {
  //   title: 'Voice-enabled Local AI Agent Assistant for SecOps',
  //   href: '/n/9',
  //   preview: 'Part 2/2: Whisper, Porcupine, Ollama, Kokoro, and agentic tool-calling loops.',
  //   date: 'June 3, 2026',
  // },
  // {
  //   title: 'AWS DevOps Agent Workshop for Incident Investigation',
  //   href: '/n/7',
  //   preview: 'Learning how to use the AWS DevOps Agent for incident investigation.',
  //   date: 'June 1, 2026',
  //   tag: 'aws',
  // },
];


export default function Home() {
  const [activeTag, setActiveTag] = useState<Tag | undefined>(undefined);

  const visible = posts
    .filter((p) => (activeTag ? p.tag === activeTag : true))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8">
      {visible.map((post) => (
        <div key={post.href} className="space-y-1">
          <Link href={post.href} className="block group space-y-1">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm font-medium group-hover:text-blue-500 transition-colors">
                {post.title}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{post.date}</p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {post.preview}
            </p>
          </Link>
          {post.tag && (
            <button
              onClick={() => setActiveTag(activeTag === post.tag ? undefined : post.tag)}
              className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full border border-gray-300 dark:border-zinc-600 text-gray-500 dark:text-zinc-400 transition-all hover:border-gray-500 hover:text-gray-800 dark:hover:border-zinc-400 dark:hover:text-zinc-200 ${activeTag && activeTag !== post.tag ? 'opacity-30' : 'opacity-100'}`}
            >
              {post.tag}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
