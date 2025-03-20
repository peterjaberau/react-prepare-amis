
import * as ui from "../..";

export const pluginVersion = "11.6.0-pre";

export interface Options
  extends ui.OptionsWithLegend,
    ui.OptionsWithTooltip,
    ui.OptionsWithTimezones {
  /**
   * Controls value alignment on the timelines
   */
  alignValue?: ui.TimelineValueAlignment;
  /**
   * Merge equal consecutive values
   */
  mergeValues?: boolean;
  /**
   * Enables pagination when > 0
   */
  perPage?: number;
  /**
   * Controls the row height
   */
  rowHeight: number;
  /**
   * Show timeline values on chart
   */
  showValue: ui.VisibilityMode;
}

export const defaultOptions: Partial<Options> = {
  alignValue: "left",
  mergeValues: true,
  perPage: 20,
  rowHeight: 0.9,
  showValue: ui.VisibilityMode.Auto,
};

export interface FieldConfig extends ui.AxisConfig, ui.HideableFieldConfig {
  fillOpacity?: number;
  lineWidth?: number;
}

export const defaultFieldConfig: Partial<FieldConfig> = {
  fillOpacity: 70,
  lineWidth: 0,
};
