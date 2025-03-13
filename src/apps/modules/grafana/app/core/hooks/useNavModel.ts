import { NavModel } from '@data/index';
import { useSelector } from '@grafana-module/app/types';

import { getNavModel } from '../selectors/navModel';

export const useNavModel = (id: string): NavModel => {
  const navIndex = useSelector((state) => state.navIndex);
  return getNavModel(navIndex, id);
};
