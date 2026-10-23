// PubgMatchTelemetry.js
import { createElement } from "./mini-react.js";
import { useState } from "./reactive-engine.js";

// Bộ dữ liệu đội tuyển PUBG Vietnam Series
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

// Biến lưu giữ controller hiện tại để hủy khi switch squad
let activeAbortController = null;

export function fetchKraftonPubgTelemetry(squadId, { signal }) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      // Giả lập 35% packet loss từ trạm KRAFTON Satellite
      if (Math.random() < 0.35) {
        reject(new Error("Packet loss 35% từ trạm vệ tinh KRAFTON."));
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
  const [retryTick, setRetryTick] = useState(0);

  // Kích hoạt FSM Fetching kết hợp AbortController
  const startTelemetryStream = (squadId) => {
    if (activeAbortController) {
      activeAbortController.abort(); // Hủy request đang dang dở trước đó
    }

    const controller = new AbortController();
    activeAbortController = controller;

    setView({ status: "LOADING", data: null, error: null });

    fetchKraftonPubgTelemetry(squadId, { signal: controller.signal })
      .then((payload) => {
        setView({ status: "SUCCESS", data: payload, error: null });
      })
      .catch((err) => {
        // Safe AbortError Guard: Tránh flash lỗi giả mạo khi user chuyển tab nhanh
        if (err.name === "AbortError") return;
        setView({ status: "ERROR", data: null, error: err.message });
      });
  };

  return createElement("section", { "aria-label": "PUBG Telemetry Hub" });
}
