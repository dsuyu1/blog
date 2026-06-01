import type { ReactNode } from 'react';

type Props = {
  title: string;
  href: string;
  children: ReactNode;
};

export function ProblemCard({ title, href, children }: Props) {
  return (
    <div className="my-6 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-semibold hover:text-blue-500 transition-colors"
        >
          {title} ↗
        </a>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed [&_strong]:font-semibold [&_strong]:text-gray-700 [&_strong]:dark:text-gray-300 [&_em]:italic [&_a]:text-blue-500 [&_a]:hover:text-blue-700 [&_code]:bg-gray-100 [&_code]:dark:bg-zinc-800 [&_code]:px-1 [&_code]:rounded [&_code]:text-xs">
        {children}
      </div>
    </div>
  );
}
