import { config } from '@runtime/index';

export const DEFAULT_RANGE = {
  from: `now-${config.exploreDefaultTimeOffset}`,
  to: 'now',
};
