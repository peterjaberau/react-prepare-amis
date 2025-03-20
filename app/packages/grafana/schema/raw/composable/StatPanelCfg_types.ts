
import * as common from '@schema';

export const pluginVersion = "11.6.0-pre";

export interface Options extends common.SingleStatBaseOptions {
  colorMode: common.BigValueColorMode;
  graphMode: common.BigValueGraphMode;
  justifyMode: common.BigValueJustifyMode;
  percentChangeColorMode: common.PercentChangeColorMode;
  showPercentChange: boolean;
  textMode: common.BigValueTextMode;
  wideLayout: boolean;
}

export const defaultOptions: Partial<Options> = {
  colorMode: common.BigValueColorMode.Value,
  graphMode: common.BigValueGraphMode.Area,
  justifyMode: common.BigValueJustifyMode.Auto,
  percentChangeColorMode: common.PercentChangeColorMode.Standard,
  showPercentChange: false,
  textMode: common.BigValueTextMode.Auto,
  wideLayout: true,
};
