import type { CSSProperties, FC } from "react";
import { Icon } from "@iconify/react";

type TechIconProps = {
  name: string;
  size?: "sm" | "md";
};

type IconConfig = {
  icon: string;
  color?: string;
};

const iconMap = {
  React: { icon: "simple-icons:react", color: "#61DAFB" },
  TypeScript: { icon: "simple-icons:typescript", color: "#3178C6" },
  JavaScript: { icon: "simple-icons:javascript", color: "#F7DF1E" },
  GraphQL: { icon: "simple-icons:graphql", color: "#E10098" },
  "Node.js": { icon: "simple-icons:nodedotjs", color: "#5FA04E" },
  MongoDB: { icon: "simple-icons:mongodb", color: "#47A248" },
  Express: { icon: "simple-icons:express", color: "#000000" },
  AWS: { icon: "simple-icons:amazonwebservices", color: "#FF9900" },
  DynamoDB: { icon: "devicon:dynamodb" },
  Angular: { icon: "simple-icons:angular", color: "#0F0F11" },
  Vue: { icon: "simple-icons:vuedotjs", color: "#4FC08D" },
  Vuetify: { icon: "simple-icons:vuetify", color: "#1867C0" },
  Nuxt: { icon: "simple-icons:nuxt", color: "#00DC82" },
  Python: { icon: "simple-icons:python", color: "#3776AB" },
  PostgreSQL: { icon: "simple-icons:postgresql", color: "#4169E1" },
  Postman: { icon: "simple-icons:postman", color: "#FF6C37" },
  Redux: { icon: "simple-icons:redux", color: "#764ABC" },
  MySQL: { icon: "simple-icons:mysql", color: "#4479A1" },
  Datadog: { icon: "simple-icons:datadog", color: "#632CA6" },
  Grafana: { icon: "simple-icons:grafana", color: "#F46800" },
  GCP: { icon: "simple-icons:googlecloud", color: "#4285F4" },
  Azure: { icon: "simple-icons:microsoftazure", color: "#0078D4" },
  Docker: { icon: "simple-icons:docker", color: "#2496ED" },
  Figma: { icon: "simple-icons:figma", color: "#F24E1E" },
  "HTML/CSS": { icon: "simple-icons:html5", color: "#E34F26" },
  Git: { icon: "simple-icons:git", color: "#F05032" },
  Jira: { icon: "simple-icons:jira", color: "#0052CC" },
  Linux: { icon: "simple-icons:linux", color: "#FCC624" },
  REST: { icon: "devicon:openapi" },
  Sentry: { icon: "simple-icons:sentry", color: "#362D59" },
} satisfies Record<string, IconConfig>;

const getFallbackLabel = (name: string) => {
  const compact = name.replace(/[^a-z0-9]/gi, "");
  return compact.slice(0, 3).toUpperCase();
};

const iconStyle = (icon: IconConfig | undefined): CSSProperties | undefined =>
  icon?.color ? ({ "--tech-icon-color": icon.color } as CSSProperties) : undefined;

const renderFallback = (name: string) => (
  <span className="tech-icon-fallback" aria-hidden="true">
    {getFallbackLabel(name)}
  </span>
);

export const TechIcon: FC<TechIconProps> = ({ name, size = "md" }) => {
  const icon = iconMap[name];

  return (
    <span
      className={`tech-icon ${size === "sm" ? "tech-icon--sm" : ""}`}
      title={name}
      data-tech={name}
      style={iconStyle(icon)}
    >
      {icon ? (
        <Icon icon={icon.icon} className="tech-icon-svg" aria-hidden="true" />
      ) : (
        renderFallback(name)
      )}
    </span>
  );
};
