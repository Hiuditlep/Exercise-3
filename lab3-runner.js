// lab3-runner.js
import { createElement } from "./mini-react.js";
import { renderApp, attachRootListener } from "./reactive-engine.js";
import { DeveloperCard } from "./DeveloperCard.js";
import { ScientistDirectory } from "./ScientistDirectory.js";
import { PubgMatchTelemetry } from "./PubgMatchTelemetry.js";

const root = document.getElementById("app");
attachRootListener(root);

function App() {
  return createElement(
    "main",
    null,
    DeveloperCard(),
    ScientistDirectory(),
    PubgMatchTelemetry(),
  );
}

renderApp(App, root);
