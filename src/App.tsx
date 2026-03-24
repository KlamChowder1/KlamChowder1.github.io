import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { Icon } from "@iconify/react";
import "./App.css";
import {
  personalInfo,
  technicalSkills,
  timelineEntries,
  categoryMeta,
  formatPeriod,
} from "./data/experience";
import type { TimelineEntry, TimelineCategory } from "./data/experience";
import { ExperienceSkills } from "./components/ExperienceSkills";
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

/** Snap a parsed date to month boundary for pixel-perfect alignment. */
const snap = (d: { y: number; m: number; d: number }) => {
  if (d.d >= 28) {
    const m = d.m + 1;
    return m > 12 ? { y: d.y + 1, m: 1, d: 1 } : { y: d.y, m, d: 1 };
  }
  return { ...d, d: 1 };
};

/** Absolutely-position entries within a lane, detecting overlaps. */
function layout(entries: TimelineEntry[]): Pos[] {
  const arr: Pos[] = entries.map((e) => {
    const s = snap(ym(e.startDate));
    const end = e.endDate === 'present' ? NOW : snap(ym(e.endDate));
    const unclampedTop = Math.round(mDiff(end, NOW) * PPM);
    const top = Math.max(0, unclampedTop);
    const h = Math.round(mDiff(s, end) * PPM) - (top - unclampedTop);
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
  YEARS.push({ year: y, top: Math.round(mDiff({ y, m: 1, d: 1 }, NOW) * PPM) });
}

const toId = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const entrySummary = (entry: TimelineEntry) =>
  [
    categoryMeta[entry.category].label,
    entry.title,
    entry.subtitle,
    formatPeriod(entry.startDate, entry.endDate),
    entry.badge,
  ]
    .filter(Boolean)
    .join(", ");

const compareDateDesc = (a: string, b: string) => {
  if (a === b) return 0;
  if (a === "present") return -1;
  if (b === "present") return 1;
  return Date.parse(b) - Date.parse(a);
};

const compareEntriesByRecency = (a: TimelineEntry, b: TimelineEntry) =>
  compareDateDesc(a.endDate, b.endDate) ||
  compareDateDesc(a.startDate, b.startDate);

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
  const popoverRef = useRef<HTMLDivElement>(null);
  const firstFilterGroupRef = useRef<HTMLButtonElement>(null);
  const focusFiltersOnToggleRef = useRef(false);
  const barRefs = useRef(new Map<string, HTMLButtonElement>());
  const lastTriggerIdRef = useRef<string | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

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

  const mobileEntries = useMemo(() => {
    const entries =
      viewMode !== 'software'
        ? timelineEntries
        : timelineEntries.filter(
            (e) => (e.skills && e.skills.length > 0) || e.category === 'education'
          );
    return [...entries].sort(compareEntriesByRecency);
  }, [viewMode]);

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

  const closeDetails = (restoreFocus = false) => {
    setSelectedId(null);
    setPopoverPos(null);
    if (restoreFocus) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const triggerEl =
            (lastTriggerIdRef.current
              ? barRefs.current.get(lastTriggerIdRef.current)
              : null) ?? lastTriggerRef.current;
          triggerEl?.focus();
        });
      });
    }
  };

  const pick = (id: string, barEl: HTMLElement) => {
    lastTriggerIdRef.current = id;
    lastTriggerRef.current = barEl;
    if (selectedId === id) {
      closeDetails();
      return;
    }
    setSelectedId(id);
    const gridEl = gridRef.current;
    if (!gridEl) return;
    const barRect = barEl.getBoundingClientRect();
    const gridRect = gridEl.getBoundingClientRect();
    let top = barRect.top - gridRect.top;
    let left = barRect.right - gridRect.left + POPOVER_GAP;
    if (left + POPOVER_W > gridRect.width) {
      left = barRect.left - gridRect.left - POPOVER_W - POPOVER_GAP;
    }
    // Clamp vertically so popover stays within the viewport
    const viewportBottom = window.innerHeight;
    const popoverEstimatedH = 320; // approximate max height
    const popoverScreenTop = gridRect.top + top;
    if (popoverScreenTop + popoverEstimatedH > viewportBottom) {
      top = top - (popoverScreenTop + popoverEstimatedH - viewportBottom) - POPOVER_GAP;
    }
    setPopoverPos({ top: Math.max(0, top), left });
  };

  /* Close popover on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDetails(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!selectedId || !popoverPos) return;
    const frameId = requestAnimationFrame(() => popoverRef.current?.focus());
    return () => cancelAnimationFrame(frameId);
  }, [popoverPos, selectedId]);

  const isDesktopViewport = () =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 901px)").matches;

  const toggleViewMode = (moveFocusToFilters = false) => {
    const next = viewMode === 'software' ? 'full' : 'software';
    focusFiltersOnToggleRef.current =
      (focusFiltersOnToggleRef.current || moveFocusToFilters) && next === 'software';
    setViewMode(next);
    closeDetails();
    if (next === 'full') setActiveSkill(null);
    if (next === 'software') {
      setOpenCategories(
        Object.fromEntries(Object.keys(technicalSkills).map((k) => [k, true]))
      );
    }
  };

  useEffect(() => {
    if (viewMode !== 'software' || !focusFiltersOnToggleRef.current) return;
    focusFiltersOnToggleRef.current = false;
    const frameId = requestAnimationFrame(() => firstFilterGroupRef.current?.focus());
    return () => cancelAnimationFrame(frameId);
  }, [viewMode]);

  const handleViewModeKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    const shouldMoveFocusToFilters = isDesktopViewport() && viewMode === 'full';
    if (event.key === "Enter") {
      event.preventDefault();
      toggleViewMode(shouldMoveFocusToFilters);
      return;
    }
    if ((event.key === " " || event.key === "Spacebar") && shouldMoveFocusToFilters) {
      focusFiltersOnToggleRef.current = true;
    }
  };

  const resultsAnnouncement = useMemo(() => {
    const parts = [
      `Showing ${filteredEntries.length} experience ${filteredEntries.length === 1 ? "entry" : "entries"}`,
      viewMode === "software" ? "in software experience view" : "in full experience view",
    ];
    if (activeSkill) parts.push(`filtered by ${activeSkill}`);
    return `${parts.join(" ")}.`;
  }, [activeSkill, filteredEntries.length, viewMode]);

  /* ── Bar renderer ── */
  const COMPACT_THRESHOLD = 30; // px — entries shorter than this get compact single-line text

  function Bar({ e }: { e: Pos }) {
    const sel = selectedId === e.id;
    const isCompact = e.h < COMPACT_THRESHOLD;
    const detailId = `detail-panel-${e.id}`;
    return (
      <button
        ref={(node) => {
          if (node) barRefs.current.set(e.id, node);
          else barRefs.current.delete(e.id);
        }}
        type="button"
        className={`pt-bar pt-bar--${e.category}${sel ? " pt-bar--sel" : ""}${isCompact ? " pt-bar--compact" : ""}`}
        style={{
          top: e.top,
          height: Math.max(e.h, 14),
          ...(e.sub > 0
            ? { left: `calc(${e.sub * 28}% + 4px)`, right: "4px", zIndex: e.sub + 1 }
            : {}),
        }}
        onClick={(ev) => pick(e.id, ev.currentTarget)}
        aria-controls={detailId}
        aria-describedby="timeline-help"
        aria-expanded={sel}
        aria-label={`${sel ? "Hide" : "Show"} details for ${entrySummary(e)}`}
      >
        <span className="pt-bar-row">
          <span className="pt-bar-title">{e.title}</span>
          <span className="pt-bar-period">{formatPeriod(e.startDate, e.endDate)}</span>
        </span>
        <span className="pt-bar-sub">{e.subtitle}</span>
        {e.badge && <span className="pt-bar-badge">{e.badge}</span>}
      </button>
    );
  }

  return (
    <div className="page">
      <a className="skip-link" href="#experience-content">Skip to experience content</a>
      {/* ── Software toggle (top-right, scrolls away) ── */}
      <label className="sw-toggle page-toggle" title="Software Experience Only">
        <span className="sw-toggle-label">Software Experience Only</span>
        <input
          type="checkbox"
          className="sw-toggle-input"
          checked={viewMode === 'software'}
          onChange={() => toggleViewMode()}
          onKeyDown={handleViewModeKeyDown}
          aria-describedby="results-summary"
        />
        <span className="sw-toggle-track"><span className="sw-toggle-thumb" /></span>
      </label>

      {/* ── Navigation (sticky) ── */}
      <nav className="nav" aria-label="Profile links">
        <div className="nav-brand">
          <h1 className="nav-name">{personalInfo.name}</h1>
          <span className="nav-sep" aria-hidden="true">|</span>
          <span className="nav-location">{personalInfo.location}</span>
        </div>
        <div className="nav-links">
          <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="nav-social" title="GitHub" aria-label="GitHub profile (opens in a new tab)">
            <Icon icon="mdi:github-circle" className="nav-icon" aria-hidden="true" />
          </a>
          <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer" className="nav-social" title="LinkedIn" aria-label="LinkedIn profile (opens in a new tab)">
            <Icon icon="mdi:linkedin-box" className="nav-icon" aria-hidden="true" />
          </a>
          <a className="nav-resume" href="/Kevin_Lam_Resume_One_Page.pdf" target="_blank" rel="noreferrer" title="Resume" aria-label="Resume PDF (opens in a new tab)">
            <Icon icon="mdi:file-document-outline" className="nav-icon" aria-hidden="true" />
          </a>
        </div>
      </nav>

      <label className="sw-toggle page-toggle-mobile" title="Software Experience Only">
        <span className="sw-toggle-label">Software Experience Only</span>
        <input
          type="checkbox"
          className="sw-toggle-input"
          checked={viewMode === 'software'}
          onChange={() => toggleViewMode()}
          onKeyDown={handleViewModeKeyDown}
          aria-describedby="results-summary"
        />
        <span className="sw-toggle-track"><span className="sw-toggle-thumb" /></span>
      </label>
      <p id="results-summary" className="sr-only" aria-live="polite" aria-atomic="true">
        {resultsAnnouncement}
      </p>

      <main id="experience-content" className="page-main">

      {/* ══════════════════════════════════════════
          Timeline with Filter Sidebar (Desktop)
         ══════════════════════════════════════════ */}
      <section
        id="timeline"
        className="section section--wide"
        aria-labelledby="timeline-heading"
        aria-describedby="timeline-help"
      >
        <h2 id="timeline-heading" className="sr-only">Experience timeline</h2>
        <p id="timeline-help" className="sr-only">
          Timeline grouped by education, work experience, and volunteer. Tab to an experience and press Enter to open its details.
        </p>
        <div className={`tl-layout${viewMode === 'software' ? "" : " tl-layout--full"}`}>
          {/* ── Timeline ── */}
          <div className="tl-main">

            {/* Column headers */}
            <div className={`pt-heads${viewMode === 'software' ? ' pt-heads--no-vol' : ''}`}>
              <div className="pt-head-axis" />
              <div className="pt-head pt-head--edu">Education</div>
              <div className="pt-head pt-head--work">Work Experience</div>
              {viewMode !== 'software' && <div className="pt-head pt-head--vol">Volunteer</div>}
            </div>

            {/* Time grid */}
            <div className={`pt-grid${viewMode === 'software' ? ' pt-grid--no-vol' : ''}`} style={{ height: LANE_H }} ref={gridRef}>
              {/* Horizontal year gridlines */}
              <div className="pt-gridlines" aria-hidden="true">
                {YEARS.map(({ year, top }) => (
                  <div key={year} className="pt-gl" style={{ top }} />
                ))}
              </div>

              {/* Year axis */}
              <div className="pt-axis" aria-hidden="true">
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
              {viewMode !== 'software' && (
                <div className="pt-lane">
                  {cols.vol.map((e) => (
                    <Bar key={e.id} e={e} />
                  ))}
                </div>
              )}

              {/* ── Inline popover ── */}
              {selected && popoverPos && (
                <div
                  ref={popoverRef}
                  className={`pt-popover pt-popover--${selected.category}`}
                  key={selected.id}
                  id={`detail-panel-${selected.id}`}
                  role="region"
                  tabIndex={-1}
                  aria-labelledby={`detail-title-${selected.id}`}
                  aria-describedby={`detail-period-${selected.id}`}
                  style={{ top: popoverPos.top, left: popoverPos.left }}
                >
                  <div className="pt-detail-head">
                    <div>
                      <span className={`pt-cat-badge pt-cat-badge--${selected.category}`}>
                        {categoryMeta[selected.category].label}
                      </span>
                      <h3 id={`detail-title-${selected.id}`} className="pt-detail-title">{selected.title}</h3>
                      <p className="pt-detail-sub">
                        {selected.subtitleUrl ? (
                          <a
                            href={selected.subtitleUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${selected.subtitle} website (opens in a new tab)`}
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
                      <p id={`detail-period-${selected.id}`} className="pt-detail-period">{formatPeriod(selected.startDate, selected.endDate)}</p>
                    </div>
                    <button
                      className="pt-detail-close"
                      onClick={() => closeDetails(true)}
                      aria-label={`Close details for ${selected.title}`}
                    >
                      ✕
                    </button>
                  </div>

                  {selected.badge && (
                    <span className="pt-distinction">{selected.badge}</span>
                  )}

                  {selected.skills && (
                    <ExperienceSkills
                      skills={selected.skills}
                      category={selected.category}
                      className="pt-detail-skills"
                      label={`${selected.title} skills`}
                    />
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

          {/* ── Filter Sidebar (only in software mode) ── */}
          {viewMode === 'software' && (
            <aside className="filter-sidebar" aria-label="Skill filters">
              <div className="filter-sidebar-inner">
                {Object.entries(technicalSkills).map(([category, skills], categoryIndex) => (
                  <div key={category} className="filter-group">
                      <button
                        ref={categoryIndex === 0 ? firstFilterGroupRef : undefined}
                        className={`filter-group-head${openCategories[category] ? " filter-group-head--open" : ""}`}
                        onClick={() => toggleCategory(category)}
                        aria-expanded={openCategories[category]}
                        aria-controls={`skill-group-${toId(category)}`}
                      >
                        <span>{category}</span>
                        <svg className="filter-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><polyline points="6 9 12 15 18 9" /></svg>
                      </button>
                    <div id={`skill-group-${toId(category)}`} className={`filter-chips-wrapper${openCategories[category] ? " filter-chips-wrapper--open" : ""}`}>
                      <div className="filter-chips">
                        {skills.map((skill) => (
                          <button
                            key={skill}
                            className={`filter-chip${activeSkill === skill ? " filter-chip--active" : ""}`}
                            onClick={() => toggleSkill(skill)}
                            aria-pressed={activeSkill === skill}
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
                  <button className="filter-clear" onClick={() => { setActiveSkill(null); closeDetails(); }} aria-label="Clear active skill filter">
                    Clear filter ✕
                  </button>
                )}
              </div>
            </aside>
          )}

        </div>{/* end tl-layout */}
      </section>

      {/* ══════════════════════════════════════════
          Mobile Timeline (simple list)
         ══════════════════════════════════════════ */}
      <section className="section pm-section" aria-labelledby="experience-list-heading">
        <h2 id="experience-list-heading" className="sr-only">Experience list</h2>
        <div className="pm-list">
          {mobileEntries.map((entry) => (
            <article
              key={entry.id}
              className={`pm-card pm-card--${entry.category}`}
              tabIndex={0}
              aria-labelledby={`pm-title-${entry.id}`}
              aria-describedby={[
                `pm-category-${entry.id}`,
                `pm-period-${entry.id}`,
                entry.subtitle ? `pm-sub-${entry.id}` : "",
                entry.badge ? `pm-badge-${entry.id}` : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span id={`pm-category-${entry.id}`} className={`pt-cat-badge pt-cat-badge--${entry.category}`}>
                {categoryMeta[entry.category].label}
              </span>
              <span id={`pm-period-${entry.id}`} className="pm-period">{formatPeriod(entry.startDate, entry.endDate)}</span>
              <h3 id={`pm-title-${entry.id}`} className="pm-title">{entry.title}</h3>
              <p id={`pm-sub-${entry.id}`} className="pm-sub">
                {entry.subtitleUrl ? (
                  <a href={entry.subtitleUrl} target="_blank" rel="noreferrer" aria-label={`${entry.subtitle} website (opens in a new tab)`}>
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
                <span id={`pm-badge-${entry.id}`} className="pt-distinction">{entry.badge}</span>
              )}
              {entry.category !== 'education' && entry.skills && (
                <ExperienceSkills
                  skills={entry.skills}
                  category={entry.category}
                  className="pm-skills"
                  mode="icon"
                  label={`${entry.title} skills`}
                />
              )}
              {entry.highlights.length > 0 && (
                <ul className="pm-highlights">
                  {entry.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>
      </main>

    </div>
  );
}

export default App;
