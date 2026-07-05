import type { Metadata } from 'next';
import Desktop from './desktop/desktop';
import { posts } from './posts';

export const metadata: Metadata = {
  description:
    'Damian Villarreal — security operations, cloud, and AI. A macOS-style desktop: open the Posts folder for the blog, or launch the About, Portfolio, and Learning apps.',
};

export default function Home() {
  return <Desktop posts={posts} />;
}
