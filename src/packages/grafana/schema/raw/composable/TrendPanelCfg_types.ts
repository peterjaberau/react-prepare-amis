
import * as common from '@schema';

export const pluginVersion = "11.6.0-pre";

/**
 * Identical to timeseries... except it does not have timezone settings
 */
export interface Options {
  legend: common.VizLegendOptions;
  tooltip: common.VizTooltipOptions;
  /**
   * Name of the x field to use (defaults to first number)
   */
  xField?: string;
}

export interface FieldConfig extends common.GraphFieldConfig {}
