import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, FC, KeyboardEvent } from "react";
import type { TimelineCategory } from "../data/experience";
import { TechIcon } from "./TechIcon";

type ExperienceSkillsProps = {
  skills: string[];
  category: TimelineCategory;
  className: string;
  mode?: "pill" | "icon";
};

export const ExperienceSkills: FC<ExperienceSkillsProps> = ({
  skills,
  category,
  className,
  mode = "pill",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(skills.length);
  const listRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const ellipsisRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const listEl = listRef.current;
    const measureEl = measureRef.current;
    const ellipsisEl = ellipsisRef.current;
    if (!listEl || !measureEl || !ellipsisEl) return;

    const measure = () => {
      const items = Array.from(
        measureEl.querySelectorAll<HTMLElement>("[data-skill-item='true']")
      );
      if (items.length === 0) {
        setHasOverflow(false);
        setCollapsedHeight(null);
        setVisibleCount(0);
        return;
      }

      const firstRowTop = items[0].offsetTop;
      const firstRowItems = items.filter((item) => item.offsetTop === firstRowTop);
      const firstRowHeight = firstRowItems.reduce(
        (maxHeight, item) => Math.max(maxHeight, item.offsetHeight),
        items[0].offsetHeight
      );
      const wrapped = items.some((item) => item.offsetTop > firstRowTop + 1);
      const gap = parseFloat(getComputedStyle(measureEl).columnGap || getComputedStyle(measureEl).gap || "0");

      let nextVisibleCount = items.length;
      if (wrapped) {
        const containerWidth = measureEl.clientWidth;
        const ellipsisWidth = ellipsisEl.offsetWidth;
        nextVisibleCount = firstRowItems.length;

        while (nextVisibleCount > 0) {
          const lastVisibleItem = firstRowItems[nextVisibleCount - 1];
          const requiredWidth = lastVisibleItem.offsetLeft + lastVisibleItem.offsetWidth + gap + ellipsisWidth;
          if (requiredWidth <= containerWidth + 1) break;
          nextVisibleCount -= 1;
        }

        nextVisibleCount = Math.max(1, nextVisibleCount);
      }

      setHasOverflow(wrapped);
      setCollapsedHeight(firstRowHeight);
      setVisibleCount(nextVisibleCount);
      if (!wrapped) setIsExpanded(false);
    };

    measure();
    const frameId = requestAnimationFrame(measure);
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => measure())
        : null;

    resizeObserver?.observe(listEl);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
    };
  }, [skills, mode]);

  if (skills.length === 0) return null;

  const collapsedStyle =
    collapsedHeight == null
      ? undefined
      : ({ "--experience-skills-collapsed-height": `${collapsedHeight}px` } as CSSProperties);

  const isCollapsed = hasOverflow && !isExpanded;
  const visibleSkills = isCollapsed ? skills.slice(0, visibleCount) : skills;

  const renderSkill = (skill: string) =>
    mode === "icon" ? (
      <span
        key={skill}
        className="pm-skill-icon experience-skills-item"
        data-skill-item="true"
        role="img"
        aria-label={skill}
      >
        <TechIcon name={skill} size="sm" />
      </span>
    ) : (
      <span
        key={skill}
        className={`skill-pill skill-pill--${category} experience-skills-item`}
        data-skill-item="true"
      >
        <TechIcon name={skill} size="sm" />
        {skill}
      </span>
    );

  const handleToggle = () => {
    if (!hasOverflow) return;
    setIsExpanded((prev) => !prev);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!hasOverflow) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <div
      className={`${className} experience-skills experience-skills--${mode}${
        hasOverflow ? " experience-skills--interactive" : ""
      }${isCollapsed ? " experience-skills--collapsed" : ""}`}
      role={hasOverflow ? "button" : undefined}
      tabIndex={hasOverflow ? 0 : undefined}
      aria-expanded={hasOverflow ? isExpanded : undefined}
      onClick={hasOverflow ? handleToggle : undefined}
      onKeyDown={hasOverflow ? handleKeyDown : undefined}
    >
      <span
        ref={listRef}
        className={`experience-skills-list experience-skills-list--${mode}${
          isCollapsed ? " experience-skills-list--collapsed" : ""
        }`}
        style={collapsedStyle}
      >
        {visibleSkills.map(renderSkill)}
        {isCollapsed && (
          <span className={`experience-skills-ellipsis experience-skills-ellipsis--${mode}`} aria-hidden="true">
            ...
          </span>
        )}
      </span>
      <span
        ref={measureRef}
        className={`experience-skills-list experience-skills-list--${mode} experience-skills-list--measure`}
        aria-hidden="true"
      >
        {skills.map(renderSkill)}
        <span
          ref={ellipsisRef}
          className={`experience-skills-ellipsis experience-skills-ellipsis--${mode}`}
        >
          ...
        </span>
      </span>
    </div>
  );
};
