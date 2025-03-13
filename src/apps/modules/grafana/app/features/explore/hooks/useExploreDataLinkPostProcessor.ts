import { useMemo } from 'react';

import { SplitOpen, TimeRange } from '@data/index';

import { exploreDataLinkPostProcessorFactory } from '../utils/links';

export const useExploreDataLinkPostProcessor = (splitOpenFn: SplitOpen, timeRange: TimeRange) => {
  return useMemo(() => {
    return exploreDataLinkPostProcessorFactory(splitOpenFn, timeRange);
  }, [splitOpenFn, timeRange]);
};
