"use client";

import { useEffect, useState } from "react";

/* Desktop widgets, Apple-style: glass cards pinned to the left of the
   desktop. Clock, a Notes-style checklist, and a live security-news feed
   (Hacker News Algolia API — CORS-enabled, no key, fetched client-side). */

function WidgetShell({
  title,
  accent,
  children,
}: {
  title: string;
  accent?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white/60 dark:bg-[#26262a]/60 backdrop-blur-2xl border border-black/[0.07] dark:border-white/[0.12] shadow-[0_10px_30px_rgba(0,0,0,0.18)] dark:shadow-[0_14px_40px_rgba(0,0,0,0.35)] overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40 dark:text-white/45">
          {title}
        </span>
        {accent}
      </div>
      {children}
    </div>
  );
}

/* ── Clock ──────────────────────────────────────────────── */

export function ClockWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <WidgetShell title="Clock">
      <div className="px-4 pb-4">
        <p className="text-[34px] font-semibold tracking-tight text-black/85 dark:text-white leading-none tabular-nums">
          {now
            ? now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
            : "--:--"}
        </p>
        <p className="text-[12px] text-black/45 dark:text-white/50 mt-1.5">
          {now
            ? now.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })
            : ""}
        </p>
      </div>
    </WidgetShell>
  );
}

/* ── Things to Do (Notes/Reminders style) ───────────────── */

type Todo = { id: string; text: string; done: boolean };

const DEFAULT_TODOS: Todo[] = [
  { id: "saa", text: "AWS Solutions Architect Associate", done: true },
  { id: "sec-spec", text: "AWS Security Specialty", done: false },
  { id: "bsides26", text: "BSides RGV 2026 — Smarter SecOps talk", done: false },
  { id: "fedapt", text: "FeDAPT paper draft", done: false },
  { id: "pi-llm", text: "Kubernetes + local LLM on Raspberry Pi", done: false },
];

const TODO_KEY = "desktop-todos-v1";

export function TodoWidget() {
  const [todos, setTodos] = useState<Todo[]>(DEFAULT_TODOS);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(TODO_KEY);
      if (stored) {
        const saved: Todo[] = JSON.parse(stored);
        // Keep the authored list, restore saved checked-state by id.
        setTodos(
          DEFAULT_TODOS.map((t) => ({
            ...t,
            done: saved.find((s) => s.id === t.id)?.done ?? t.done,
          })),
        );
      }
    } catch {
      // ignore storage failures
    }
  }, []);

  const toggle = (id: string) => {
    setTodos((ts) => {
      const next = ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      try {
        window.localStorage.setItem(TODO_KEY, JSON.stringify(next));
      } catch {
        // ignore storage failures
      }
      return next;
    });
  };

  const open = todos.filter((t) => !t.done).length;

  return (
    <WidgetShell
      title="Things to Do"
      accent={<span className="text-[11px] text-black/35 dark:text-white/35">{open} open</span>}
    >
      <ul className="px-2 pb-2">
        {todos.map((t) => (
          <li key={t.id}>
            <button
              onClick={() => toggle(t.id)}
              className="w-full flex items-start gap-2.5 px-2 py-1.5 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors text-left"
            >
              <span
                className={`mt-0.5 w-[17px] h-[17px] shrink-0 rounded-full border flex items-center justify-center transition-colors ${
                  t.done
                    ? "bg-[#007aff] border-[#007aff] dark:bg-[#0a84ff] dark:border-[#0a84ff]"
                    : "border-black/25 hover:border-black/45 dark:border-white/30 dark:hover:border-white/50"
                }`}
              >
                {t.done && (
                  <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none">
                    <path
                      d="M2.5 6.2 5 8.7l4.5-5.4"
                      stroke="#fff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span
                className={`text-[13px] leading-snug ${
                  t.done
                    ? "text-black/30 dark:text-white/35 line-through"
                    : "text-black/80 dark:text-white/85"
                }`}
              >
                {t.text}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </WidgetShell>
  );
}

/* ── Security Wire (live news) ──────────────────────────── */

type Story = {
  objectID: string;
  title: string;
  url: string | null;
  points: number;
  created_at_i: number;
};

function timeAgo(epochSec: number): string {
  const s = Math.max(1, Math.floor(Date.now() / 1000 - epochSec));
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export function SecurityNewsWidget() {
  const [stories, setStories] = useState<Story[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    // Recent security stories, best-of ranked here: the API's numericFilters
    // (points>N) is no longer allowed publicly, so pull the newest ~50 from
    // the by-date index and sort by points client-side.
    fetch(
      "https://hn.algolia.com/api/v1/search_by_date?query=security&tags=story&hitsPerPage=50",
      { signal: ctrl.signal },
    )
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((data) =>
        setStories(
          ((data.hits ?? []) as Story[])
            .sort((a, b) => b.points - a.points)
            .slice(0, 5),
        ),
      )
      .catch(() => {
        if (!ctrl.signal.aborted) setError(true);
      });
    return () => ctrl.abort();
  }, []);

  return (
    <WidgetShell
      title="Security Wire"
      accent={
        <span className="flex items-center gap-1.5 text-[11px] text-black/35 dark:text-white/35">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
          Hacker News
        </span>
      }
    >
      <div className="px-2 pb-2">
        {error && (
          <p className="px-2 py-2 text-[12px] text-black/40 dark:text-white/40">
            Couldn&apos;t reach the feed.
          </p>
        )}
        {!error && !stories && (
          <div className="space-y-2 px-2 py-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-3.5 rounded bg-black/[0.06] dark:bg-white/[0.07] animate-pulse" />
            ))}
          </div>
        )}
        {stories?.map((s) => (
          <a
            key={s.objectID}
            href={s.url ?? `https://news.ycombinator.com/item?id=${s.objectID}`}
            target="_blank"
            rel="noreferrer"
            className="block px-2 py-1.5 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors"
          >
            <p className="text-[12.5px] leading-snug text-black/80 dark:text-white/85 line-clamp-2">
              {s.title}
            </p>
            <p className="text-[11px] text-black/35 dark:text-white/35 mt-0.5">
              {s.points} points · {timeAgo(s.created_at_i)} ago
            </p>
          </a>
        ))}
        {stories?.length === 0 && (
          <p className="px-2 py-2 text-[12px] text-black/40 dark:text-white/40">Quiet out there today.</p>
        )}
      </div>
    </WidgetShell>
  );
}
