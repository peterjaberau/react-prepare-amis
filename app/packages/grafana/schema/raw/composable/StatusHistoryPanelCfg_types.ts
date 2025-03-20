
import * as ui from '@schema';

export const pluginVersion = "11.6.0-pre";

export interface Options extends ui.OptionsWithLegend, ui.OptionsWithTooltip, ui.OptionsWithTimezones {
  /**
   * Controls the column width
   */
  colWidth?: number;
  /**
   * Enables pagination when > 0
   */
  perPage?: number;
  /**
   * Set the height of the rows
   */
  rowHeight: number;
  /**
   * Show values on the columns
   */
  showValue: ui.VisibilityMode;
}

export const defaultOptions: Partial<Options> = {
  colWidth: 0.9,
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
  lineWidth: 1,
};
