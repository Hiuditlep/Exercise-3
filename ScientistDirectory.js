// ScientistDirectory.js
import { createElement } from "./mini-react.js";
import { useState } from "./reactive-engine.js";

// Bộ dữ liệu chuẩn với ID ổn định
export const SMART_PEOPLE = [
  { id: "sp-1", name: "Johann Goethe", age: 82, iq: 210 },
  { id: "sp-2", name: "Albert Einstein", age: 76, iq: 205 },
  { id: "sp-3", name: "Leonardo da Vinci", age: 67, iq: 180 },
  { id: "sp-4", name: "Isaac Newton", age: 84, iq: 190 },
  { id: "sp-5", name: "James Maxwell", age: 48, iq: 190 },
  { id: "sp-6", name: "William Sidis", age: 46, iq: 200 },
];

export function ScientistDirectory(props = {}) {
  const initialData = props.initialData || SMART_PEOPLE;

  // Quản lý trạng thái độc lập
  const [people, setPeople] = useState(initialData);
  const [query, setQuery] = useState("");
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState("iq-desc");

  return createElement("section", { "aria-label": "Pioneer Directory" });
}
