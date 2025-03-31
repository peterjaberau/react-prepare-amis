

import { EntityFields } from '../../enums/AdvancedSearch.enum';
import { SearchIndex } from '../../enums/search.enum';
import { Aggregations } from '../../interface/search.interface';
import { ExploreQuickFilterField } from './ExplorePage.interface';

export interface ExploreQuickFiltersProps {
  index: SearchIndex;
  fields: Array<ExploreQuickFilterField>;
  aggregations?: Aggregations;
  onFieldValueSelect: (field: ExploreQuickFilterField) => void;
  onAdvanceSearch?: () => void;
  showDeleted?: boolean;
  onChangeShowDeleted?: (showDeleted: boolean) => void;
  independent?: boolean; // flag to indicate if the filters are independent of aggregations
  fieldsWithNullValues?: EntityFields[];
  defaultQueryFilter?: Record<string, unknown>;
}
