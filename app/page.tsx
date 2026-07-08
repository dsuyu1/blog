import type { Metadata } from 'next';
import Game from './game/game';

export const metadata: Metadata = {
  description:
    "Damian Villarreal — security operations, cloud, and AI. A walkable 2D pixel town: spawn in the architect's studio, then explore buildings holding security, AI, and product projects.",
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
