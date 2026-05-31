import Link from 'next/link';

const posts = [
  {
    title: 'Domain-Adaptive Pre-Training: Tailoring LLMs for Specialized Applications',
    href: '/n/4',
    preview: 'Notes and code from NVIDIA\'s DAPT workshop where I cover data curation, custom tokenization, DAPT, and SFT with NeMo and Llama 2.',
    date: 'Mar 28, 2026',
  },
  {
    title: 'Akira Ransomware Binary Analysis',
    href: '/n/5',
    preview: 'Tracing Akira\'s execution flow from entry point to encryption engine using Ghidra.',
    date: 'Jan 19, 2026',
  },
];

const sorted = [...posts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export default function Home() {
  return (
    <div className="space-y-8">
      {sorted.map((post) => (
        <Link key={post.href} href={post.href} className="block group space-y-1">
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
      ))}
    </div>
  );
}
