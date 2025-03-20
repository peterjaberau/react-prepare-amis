import { ActionRow } from '~/features/search/page/components/ActionRow';
import { getGrafanaSearcher } from '~/features/search/service/searcher';
import { useSearchStateManager } from '~/features/search/state/SearchStateManager';

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
