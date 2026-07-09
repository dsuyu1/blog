import type { Metadata } from 'next';
import Link from 'next/link';
import { posts } from '../posts';
import { Reveal } from '../components/reveal';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Write-ups on security operations, reverse engineering, and AI training pipelines.',
};

export default function BlogIndex() {
  return (
    <div className="space-y-6 pb-10">
      <Reveal>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-[-0.02em] mb-2">
          Blog
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Reverse engineering, LLM training pipelines, and security experiments.
        </p>
      </Reveal>

      <div className="space-y-3">
        {posts.map((post, i) => (
          <Reveal key={post.href} delay={i * 60}>
            <Link
              href={post.href}
              className="glass-card block p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] hover:border-black/[0.16] dark:hover:border-white/[0.2] transition-colors duration-200"
            >
              <div className="flex items-baseline justify-between gap-4 mb-1.5">
                <h2 className="text-[15px] font-medium text-gray-900 dark:text-gray-100">
                  {post.title}
                </h2>
                <span className="shrink-0 text-[12px] text-gray-400 dark:text-gray-500">
                  {post.date}
                </span>
              </div>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                {post.preview}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
