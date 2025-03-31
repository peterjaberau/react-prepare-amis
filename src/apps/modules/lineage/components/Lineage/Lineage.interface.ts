import { EntityType } from '../../enums/entity.enum';
import { LineageDirection } from '../../generated/api/lineage/lineageDirection';
import { EntityReference } from '../../generated/entity/type';
import { ColumnLineage } from '../../generated/type/entityLineage';
import { SourceType } from '../SearchedData/SearchedData.interface';

export interface LineageProps {
  entityType: EntityType;
  deleted?: boolean;
  hasEditAccess: boolean;
  isFullScreen?: boolean;
  entity?: SourceType;
  isPlatformLineage?: boolean;
}

export interface EntityLineageResponse {
  entity: EntityReference;
  nodes?: EntityReference[];
  edges?: EdgeDetails[];
  downstreamEdges?: EdgeDetails[];
  upstreamEdges?: EdgeDetails[];
}

export interface EdgeFromToData {
  id: string;
  type: string;
  fullyQualifiedName?: string;
}

export interface EdgeDetails {
  fromEntity: EdgeFromToData;
  toEntity: EdgeFromToData;
  pipeline?: EntityReference;
  source?: string;
  sqlQuery?: string;
  columns?: ColumnLineage[];
  description?: string;
  pipelineEntityType?: EntityType.PIPELINE | EntityType.STORED_PROCEDURE;
  docId?: string;
  extraInfo?: EdgeDetails;
}

export type LineageSourceType = Omit<SourceType, 'service'> & {
  direction: string;
  depth: number;
};

export type NodeData = {
  entity: EntityReference;
  paging: {
    entityDownstreamCount?: number;
    entityUpstreamCount?: number;
  };
};

export type LineageData = {
  nodes: Record<string, NodeData>;
  downstreamEdges: Record<string, EdgeDetails>;
  upstreamEdges: Record<string, EdgeDetails>;
};

export interface LineageEntityReference extends EntityReference {
  paging?: {
    entityDownstreamCount?: number;
    entityUpstreamCount?: number;
  };
  pagination_data?: {
    index?: number;
    parentId?: string;
    childrenLength?: number;
  };
  expandPerformed?: boolean;
  direction?: LineageDirection;
}
