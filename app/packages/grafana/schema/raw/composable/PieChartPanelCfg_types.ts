

import * as common from '@schema';

export const pluginVersion = "11.6.0-pre";

/**
 * Select the pie chart display style.
 */
export enum PieChartType {
  Donut = 'donut',
  Pie = 'pie',
}

/**
 * Select labels to display on the pie chart.
 *  - Name - The series or field name.
 *  - Percent - The percentage of the whole.
 *  - Value - The raw numerical value.
 */
export enum PieChartLabels {
  Name = 'name',
  Percent = 'percent',
  Value = 'value',
}

/**
 * Select values to display in the legend.
 *  - Percent: The percentage of the whole.
 *  - Value: The raw numerical value.
 */
export enum PieChartLegendValues {
  Percent = 'percent',
  Value = 'value',
}

export interface PieChartLegendOptions extends common.VizLegendOptions {
  values: Array<PieChartLegendValues>;
}

export const defaultPieChartLegendOptions: Partial<PieChartLegendOptions> = {
  values: [],
};

export interface Options extends common.OptionsWithTooltip, common.SingleStatBaseOptions {
  displayLabels: Array<PieChartLabels>;
  legend: PieChartLegendOptions;
  pieType: PieChartType;
}

export const defaultOptions: Partial<Options> = {
  displayLabels: [],
};

export interface FieldConfig extends common.HideableFieldConfig {}
