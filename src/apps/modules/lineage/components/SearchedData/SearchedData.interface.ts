import Qs from 'qs';
import { ReactNode } from 'react';
import { Style } from '../../generated/entity/data/glossaryTerm';
import { EntityReference } from '../../generated/entity/type';
import { TagLabel } from '../../generated/type/tagLabel';
import {
  APICollectionSearchSource,
  APIEndpointSearchSource,
  ContainerSearchSource,
  DashboardDataModelSearchSource,
  DashboardSearchSource,
  ExploreSearchSource,
  GlossarySearchSource,
  MetricSearchSource,
  MlmodelSearchSource,
  PipelineSearchSource,
  QuerySearchSource,
  SearchHitBody,
  SearchIndexSearchSource,
  StoredProcedureSearchSource,
  TableSearchSource,
  TagClassSearchSource,
  TeamSearchSource,
  TestCaseSearchSource,
  TopicSearchSource,
  UserSearchSource,
} from '../../interface/search.interface';

type Fields =
  | 'name'
  | 'fullyQualifiedName'
  | 'description'
  | 'serviceType'
  | 'displayName'
  | 'deleted'
  | 'service'
  | 'domain';

export type SourceType = (
  | Pick<
      TableSearchSource,
      Fields | 'usageSummary' | 'database' | 'databaseSchema' | 'tableType'
    >
  | Pick<TopicSearchSource, Fields>
  | Pick<ContainerSearchSource, Fields>
  | Pick<PipelineSearchSource, Fields>
  | Pick<DashboardDataModelSearchSource, Fields>
  | Pick<StoredProcedureSearchSource, Fields | 'storedProcedureCode'>
  | Pick<DashboardSearchSource | MlmodelSearchSource, Fields | 'usageSummary'>
  | Pick<SearchIndexSearchSource, Fields>
  | Pick<APICollectionSearchSource, Fields>
  | Pick<APIEndpointSearchSource, Fields>
  | Pick<
      MetricSearchSource,
      | 'name'
      | 'fullyQualifiedName'
      | 'description'
      | 'displayName'
      | 'deleted'
      | 'domain'
    >
  | Pick<
      Exclude<
        ExploreSearchSource,
        | TableSearchSource
        | DashboardSearchSource
        | MlmodelSearchSource
        | GlossarySearchSource
        | TagClassSearchSource
        | QuerySearchSource
        | UserSearchSource
        | TeamSearchSource
        | TestCaseSearchSource
        | SearchIndexSearchSource
        | StoredProcedureSearchSource
        | APICollectionSearchSource
        | APIEndpointSearchSource
        | MetricSearchSource
      >,
      Fields
    >
) & {
  id?: string;
  tier?: string | TagLabel;
  tags?: TagLabel[];
  entityType?: string;
  service?: EntityReference;
  style?: Style;
  owners?: Partial<
    Pick<
      EntityReference,
      'name' | 'displayName' | 'id' | 'type' | 'fullyQualifiedName' | 'deleted'
    >
  >[];
};

export interface SearchedDataProps {
  children?: ReactNode;
  selectedEntityId: string;
  data: any[];
  isLoading?: boolean;
  onPaginationChange: (value: number, pageSize?: number) => void;
  totalValue: number;
  fetchLeftPanel?: () => ReactNode;
  isSummaryPanelVisible: boolean;
  showResultCount?: boolean;
  isFilterSelected: boolean;
  handleSummaryPanelDisplay?: (
    details: SearchedDataProps['data'][number]['_source'],
    entityType: string
  ) => void;
  filter?: Qs.ParsedQs;
}
