import Link from 'next/link';

type Post = {
  title: string;
  href: string;
  preview: string;
  date: string;
  tag?: 'codeforces' | 'aws';
};

const posts: Post[] = [
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
  {
    title: 'Momoyo and the Network',
    href: '/n/6',
    preview: 'A nice graph problem combining tree structure, path finding, and optimization.',
    date: 'May 31, 2026',
    tag: 'codeforces',
  },
  // {
  //   title: 'AWS DevOps Agent Workshop for Incident Investigation',
  //   href: '/n/7',
  //   preview: 'Learning how to use the AWS DevOps Agent for incident investigation.',
  //   date: 'June 1, 2026',
  //   tag: 'aws',
  // },
];

const sorted = (tag?: 'codeforces' | 'aws') =>
  posts
    .filter((p) => (tag ? p.tag === tag : !p.tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default function Home() {
  const main = sorted();
  const cf = sorted('codeforces');
  const aws = sorted('aws');

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-12">
      {/* Main posts */}
      <div className="space-y-8">
        {main.map((post) => (
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

      {/* Sidebar */}
      <div className="space-y-8">
        {/* Codeforces */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Codeforces
          </h2>
          <div className="space-y-4">
            {cf.map((post) => (
              <Link key={post.href} href={post.href} className="block group space-y-0.5">
                <p className="text-sm font-medium group-hover:text-blue-500 transition-colors leading-snug">
                  {post.title}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{post.date}</p>
              </Link>
            ))}
            {cf.length === 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-600">Nothing yet.</p>
            )}
          </div>
        </div>

        {/* AWS */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            AWS
          </h2>
          <div className="space-y-4">
            {aws.map((post) => (
              <Link key={post.href} href={post.href} className="block group space-y-0.5">
                <p className="text-sm font-medium group-hover:text-blue-500 transition-colors leading-snug">
                  {post.title}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{post.date}</p>
              </Link>
            ))}
            {aws.length === 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-600">Nothing yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
