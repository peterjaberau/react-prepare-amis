

import { AreaChartColorScheme } from '../components/Visualisations/Chart/Chart.interface';
import { GREEN_3, RED_3, YELLOW_2 } from './Color.constants';
import { WHITE_COLOR } from './constants';

export const CHART_BASE_SIZE = 300;

export const ABORTED_CHART_COLOR_SCHEME: AreaChartColorScheme = {
  gradientEndColor: WHITE_COLOR,
  gradientStartColor: YELLOW_2,
  strokeColor: YELLOW_2,
};

export const FAILED_CHART_COLOR_SCHEME: AreaChartColorScheme = {
  gradientEndColor: WHITE_COLOR,
  gradientStartColor: RED_3,
  strokeColor: RED_3,
};

export const SUCCESS_CHART_COLOR_SCHEME: AreaChartColorScheme = {
  gradientEndColor: WHITE_COLOR,
  gradientStartColor: GREEN_3,
  strokeColor: GREEN_3,
};
