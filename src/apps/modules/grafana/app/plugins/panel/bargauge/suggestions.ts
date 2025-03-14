import { VisualizationSuggestionsBuilder, VizOrientation } from '@data/index';
import { BarGaugeDisplayMode } from '@grafana-ui/index';
import { SuggestionName } from '@grafana-module/app/types/suggestions';

import { Options } from './panelcfg';

export class BarGaugeSuggestionsSupplier {
  getSuggestionsForData(builder: VisualizationSuggestionsBuilder) {
    const { dataSummary } = builder;

    if (!dataSummary.hasData || !dataSummary.hasNumberField) {
      return;
    }

    const list = builder.getListAppender<Options, {}>({
      name: '',
      pluginId: 'bargauge',
      options: {},
      fieldConfig: {
        defaults: {
          custom: {},
        },
        overrides: [],
      },
    });

    // This is probably not a good option for many numeric fields
    if (dataSummary.numberFieldCount > 50) {
      return;
    }

    // To use show individual row values we also need a string field to give each value a name
    if (dataSummary.hasStringField && dataSummary.frameCount === 1 && dataSummary.rowCountTotal < 30) {
      list.append({
        name: SuggestionName.BarGaugeBasic,
        options: {
          reduceOptions: {
            values: true,
            calcs: [],
          },
          displayMode: BarGaugeDisplayMode.Basic,
          orientation: VizOrientation.Horizontal,
        },
        fieldConfig: {
          defaults: {
            color: {
              mode: 'continuous-GrYlRd',
            },
          },
          overrides: [],
        },
      });

      list.append({
        name: SuggestionName.BarGaugeLCD,
        options: {
          reduceOptions: {
            values: true,
            calcs: [],
          },
          displayMode: BarGaugeDisplayMode.Lcd,
          orientation: VizOrientation.Horizontal,
        },
        fieldConfig: {
          defaults: {
            color: {
              mode: 'continuous-GrYlRd',
            },
          },
          overrides: [],
        },
      });
    } else {
      list.append({
        name: SuggestionName.BarGaugeBasic,
        options: {
          displayMode: BarGaugeDisplayMode.Basic,
          orientation: VizOrientation.Horizontal,
          reduceOptions: {
            values: false,
            calcs: ['lastNotNull'],
          },
        },
        fieldConfig: {
          defaults: {
            color: {
              mode: 'continuous-GrYlRd',
            },
          },
          overrides: [],
        },
      });

      list.append({
        name: SuggestionName.BarGaugeLCD,
        options: {
          displayMode: BarGaugeDisplayMode.Lcd,
          orientation: VizOrientation.Horizontal,
          reduceOptions: {
            values: false,
            calcs: ['lastNotNull'],
          },
        },
        fieldConfig: {
          defaults: {
            color: {
              mode: 'continuous-GrYlRd',
            },
          },
          overrides: [],
        },
      });
    }
  }
}
