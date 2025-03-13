import { css } from '@emotion/react';

import { GrafanaTheme2 } from '@data/index';

import { skeletonAnimation } from '../../utils/skeleton';

export const getSkeletonStyles = (theme: GrafanaTheme2) => {
  return css({
    '.react-loading-skeleton': skeletonAnimation,
  });
};
