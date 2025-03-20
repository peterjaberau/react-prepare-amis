
import * as common from '../..';


export const pluginVersion = "11.6.0-pre";

export interface Options extends common.OptionsWithTimezones {
  legend: common.VizLegendOptions;
  orientation?: common.VizOrientation;
  tooltip: common.VizTooltipOptions;
}

export interface FieldConfig extends common.GraphFieldConfig {}
