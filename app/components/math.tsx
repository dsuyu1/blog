'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export function Math({ children, display = false }: { children: string; display?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(children, ref.current, {
        displayMode: display,
        throwOnError: false,
      });
    }
  }, [children, display]);

  return (
    <span
      ref={ref}
      className={display ? 'block my-4 overflow-x-auto text-center' : 'inline'}
    />
  );
}
