

import * as common from '@schema';

export const pluginVersion = "11.6.0-pre";

export interface Options extends common.OptionsWithLegend, common.SingleStatBaseOptions {
  displayMode: common.BarGaugeDisplayMode;
  maxVizHeight: number;
  minVizHeight: number;
  minVizWidth: number;
  namePlacement: common.BarGaugeNamePlacement;
  showUnfilled: boolean;
  sizing: common.BarGaugeSizing;
  valueMode: common.BarGaugeValueMode;
}

export const defaultOptions: Partial<Options> = {
  displayMode: common.BarGaugeDisplayMode.Gradient,
  maxVizHeight: 300,
  minVizHeight: 16,
  minVizWidth: 8,
  namePlacement: common.BarGaugeNamePlacement.Auto,
  showUnfilled: true,
  sizing: common.BarGaugeSizing.Auto,
  valueMode: common.BarGaugeValueMode.Color,
};
