import * as jQuery from "jquery";
window.$ = window.jQuery = jQuery;

// import "@grafana-module/vendor/flot/jquery.flot.js";
// import "@grafana-module/vendor/flot/jquery.flot.selection.js";
// import "@grafana-module/vendor/flot/jquery.flot.time.js";
// import "@grafana-module/vendor/flot/jquery.flot.stack.js";
// import "@grafana-module/vendor/flot/jquery.flot.stackpercent.js";
// import "@grafana-module/vendor/flot/jquery.flot.fillbelow.js";
// import "@grafana-module/vendor/flot/jquery.flot.crosshair.js";
// import "@grafana-module/vendor/flot/jquery.flot.dashes.js";
// import "@grafana-module/vendor/flot/jquery.flot.gauge.js";

console.log(window.jQuery);
console.log(window.$);
import { createRoot } from "react-dom/client";
import "react18-json-view/src/style.css";
import App from "./App";

const agent = navigator.userAgent.toLowerCase();

const isWindows = ["windows", "win32", "wow32", "win64", "wow64"].some((item) =>
  agent.match(item),
);
const keys = isWindows ? "Alt + Shift" : "⌥option + Shift";
createRoot(document.getElementById("root")!).render(<App />);
