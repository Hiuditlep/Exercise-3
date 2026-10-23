// lab3-runner.js
import { renderToDOM } from "./mini-react.js";
import { DeveloperCard } from "./DeveloperCard.js";

const root = document.getElementById("app");
const cardNode = DeveloperCard();
root.replaceChildren(renderToDOM(cardNode));
