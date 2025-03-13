import { VisualizationSuggestionsBuilder, VisualizationSuggestionScore } from '@data/index';
import { config } from '@runtime/index';
import { SuggestionName } from '@grafana-module/app/types/suggestions';

import { prepareCandlestickFields } from './fields';
import { defaultOptions, Options } from './types';

export class CandlestickSuggestionsSupplier {
  getSuggestionsForData(builder: VisualizationSuggestionsBuilder) {
    const { dataSummary } = builder;

    if (
      !builder.data?.series ||
      !dataSummary.hasData ||
      dataSummary.timeFieldCount < 1 ||
      dataSummary.numberFieldCount < 2 ||
      dataSummary.numberFieldCount > 10
    ) {
      return;
    }

    const info = prepareCandlestickFields(builder.data.series, defaultOptions, config.theme2);
    if (!info) {
      return;
    }

    // Regular timeseries
    if (info.open === info.high && info.open === info.low) {
      return;
    }

    const list = builder.getListAppender<Options, {}>({
      name: '',
      pluginId: 'candlestick',
      options: {},
      fieldConfig: {
        defaults: {
          custom: {},
        },
        overrides: [],
      },
    });

    list.append({
      name: SuggestionName.Candlestick,
      options: defaultOptions,
      fieldConfig: {
        defaults: {},
        overrides: [],
      },
      score: info.autoOpenClose ? VisualizationSuggestionScore.Good : VisualizationSuggestionScore.Best,
    });
  }
}
