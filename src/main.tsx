import { createRoot } from "react-dom/client";
import 'react18-json-view/src/style.css'
import App from "./App";
import { RootMachineProvider } from "@/machines/RootMachineContext";
import { ReactGridLayoutProvider } from "@/apps/modules/react-grid-layout/machines/ReactGridLayoutMachineContext";
import { MachineProviderRGL } from "@/apps/modules/react-grid-layout-refactor/stories/machines/machineContextRGL.tsx";
// import { MachineProviderGridstack } from "@/apps/modules/gridstack/machines/machineContextGridstack.tsx";

import * as $ from 'jquery';
import 'flot';

// Expose jQuery globally
// @ts-ignore
window.$ = window.jQuery = $;
window.__grafana_public_path__ = 'src/apps/modules/grafana/';

const agent = navigator.userAgent.toLowerCase();

const isWindows = ["windows", "win32", "wow32", "win64", "wow64"].some((item) =>
  agent.match(item),
);
const keys = isWindows ? "Alt + Shift" : "⌥option + Shift";
createRoot(document.getElementById("root")!).render(
  <RootMachineProvider>
    {/*<MachineProviderGridstack>*/}
      <MachineProviderRGL>
        <ReactGridLayoutProvider>
          <App />
        </ReactGridLayoutProvider>
      </MachineProviderRGL>
    {/*</MachineProviderGridstack>*/}
  </RootMachineProvider>,
);
