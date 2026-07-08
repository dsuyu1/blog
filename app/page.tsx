import type { Metadata } from 'next';
import Game from './game/game';

export const metadata: Metadata = {
  description:
    "Damian Villarreal — security operations, cloud, and AI. A walkable 2D pixel portfolio in three worlds: a village of products and talks, a midnight keep of architecture, and a neon city of hacking and AI.",
};

export default function Home() {
  return (
    <>
      <Game />
      <noscript>
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
          <h1>Damian Villarreal</h1>
          <p>
            This page is an explorable 2D pixel-town portfolio and needs
            JavaScript. For the classic version, visit{' '}
            <a href="/portfolio">/portfolio</a>.
          </p>
        </div>
      </noscript>
    </>
  );
}
