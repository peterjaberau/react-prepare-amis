import { DataQueryRequest } from '@data/index';
import { isDataRequestEnricher, SceneObject } from '../core/types';

export function getEnrichedDataRequest(sourceRunner: SceneObject): Partial<DataQueryRequest> | null {
  const root = sourceRunner.getRoot();

  if (isDataRequestEnricher(root)) {
    return root.enrichDataRequest(sourceRunner);
  }

  return null;
}
