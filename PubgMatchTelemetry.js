// PubgMatchTelemetry.js
import { createElement } from "./mini-react.js";
import { useState } from "./reactive-engine.js";

export const PUBG_VN_SQUADS = [
  {
    id: "ces",
    name: "Cerberus Esports",
    map: "Erangel",
    phase: "Phase 6",
    alive: 4,
    kills: 14,
    wwcdProb: "68%",
    status: "In Safe Zone",
  },
  {
    id: "te",
    name: "The Expendables",
    map: "Miramar",
    phase: "Phase 7",
    alive: 4,
    kills: 18,
    wwcdProb: "82%",
    status: "Holding High Ground",
  },
  {
    id: "ge",
    name: "Genius Esports",
    map: "Taego",
    phase: "Phase 5",
    alive: 3,
    kills: 9,
    wwcdProb: "41%",
    status: "Rotating Blue Zone",
  },
];

let activeAbortController = null;

export function fetchKraftonPubgTelemetry(squadId, { signal }) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (Math.random() < 0.35) {
        reject(new Error("Packet loss 35% từ trạm mặt đất KRAFTON Satellite."));
        return;
      }
      const squad = PUBG_VN_SQUADS.find((s) => s.id === squadId);
      if (squad) resolve(squad);
      else reject(new Error("Không tìm thấy thông tin Squad."));
    }, 1200);

    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Request aborted by user", "AbortError"));
    });
  });
}

export function PubgMatchTelemetry(props = {}) {
  const initialSquad = props.squadId || "te";

  const [activeSquad, setActiveSquad] = useState(initialSquad);
  const [view, setView] = useState({ status: "IDLE", data: null, error: null });

  const triggerFetch = (squadId) => {
    if (activeAbortController) {
      activeAbortController.abort();
    }

    const controller = new AbortController();
    activeAbortController = controller;

    setView({ status: "LOADING", data: null, error: null });

    fetchKraftonPubgTelemetry(squadId, { signal: controller.signal })
      .then((payload) => {
        setView({ status: "SUCCESS", data: payload, error: null });
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setView({ status: "ERROR", data: null, error: err.message });
      });
  };

  const handleSelectSquad = (id) => {
    setActiveSquad(id);
    triggerFetch(id);
  };

  const handleRetry = () => {
    triggerFetch(activeSquad);
  };

  // 1. Thanh chuyển chọn Squad
  const squadButtons = PUBG_VN_SQUADS.map((s) =>
    createElement(
      "button",
      {
        type: "button",
        className: `btn-squad ${activeSquad === s.id ? "active" : ""}`,
        onClick: () => handleSelectSquad(s.id),
      },
      s.name,
    ),
  );

  const headerNode = createElement(
    "header",
    { className: "telemetry-header" },
    createElement("h3", null, "KRAFTON PVS Live Telemetry Radar"),
    createElement(
      "nav",
      { "aria-label": "Select Squad", className: "squad-nav" },
      ...squadButtons,
    ),
  );

  // 2. Nội dung chính theo 4 trạng thái FSM
  let contentNode = null;

  if (view.status === "IDLE") {
    contentNode = createElement(
      "section",
      { className: "telemetry-idle" },
      createElement(
        "p",
        null,
        "Radar đang chờ lệnh. Nhấn vào Squad để quét dữ liệu vệ tinh.",
      ),
      createElement(
        "button",
        {
          type: "button",
          className: "btn-launch",
          onClick: () => handleSelectSquad(activeSquad),
        },
        "Launch Radar",
      ),
    );
  } else if (view.status === "LOADING") {
    // Blue-Zone 220px pulsing skeleton card chống CLS
    contentNode = createElement(
      "section",
      { className: "telemetry-skeleton", "aria-busy": "true" },
      createElement(
        "p",
        null,
        "Syncing KRAFTON Radar with Erangel/Miramar Satellites...",
      ),
    );
  } else if (view.status === "ERROR") {
    // Accessible alert box thay thế hoàn toàn window.alert()
    contentNode = createElement(
      "section",
      { role: "alert", className: "telemetry-error" },
      createElement("p", null, `Blue-Zone Link Lost: ${view.error}`),
      createElement(
        "button",
        { type: "button", className: "btn-retry", onClick: handleRetry },
        "Reconnect Satellite (Retry)",
      ),
    );
  } else if (view.status === "SUCCESS" && view.data) {
    // Hiển thị dữ liệu trực tiếp với aria-live
    contentNode = createElement(
      "article",
      { className: "telemetry-card", "aria-live": "polite" },
      createElement("h4", null, view.data.name),
      createElement(
        "p",
        null,
        `Bản đồ tác chiến: ${view.data.map} (${view.data.phase})`,
      ),
      createElement(
        "p",
        null,
        `Chỉ số hạ gục: ${view.data.kills} Kills | Còn sống: ${view.data.alive}/4 thành viên`,
      ),
      createElement("p", null, `Xác suất WWCD: ${view.data.wwcdProb}`),
      createElement(
        "p",
        { className: "squad-status" },
        `Trạng thái: ${view.data.status}`,
      ),
    );
  }

  return createElement(
    "section",
    {
      className: "pubg-telemetry-container",
      "aria-label": "KRAFTON PUBG VN Telemetry",
    },
    headerNode,
    createElement("main", { className: "telemetry-viewport" }, contentNode),
  );
}
