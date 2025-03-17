// import * as jQuery from "jquery";
// window.$ = window.jQuery = jQuery;

import "@grafana-module/vendor/flot/jquery.flot.js";
import "@grafana-module/vendor/flot/jquery.flot.selection.js";
import "@grafana-module/vendor/flot/jquery.flot.time.js";
import "@grafana-module/vendor/flot/jquery.flot.stack.js";
import "@grafana-module/vendor/flot/jquery.flot.stackpercent.js";
import "@grafana-module/vendor/flot/jquery.flot.fillbelow.js";
import "@grafana-module/vendor/flot/jquery.flot.crosshair.js";
import "@grafana-module/vendor/flot/jquery.flot.dashes.js";
import "@grafana-module/vendor/flot/jquery.flot.gauge.js";

window.__grafana_app_bundle_loaded = true;

import app from "./app";


export const prepareInit = async () => {
  return Promise.resolve();
};

prepareInit().then(() => {
  app.init();
});
