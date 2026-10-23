// ScientistDirectory.js
import { createElement } from "./mini-react.js";
import { useState } from "./reactive-engine.js";

export const SMART_PEOPLE = [
  { id: "sp-1", name: "Johann Goethe", age: 82, iq: 210 },
  { id: "sp-2", name: "Albert Einstein", age: 76, iq: 205 },
  { id: "sp-3", name: "Leonardo da Vinci", age: 67, iq: 180 },
  { id: "sp-4", name: "Isaac Newton", age: 84, iq: 190 },
  { id: "sp-5", name: "James Maxwell", age: 48, iq: 190 },
  { id: "sp-6", name: "William Sidis", age: 46, iq: 200 },
  { id: "sp-7", name: "Nguyen Minh Hieu", age: 21, iq: 180 },
];

export function ScientistDirectory(props = {}) {
  const initialData = props.initialData || SMART_PEOPLE;

  const [people, setPeople] = useState(initialData);
  const [query, setQuery] = useState("");
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState("iq-desc");

  // Hàm xóa bất biến (Immutable deletion)
  const handleDelete = (id) => {
    setPeople(people.filter((p) => p.id !== id));
  };

  // Hàm khôi phục database ban đầu
  const handleReset = () => {
    setPeople(initialData);
    setQuery("");
    setMinIq(160);
    setSortBy("iq-desc");
  };

  // Derived state pipeline on-the-fly (Strict: Zero useEffect)
  const visible = people
    .filter(
      (p) =>
        p.name.toLowerCase().includes(query.trim().toLowerCase()) &&
        p.iq >= minIq,
    )
    .toSorted((a, b) => {
      if (sortBy === "iq-desc") return b.iq - a.iq;
      if (sortBy === "iq-asc") return a.iq - b.iq;
      if (sortBy === "age-desc") return b.age - a.age;
      return a.age - b.age;
    });

  // 1. Form tìm kiếm và lọc
  const formNode = createElement(
    "form",
    {
      role: "search",
      className: "directory-form",
      onSubmit: (e) => e.preventDefault(),
    },
    createElement("label", { htmlFor: "search-name" }, "Name: "),
    createElement("input", {
      id: "search-name",
      type: "search",
      value: query,
      onInput: (e) => setQuery(e.target.value),
    }),

    createElement("label", { htmlFor: "min-iq-input" }, "Min IQ: "),
    createElement("input", {
      id: "min-iq-input",
      type: "number",
      value: String(minIq),
      onInput: (e) => {
        const val = e.target.valueAsNumber;
        setMinIq(Number.isNaN(val) ? 0 : val);
      },
    }),

    createElement("label", { htmlFor: "sort-select" }, "Sort: "),
    createElement(
      "select",
      {
        id: "sort-select",
        value: sortBy,
        onChange: (e) => setSortBy(e.target.value),
      },
      createElement("option", { value: "iq-desc" }, "IQ (High → Low)"),
      createElement("option", { value: "iq-asc" }, "IQ (Low → High)"),
      createElement("option", { value: "age-desc" }, "Age (High → Low)"),
      createElement("option", { value: "age-asc" }, "Age (Low → High)"),
    ),

    createElement(
      "button",
      {
        type: "button",
        onClick: handleReset,
        className: "btn-reset",
      },
      "Reset Database",
    ),
  );

  // 2. Bộ đếm kết quả cho Screen-Reader
  const liveCounterNode = createElement(
    "output",
    {
      role: "status",
      "aria-live": "polite",
      className: "live-counter",
    },
    `Found ${visible.length} pioneers`,
  );

  // 3. Danh sách hiển thị
  const listItems = visible.map((p) =>
    createElement(
      "li",
      { key: p.id, className: "pioneer-item" },
      createElement("span", null, `${p.name} — Age: ${p.age} | IQ: ${p.iq}`),
      createElement(
        "button",
        {
          type: "button",
          "aria-label": `Delete ${p.name}`,
          onClick: () => handleDelete(p.id),
          className: "btn-delete",
        },
        "Delete",
      ),
    ),
  );

  const listNode = createElement(
    "ul",
    { className: "pioneer-list" },
    ...listItems,
  );

  return createElement(
    "section",
    {
      "aria-label": "Pioneer Directory",
      className: "directory-container",
    },
    formNode,
    liveCounterNode,
    listNode,
  );
}
