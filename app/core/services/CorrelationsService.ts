import { DataFrame, TimeRange } from '@data/index';
import type { CorrelationData, CorrelationsService as CorrelationsServiceInterface } from '@runtime/index';
import { attachCorrelationsToDataFrames, getCorrelationsBySourceUIDs } from '~/features/correlations/utils';
import { exploreDataLinkPostProcessorFactory } from '~/features/explore/utils/links';

export class CorrelationsService implements CorrelationsServiceInterface {
  attachCorrelationsToDataFrames(
    dataFrames: DataFrame[],
    correlations: CorrelationData[],
    dataFrameRefIdToDataSourceUid: Record<string, string>
  ) {
    return attachCorrelationsToDataFrames(dataFrames, correlations, dataFrameRefIdToDataSourceUid);
  }

  correlationsDataLinkPostProcessorFactory(timeRange: TimeRange) {
    return exploreDataLinkPostProcessorFactory(undefined, timeRange);
  }

  getCorrelationsBySourceUIDs(sourceUIDs: string[]) {
    return getCorrelationsBySourceUIDs(sourceUIDs);
  }
}
