import { VisualizationSuggestionsBuilder } from '@data/index';
import { checkFields } from '@flamegraph/index';
import { SuggestionName } from '@grafana-module/app/types/suggestions';

export class FlameGraphSuggestionsSupplier {
  getListWithDefaults(builder: VisualizationSuggestionsBuilder) {
    return builder.getListAppender<{}, {}>({
      name: SuggestionName.FlameGraph,
      pluginId: 'flamegraph',
    });
  }

  getSuggestionsForData(builder: VisualizationSuggestionsBuilder) {
    if (!builder.data) {
      return;
    }

    const dataFrame = builder.data.series[0];
    if (!dataFrame) {
      return;
    }
    const wrongFields = checkFields(dataFrame);
    if (wrongFields) {
      return;
    }

    this.getListWithDefaults(builder).append({
      name: SuggestionName.FlameGraph,
    });
  }
}
