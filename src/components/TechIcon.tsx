import type { FC } from "react";

type TechIconProps = {
  name: string;
  size?: "sm" | "md";
};

const svg = (path: JSX.Element, title: string) => (
  <svg
    className="tech-icon-svg"
    viewBox="0 0 24 24"
    role="img"
    aria-label={title}
    focusable="false"
  >
    {path}
  </svg>
);

const iconMap: Record<string, JSX.Element> = {
  React: svg(
    <g>
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="currentColor" strokeWidth="1.6" fill="none" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="currentColor" strokeWidth="1.6" fill="none" transform="rotate(120 12 12)" />
    </g>,
    "React"
  ),
  TypeScript: svg(
    <g>
      <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" />
      <text x="12" y="16" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">TS</text>
    </g>,
    "TypeScript"
  ),
  JavaScript: svg(
    <g>
      <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" />
      <text x="12" y="16" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">JS</text>
    </g>,
    "JavaScript"
  ),
  GraphQL: svg(
    <g>
      <polygon points="12 3 20 16 4 16" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="5.2" r="1.4" fill="currentColor" />
      <circle cx="18" cy="15" r="1.4" fill="currentColor" />
      <circle cx="6" cy="15" r="1.4" fill="currentColor" />
    </g>,
    "GraphQL"
  ),
  "Node.js": svg(
    <g>
      <path d="M12 2.5 20.5 7v10l-8.5 4.5L3.5 17V7z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <text x="12" y="14.5" textAnchor="middle" fontSize="7" fill="currentColor" fontWeight="600">js</text>
    </g>,
    "Node.js"
  ),
  MongoDB: svg(
    <g>
      <path d="M12 3c1.8 2.6 3 5.3 3 7.7 0 2.7-1.7 4.7-3 5.6-1.3-.9-3-2.9-3-5.6C9 8.3 10.2 5.6 12 3z" fill="currentColor" />
      <rect x="11.4" y="14" width="1.2" height="7" fill="currentColor" />
    </g>,
    "MongoDB"
  ),
  Express: svg(
    <g>
      <rect x="4" y="6" width="16" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <text x="12" y="15" textAnchor="middle" fontSize="7" fill="currentColor" fontWeight="600">ex</text>
    </g>,
    "Express"
  ),
  AWS: svg(
    <g>
      <path d="M5 15c2.5 2.3 6 4 7 4s4.5-.7 7-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <text x="12" y="11" textAnchor="middle" fontSize="7" fill="currentColor" fontWeight="700">aws</text>
    </g>,
    "AWS"
  ),
  DynamoDB: svg(
    <g>
      <rect x="7" y="5" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="9" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="1.2" />
      <line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="1.2" />
    </g>,
    "DynamoDB"
  ),
  Angular: svg(
    <g>
      <polygon points="12 3 21 8 18 19 12 22 6 19 3 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <text x="12" y="15" textAnchor="middle" fontSize="7" fill="currentColor" fontWeight="700">ng</text>
    </g>,
    "Angular"
  ),
  Vue: svg(
    <g>
      <polygon points="12 4 20 18 4 18" fill="currentColor" opacity="0.3" />
      <polygon points="12 7 17 18 7 18" fill="currentColor" />
    </g>,
    "Vue"
  ),
  Vuetify: svg(
    <g>
      <path d="M7 4h4l-2 16-2-4-2 4z" fill="currentColor" />
      <path d="M13 4h4l-2 16-2-4-2 4z" fill="currentColor" opacity="0.6" />
    </g>,
    "Vuetify"
  ),
  Nuxt: svg(
    <g>
      <polygon points="6 18 12 6 18 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <polyline points="9 18 12 12 15 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </g>,
    "Nuxt"
  ),
  Python: svg(
    <g>
      <path d="M12 4c-2.5 0-3 .8-3 2.5v1.5h6V6.5C15 4.8 14.5 4 12 4zM9 10v2c0 1.7.5 2.5 3 2.5s3-.8 3-2.5v-2z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <circle cx="10" cy="6.8" r="0.8" fill="currentColor" />
      <circle cx="14" cy="15.2" r="0.8" fill="currentColor" />
    </g>,
    "Python"
  ),
  PostgreSQL: svg(
    <g>
      <path d="M7 8c0-2.2 3-3.5 5-3.5s5 1.3 5 3.5-3 3.5-5 3.5S7 10.2 7 8z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M9.5 14.5c1.5 1.3 3.5 1.3 5 0" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="11.5" r="1" fill="currentColor" />
    </g>,
    "PostgreSQL"
  ),
  Redux: svg(
    <g>
      <path d="M7 14c1.2 2.6 3.2 4.5 5 4.5s3.8-1.8 5-4.5c-1.2-2.6-3.2-4.5-5-4.5S8.2 11.4 7 14z" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <circle cx="7.5" cy="14" r="1.2" fill="currentColor" />
      <circle cx="16.5" cy="14" r="1.2" fill="currentColor" />
      <circle cx="12" cy="9.5" r="1.2" fill="currentColor" />
    </g>,
    "Redux"
  ),
  MySQL: svg(
    <g>
      <path d="M5 15c1.5 2.2 4.5 4 7 4s5.5-1.8 7-4" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M7 9c1-2 3.5-3 5-3s4 1 5 3" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </g>,
    "MySQL"
  ),
  Datadog: svg(
    <g>
      <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M9 9h6M9 13h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </g>,
    "Datadog"
  ),
  Grafana: svg(
    <g>
      <path d="M12 2.5l1.4 2.8 2.8-.8.3 3 3 .8-1.5 2.7 2.2 2-2.5 1.7.5 3-2.9.5-1 2.8H12l-2.3-1.6-2.9.5.5-3-2.5-1.7 2.2-2L5.5 8.3l3-.8.3-3 2.8.8z" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinejoin="round" />
      <path d="M14.5 10.5a3 3 0 1 0-1 3.5c-.3-.8-.2-1.5.3-2s1.2-.7 2-.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </g>,
    "Grafana"
  ),
  GCP: svg(
    <g>
      <polygon points="12 4 19 8 19 16 12 20 5 16 5 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.3" fill="none" />
    </g>,
    "GCP"
  ),
  Azure: svg(
    <g>
      <path d="M6 18L11 4h2l5 14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M8 13h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </g>,
    "Azure"
  ),
  Docker: svg(
    <g>
      <path d="M3 12h4v-3h3V6h4v3h3v3h4" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <rect x="8" y="9" width="3" height="3" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="11" y="9" width="3" height="3" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="11" y="6" width="3" height="3" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M4 15c2 3 6 5 10 4s5-4 6-5" stroke="currentColor" strokeWidth="1.3" fill="none" />
    </g>,
    "Docker"
  ),
  Figma: svg(
    <g>
      <circle cx="15" cy="9" r="3" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <path d="M9 3h3v6H9a3 3 0 0 1 0-6zM9 9h3v6H9a3 3 0 0 1 0-6z" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <path d="M9 15h3v3a3 3 0 0 1-3 0v-3z" stroke="currentColor" strokeWidth="1.3" fill="none" />
    </g>,
    "Figma"
  ),
  "HTML/CSS": svg(
    <g>
      <path d="M4 3l1.5 17L12 22l6.5-2L20 3z" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <path d="M8 7h8l-.5 5H9.5L9 16l3 1 3-1" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>,
    "HTML/CSS"
  ),
  Git: svg(
    <g>
      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <circle cx="17" cy="7" r="2" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <path d="M7 9v6M9 7h6" stroke="currentColor" strokeWidth="1.3" />
    </g>,
    "Git"
  ),
  Jira: svg(
    <g>
      <path d="M12 3L3 12l9 9 9-9z" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </g>,
    "Jira"
  ),
  Linux: svg(
    <g>
      <ellipse cx="12" cy="10" rx="4" ry="5" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <circle cx="10.5" cy="9" r="0.7" fill="currentColor" />
      <circle cx="13.5" cy="9" r="0.7" fill="currentColor" />
      <path d="M10 12h4M8 17c1 2 3 3 4 3s3-1 4-3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </g>,
    "Linux"
  ),
  REST: svg(
    <g>
      <path d="M4 8h16M4 12h16M4 16h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" />
    </g>,
    "REST"
  ),
};

const fallbackIcon = (name: string) => (
  <span className="tech-icon-fallback" aria-hidden="true">
    {name.slice(0, 2).toUpperCase()}
  </span>
);

export const TechIcon: FC<TechIconProps> = ({ name, size = "md" }) => (
  <span className={`tech-icon ${size === "sm" ? "tech-icon--sm" : ""}`} title={name} data-tech={name}>
    {iconMap[name] ?? fallbackIcon(name)}
  </span>
);
