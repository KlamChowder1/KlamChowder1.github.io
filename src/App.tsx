import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import {
  personalInfo,
  technicalSkills,
  timelineEntries,
  categoryMeta,
  formatPeriod,
} from "./data/experience";
import type { TimelineEntry, TimelineCategory } from "./data/experience";
import { TechIcon } from "./components/TechIcon";

/** Get favicon URLs for a given website URL (primary → fallback chain) */
const faviconChain = (url: string): string[] => {
  try {
    const { hostname } = new URL(url);
    const ddg = `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
    const google = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${hostname}&size=64`;
    const direct = `https://${hostname}/favicon.ico`;
    // DuckDuckGo works better for some domains where Google returns a generic globe
    const ddgFirst = ['vanaqua.org'];
    if (ddgFirst.some((d) => hostname.endsWith(d))) return [ddg, google, direct];
    return [google, ddg, direct];
  } catch {
    return [];
  }
};

/* ═══════════════════════════════════════════════
   Time-layout helpers
   ═══════════════════════════════════════════════ */
const _now = new Date();
const NOW = { y: _now.getFullYear(), m: _now.getMonth() + 1, d: _now.getDate() };
const ORIGIN = { y: 2015, m: 1, d: 1 };

const ym = (s: string) => {
  const [y, m, d = 1] = s.split("-").map(Number);
  return { y, m, d };
};
const mDiff = (a: { y: number; m: number; d: number }, b: { y: number; m: number; d: number }) =>
  (b.y - a.y) * 12 + (b.m - a.m) + (b.d - a.d) / 30;

const TOTAL_MONTHS = mDiff(ORIGIN, NOW);
const PPM = 10; // px per month
const LANE_H = TOTAL_MONTHS * PPM;
const VISUAL_MIN = 14; // CSS min-height for compact bars
const POPOVER_W = 500;
const POPOVER_GAP = 12;

type Pos = TimelineEntry & { top: number; h: number; sub: number };

/** Absolutely-position entries within a lane, detecting overlaps. */
function layout(entries: TimelineEntry[]): Pos[] {
  const arr: Pos[] = entries.map((e) => {
    const s = ym(e.startDate);
    const end = e.endDate === 'present' ? NOW : ym(e.endDate);
    const unclampedTop = mDiff(end, NOW) * PPM;
    const top = Math.max(0, unclampedTop);
    const h = mDiff(s, end) * PPM - (top - unclampedTop);
    return { ...e, top, h, sub: 0 };
  });
  // Sort by top (end date), then longer bars first so they get sub=0 priority
  arr.sort((a, b) => a.top - b.top || b.h - a.h);

  // Assign sub-lanes — use visual height (accounting for CSS min-height)
  // to detect collisions accurately
  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j].sub !== arr[i].sub) continue;
      const jVisualH = Math.max(arr[j].h, VISUAL_MIN);
      if (arr[i].top < arr[j].top + jVisualH) {
        arr[i].sub = arr[j].sub + 1;
      }
    }
  }

  return arr;
}

type Col = "education" | "work" | "volunteer";
const colOf = (e: TimelineEntry): Col =>
  e.category === "education"
    ? "education"
    : e.category === "volunteer"
      ? "volunteer"
      : "work";

const YEARS: { year: number; top: number }[] = [];
for (let y = NOW.y; y >= ORIGIN.y; y--) {
  YEARS.push({ year: y, top: mDiff({ y, m: 1, d: 1 }, NOW) * PPM });
}

/* ═══════════════════════════════════════════════
   App component
   ═══════════════════════════════════════════════ */
