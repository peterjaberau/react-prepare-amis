import { ActionRow } from '@grafana-module/app/features/search/page/components/ActionRow';
import { getGrafanaSearcher } from '@grafana-module/app/features/search/service/searcher';
import { useSearchStateManager } from '@grafana-module/app/features/search/state/SearchStateManager';

export function BrowseFilters() {
  const [searchState, stateManager] = useSearchStateManager();

  return (
    <ActionRow
      showStarredFilter
      showLayout
      state={searchState}
      getTagOptions={stateManager.getTagOptions}
      getSortOptions={getGrafanaSearcher().getSortOptions}
      sortPlaceholder={getGrafanaSearcher().sortPlaceholder}
      onLayoutChange={stateManager.onLayoutChange}
      onStarredFilterChange={stateManager.onStarredFilterChange}
      onSortChange={stateManager.onSortChange}
      onTagFilterChange={stateManager.onTagFilterChange}
      onDatasourceChange={stateManager.onDatasourceChange}
      onPanelTypeChange={stateManager.onPanelTypeChange}
      onSetIncludePanels={stateManager.onSetIncludePanels}
    />
  );
}
