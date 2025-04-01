import { Edge, Node } from 'reactflow';
import { AddLineage } from '../../../generated/api/lineage/addLineage';
import { SourceType } from '../../SearchedData/SearchedData.interface';

export interface LineageDrawerProps {
  show: boolean;
  onCancel: () => void;
  selectedNode: SourceType;
}

export interface EdgeInfoDrawerInfo {
  edge: Edge;
  nodes: Node[];
  visible: boolean;
  hasEditAccess: boolean;
  onClose: () => void;
  onEdgeDetailsUpdate?: (updatedEdgeDetails: AddLineage) => Promise<void>;
}
type InfoType = {
  key: string;
  value: string | undefined;
  link?: string;
};

export type EdgeInformationType = {
  sourceData?: InfoType;
  targetData?: InfoType;
  pipeline?: InfoType;
  sourceColumn?: InfoType;
  targetColumn?: InfoType;
  functionInfo?: InfoType;
};