function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'software' | 'full'>('full');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => Object.fromEntries(Object.keys(technicalSkills).map((k) => [k, true]))
  );
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleCategory = (cat: string) =>
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const toggleSkill = (skill: string) => {
    setActiveSkill((prev) => (prev === skill ? null : skill));
    setSelectedId(null);
    setPopoverPos(null);
  };

  // Filter entries based on view mode and active skill
  const filteredEntries = useMemo(() => {
    let entries = timelineEntries;
    if (viewMode === 'software') {
      entries = entries.filter(
        (e) => (e.skills && e.skills.length > 0) || e.category === 'education'
      );
    }
    if (activeSkill) {
      entries = entries.filter((e) => e.skills?.includes(activeSkill));
    }
    return entries;
  }, [activeSkill, viewMode]);

  const cols = useMemo(
    () => ({
      edu: layout(filteredEntries.filter((e) => colOf(e) === "education")),
      work: layout(filteredEntries.filter((e) => colOf(e) === "work")),
      vol: layout(filteredEntries.filter((e) => colOf(e) === "volunteer")),
    }),
    [filteredEntries]
  );

  const selected = selectedId
    ? timelineEntries.find((e) => e.id === selectedId) ?? null
    : null;

  const pick = (id: string, barEl: HTMLElement) => {
    if (selectedId === id) {
      setSelectedId(null);
      setPopoverPos(null);
      return;
    }
    setSelectedId(id);
    const gridEl = gridRef.current;
    if (!gridEl) return;
    const barRect = barEl.getBoundingClientRect();
    const gridRect = gridEl.getBoundingClientRect();
    const top = barRect.top - gridRect.top;
    let left = barRect.right - gridRect.left + POPOVER_GAP;
    if (left + POPOVER_W > gridRect.width) {
      left = barRect.left - gridRect.left - POPOVER_W - POPOVER_GAP;
    }
    setPopoverPos({ top: Math.max(0, top), left });
  };

  /* Close popover on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedId(null);
        setPopoverPos(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* ── Bar renderer ── */
  const COMPACT_THRESHOLD = 30; // px — entries shorter than this get compact single-line text

  function Bar({ e }: { e: Pos }) {
    const sel = selectedId === e.id;
    const isCompact = e.h < COMPACT_THRESHOLD;
    return (
      <div
        className={`pt-bar pt-bar--${e.category}${sel ? " pt-bar--sel" : ""}${isCompact ? " pt-bar--compact" : ""}`}
        style={{
          top: e.top,
          height: Math.max(e.h, 14),
          ...(e.sub > 0
            ? { left: `calc(${e.sub * 28}% + 4px)`, right: "4px", zIndex: e.sub + 1 }
            : {}),
        }}
        onClick={(ev) => pick(e.id, ev.currentTarget)}
        onKeyDown={(ev) => {
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            pick(e.id, ev.currentTarget as HTMLElement);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <span className="pt-bar-row">
          <span className="pt-bar-title">{e.title}</span>
          <span className="pt-bar-period">{formatPeriod(e.startDate, e.endDate)}</span>
        </span>
        <span className="pt-bar-sub">{e.subtitle}</span>
        {e.badge && <span className="pt-bar-badge">{e.badge}</span>}
      </div>
    );
  }

  return (
    <div className="page">
      {/* ── Navigation ── */}
      <nav className="nav">
        <div className="nav-brand">
          <span><b>{personalInfo.name}</b></span>
          <span className="nav-sep">·</span>
          <span className="nav-location">{personalInfo.location}</span>
        </div>
        <div className="nav-links">
          <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="nav-social" title="GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
          </a>
          <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer" className="nav-social" title="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
          </a>
          <a className="nav-resume" href="/Kevin_Lam_Resume_One_Page.pdf" target="_blank" rel="noreferrer" title="Resume">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
          </a>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          Timeline with Filter Sidebar (Desktop)
         ══════════════════════════════════════════ */}
      <section id="timeline" className="section section--wide">
        <div className="tl-layout">
          {/* ── Timeline ── */}
          <div className="tl-main">

            {/* Column headers */}
            <div className="pt-heads">
              <div className="pt-head-axis" />
              <div className="pt-head pt-head--edu">Education</div>
              <div className="pt-head pt-head--work">Work Experience</div>
              <div className="pt-head pt-head--vol">Volunteer</div>
            </div>

            {/* Time grid */}
            <div className="pt-grid" style={{ height: LANE_H }} ref={gridRef}>
              {/* Horizontal year gridlines */}
              <div className="pt-gridlines" aria-hidden="true">
                {YEARS.map(({ year, top }) => (
                  <div key={year} className="pt-gl" style={{ top }} />
                ))}
              </div>

              {/* Year axis */}
              <div className="pt-axis">
                {YEARS.map(({ year, top }) => (
                  <span key={year} className="pt-year" style={{ top }}>
                    {year}
                  </span>
                ))}
              </div>

              {/* Education lane */}
              <div className="pt-lane">
                {cols.edu.map((e) => (
                  <Bar key={e.id} e={e} />
                ))}
              </div>

              {/* Work lane */}
              <div className="pt-lane">
                {cols.work.map((e) => (
                  <Bar key={e.id} e={e} />
                ))}
              </div>

              {/* Volunteer lane */}
              <div className="pt-lane">
                {cols.vol.map((e) => (
                  <Bar key={e.id} e={e} />
                ))}
              </div>

              {/* ── Inline popover ── */}
              {selected && popoverPos && (
                <div
                  className={`pt-popover pt-popover--${selected.category}`}
                  key={selected.id}
                  style={{ top: popoverPos.top, left: popoverPos.left }}
                >
                  <div className="pt-detail-head">
                    <div>
                      <span className={`pt-cat-badge pt-cat-badge--${selected.category}`}>
                        {categoryMeta[selected.category].label}
                      </span>
                      <h3 className="pt-detail-title">{selected.title}</h3>
                      <p className="pt-detail-sub">
                        {selected.subtitleUrl ? (
                          <a
                            href={selected.subtitleUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              className="pt-detail-logo"
                              src={faviconChain(selected.subtitleUrl!)[0]}
                              alt=""
                              width={18}
                              height={18}
                              onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                const idx = Number(img.dataset.fbIdx || '0') + 1;
                                const chain = faviconChain(selected.subtitleUrl!);
                                if (idx < chain.length) { img.dataset.fbIdx = String(idx); img.src = chain[idx]; }
                                else img.style.display = 'none';
                              }}
                            />
                            {selected.subtitle} ↗
                          </a>
                        ) : (
                          selected.subtitle
                        )}
                      </p>
                      <p className="pt-detail-period">{formatPeriod(selected.startDate, selected.endDate)}</p>
                    </div>
                    <button
                      className="pt-detail-close"
                      onClick={() => { setSelectedId(null); setPopoverPos(null); }}
                      aria-label="Close details"
                    >
                      ✕
                    </button>
                  </div>

                  {selected.badge && (
                    <span className="pt-distinction">{selected.badge}</span>
                  )}

                  {selected.skills && selected.skills.length > 0 && (
                    <div className="pt-detail-skills">
                      {selected.skills.map((s) => (
                        <span
                          key={s}
                          className={`skill-pill skill-pill--${selected.category}`}
                        >
                          <TechIcon name={s} size="sm" />
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {selected.highlights.length > 0 && (
                    <ul className="pt-detail-highlights">
                      {selected.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>{/* end tl-main */}

          {/* ── Filter Sidebar ── */}
          <aside className="filter-sidebar">
            <div className="filter-sidebar-inner">
              <label className="sw-toggle">
                <input
                  type="checkbox"
                  className="sw-toggle-input"
                  checked={viewMode === 'software'}
                  onChange={() => {
                    const next = viewMode === 'software' ? 'full' : 'software';
                    setViewMode(next);
                    setSelectedId(null);
                    setPopoverPos(null);
                    if (next === 'full') setActiveSkill(null);
                    if (next === 'software') setOpenCategories(Object.fromEntries(Object.keys(technicalSkills).map((k) => [k, true])));
                  }}
                />
                <span className="sw-toggle-track"><span className="sw-toggle-thumb" /></span>
                <span className="sw-toggle-label">Tech Experience Only</span>
              </label>
              {viewMode === 'software' && (
                <>
                  {Object.entries(technicalSkills).map(([category, skills]) => (
                    <div key={category} className="filter-group">
                      <button
                        className={`filter-group-head${openCategories[category] ? " filter-group-head--open" : ""}`}
                        onClick={() => toggleCategory(category)}
                      >
                        <span>{category}</span>
                        <svg className="filter-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                      </button>
                      <div className={`filter-chips-wrapper${openCategories[category] ? " filter-chips-wrapper--open" : ""}`}>
                        <div className="filter-chips">
                          {skills.map((skill) => (
                            <button
                              key={skill}
                              className={`filter-chip${activeSkill === skill ? " filter-chip--active" : ""}`}
                              onClick={() => toggleSkill(skill)}
                            >
                              <TechIcon name={skill} size="sm" />
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  {activeSkill && (
                    <button className="filter-clear" onClick={() => { setActiveSkill(null); setSelectedId(null); setPopoverPos(null); }}>
                      Clear filter ✕
                    </button>
                  )}
                </>
              )}
            </div>
          </aside>

        </div>{/* end tl-layout */}
      </section>

      {/* ══════════════════════════════════════════
          Mobile Timeline (simple list)
         ══════════════════════════════════════════ */}
      <section className="section pm-section">
        <h2 className="section-title">
          <span className="section-icon">📍</span> Timeline
        </h2>
        <div className="pm-list">
          {timelineEntries.map((entry) => (
            <div
              key={entry.id}
              className={`pm-card pm-card--${entry.category}`}
            >
              <span className={`pt-cat-badge pt-cat-badge--${entry.category}`}>
                {categoryMeta[entry.category].label}
              </span>
              <span className="pm-period">{formatPeriod(entry.startDate, entry.endDate)}</span>
              <h3 className="pm-title">{entry.title}</h3>
              <p className="pm-sub">
                {entry.subtitleUrl ? (
                  <a href={entry.subtitleUrl} target="_blank" rel="noreferrer">
                    <img
                      className="pt-detail-logo"
                      src={faviconChain(entry.subtitleUrl!)[0]}
                      alt=""
                      width={16}
                      height={16}
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        const idx = Number(img.dataset.fbIdx || '0') + 1;
                        const chain = faviconChain(entry.subtitleUrl!);
                        if (idx < chain.length) { img.dataset.fbIdx = String(idx); img.src = chain[idx]; }
                        else img.style.display = 'none';
                      }}
                    />
                    {entry.subtitle} ↗
                  </a>
                ) : (
                  entry.subtitle
                )}
              </p>
              {entry.badge && (
                <span className="pt-distinction">{entry.badge}</span>
              )}
              {entry.skills && entry.skills.length > 0 && (
                <div className="pm-skills">
                  {entry.skills.map((s) => (
                    <span
                      key={s}
                      className={`skill-pill skill-pill--${entry.category}`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {entry.highlights.length > 0 && (
                <ul className="pm-highlights">
                  {entry.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default App;
