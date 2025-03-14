import { FieldColorModeId, FieldConfigSource, PanelModel } from '@data/index';
import { BigValueTextMode, BigValueGraphMode, BigValueColorMode } from '@schema/index';
import { sharedSingleStatPanelChangedHandler } from '@grafana-ui/index';

import { Options } from './panelcfg';

// This is called when the panel changes from another panel
export const statPanelChangedHandler = (
  panel: PanelModel<Partial<Options>>,
  prevPluginId: string,
  prevOptions: any
) => {
  // This handles most config changes
  const options: Options = sharedSingleStatPanelChangedHandler(panel, prevPluginId, prevOptions);

  // Changing from angular singlestat
  if (prevOptions.angular && (prevPluginId === 'singlestat' || prevPluginId === 'grafana-singlestat-panel')) {
    const oldOptions = prevOptions.angular;

    options.graphMode = BigValueGraphMode.None;
    if (oldOptions.sparkline && oldOptions.sparkline.show) {
      options.graphMode = BigValueGraphMode.Area;
    }

    if (oldOptions.colorBackground) {
      options.colorMode = BigValueColorMode.Background;
    } else if (oldOptions.colorValue) {
      options.colorMode = BigValueColorMode.Value;
    } else {
      options.colorMode = BigValueColorMode.None;
      if (oldOptions.sparkline?.lineColor && options.graphMode === BigValueGraphMode.Area) {
        const cfg: FieldConfigSource = panel.fieldConfig ?? {};
        cfg.defaults.color = {
          mode: FieldColorModeId.Fixed,
          fixedColor: oldOptions.sparkline.lineColor,
        };
        panel.fieldConfig = cfg;
      }
    }

    if (oldOptions.valueName === 'name') {
      options.textMode = BigValueTextMode.Name;
    }
  }

  return options;
};
