import * as jQuery from "jquery";
window.$ = window.jQuery = jQuery;



import "@grafana-module/vendor/flot/jquery.flot.js";
import "@grafana-module/vendor/flot/jquery.flot.selection.js";
import "@grafana-module/vendor/flot/jquery.flot.time.js";
import "@grafana-module/vendor/flot/jquery.flot.stack.js";
import "@grafana-module/vendor/flot/jquery.flot.stackpercent.js";
import "@grafana-module/vendor/flot/jquery.flot.fillbelow.js";
import "@grafana-module/vendor/flot/jquery.flot.crosshair.js";
import "@grafana-module/vendor/flot/jquery.flot.dashes.js";
import "@grafana-module/vendor/flot/jquery.flot.gauge.js";
import "@/apps/modules/grafana/app/index";


import App from "./App";
import { RootMachineProvider } from "@/machines/RootMachineContext";
import { ReactGridLayoutProvider } from "@/apps/modules/react-grid-layout/machines/ReactGridLayoutMachineContext";
import { MachineProviderRGL } from "@/apps/modules/react-grid-layout-refactor/stories/machines/machineContextRGL.tsx";
// import { MachineProviderGridstack } from "@/apps/modules/gridstack/machines/machineContextGridstack.tsx";

// import "@grafana-module/app/index";


//
// window.__grafana_public_path__ = "src/apps/modules/grafana/";
// window.__grafana_app_bundle_loaded = true;
//
//
// const agent = navigator.userAgent.toLowerCase();
//
// const isWindows = ["windows", "win32", "wow32", "win64", "wow64"].some((item) =>
//   agent.match(item),
// );

// import app from "@/apps/modules/grafana/app/app";

// prepareInit().then(async () => {
//   app.init();
//
//   console.log('window.__grafana_public_path__', window.__grafana_public_path__);
//   console.log('window.__grafana_app_bundle_loaded', window.__grafana_app_bundle_loaded);
//   console.log('window.grafanaBootData', window.grafanaBootData);
//   console.log('window.grafanaBootData.assets.dark', window.grafanaBootData?.assets.dark);
//   console.log('window.grafanaBootData.assets.light', window.grafanaBootData?.assets.light);
//   console.log('window.grafanaBootData.user.lightTheme', window.grafanaBootData?.user.lightTheme);
//   console.log('window.__grafana_load_failed', window?.__grafana_load_failed);
//
//   console.log('window.__webpack_nonce__', window.nonce);
// });

//
// const keys = isWindows ? "Alt + Shift" : "⌥option + Shift";
// createRoot(document.getElementById("root")!).render(
//   <RootMachineProvider>
//     {/*<MachineProviderGridstack>*/}
//       <MachineProviderRGL>
//         <ReactGridLayoutProvider>
//           <App />
//         </ReactGridLayoutProvider>
//       </MachineProviderRGL>
//     {/*</MachineProviderGridstack>*/}
//   </RootMachineProvider>,
// );
