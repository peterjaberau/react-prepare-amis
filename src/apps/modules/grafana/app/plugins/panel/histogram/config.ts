import { StackingMode } from '@schema/index';

import { FieldConfig } from './panelcfg.gen';

export const defaultHistogramConfig: FieldConfig = {
  stacking: {
    mode: StackingMode.None,
    group: 'A',
  },
};
