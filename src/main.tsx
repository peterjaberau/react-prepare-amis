import { createRoot } from "react-dom/client";
import App from "./App";
import { RootMachineProvider } from "@/machines/RootMachineContext";
import { ReactGridLayoutProvider } from "@/apps/modules/react-grid-layout/machines/ReactGridLayoutMachineContext";
import { MachineProviderRGL } from "@/apps/modules/react-grid-layout-refactor/stories/machines/machineContextRGL.tsx";

const agent = navigator.userAgent.toLowerCase();

const isWindows = ["windows", "win32", "wow32", "win64", "wow64"].some((item) =>
  agent.match(item),
);
const keys = isWindows ? "Alt + Shift" : "⌥option + Shift";
createRoot(document.getElementById("root")!).render(
  <RootMachineProvider>
    <MachineProviderRGL>
      <ReactGridLayoutProvider>
        <App />
      </ReactGridLayoutProvider>
    </MachineProviderRGL>
  </RootMachineProvider>,
);
