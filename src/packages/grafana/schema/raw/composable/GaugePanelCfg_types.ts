
import * as common from '@schema';

export const pluginVersion = "11.6.0-pre";

export interface Options extends common.SingleStatBaseOptions {
  minVizHeight: number;
  minVizWidth: number;
  showThresholdLabels: boolean;
  showThresholdMarkers: boolean;
  sizing: common.BarGaugeSizing;
}

export const defaultOptions: Partial<Options> = {
  minVizHeight: 75,
  minVizWidth: 75,
  showThresholdLabels: false,
  showThresholdMarkers: true,
  sizing: common.BarGaugeSizing.Auto,
};
