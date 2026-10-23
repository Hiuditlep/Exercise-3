// DeveloperCard.js
import { createElement } from "./mini-react.js";

export function DeveloperCard(props = {}) {
  const fullName = props.fullName || "Tran Vinh Khiem";
  const role = props.role || "Senior Systems Architect • UIT S3T";
  const avatarUrl =
    props.avatarUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240";
  const metrics = props.metrics || {
    commits: 512,
    vdomNodes: 0,
    a11yScore: 100,
  };
  const skills = props.skills || [
    { id: "sk-1", name: "React 19 Fiber", tier: "Core" },
  ];

  // 1. Header chứa avatar và hgroup
  const headerNode = createElement(
    "header",
    { className: "card-header" },
    createElement("img", {
      src: avatarUrl,
      alt: fullName,
      width: "64",
      height: "64",
      className: "avatar",
    }),
    createElement(
      "hgroup",
      null,
      createElement("h2", { id: "dev-heading" }, fullName),
      createElement("p", null, role),
    ),
  );

  // 2. Danh sách mô tả <dl> cho key-value metrics
  const metricItems = [];
  Object.entries(metrics).forEach(([k, v]) => {
    metricItems.push(createElement("dt", null, k));
    metricItems.push(createElement("dd", null, String(v)));
  });
  const dlNode = createElement(
    "dl",
    { className: "card-metrics" },
    ...metricItems,
  );

  // 3. Danh sách <ul> kỹ năng
  const skillItems = skills.map((s) =>
    createElement("li", null, `${s.name} (${s.tier})`),
  );
  const ulNode = createElement(
    "ul",
    { className: "card-skills", "aria-label": "Engineered Skills" },
    ...skillItems,
  );

  // 4. Bọc trong thẻ <article> duy nhất (Strict Zero Div-Soup)
  return createElement(
    "article",
    { className: "developer-card", "aria-labelledby": "dev-heading" },
    headerNode,
    dlNode,
    ulNode,
  );
}
