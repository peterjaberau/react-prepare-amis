import { createSelector } from 'reselect';

import { NavModel } from '@data/index';
import { getNavModel } from '@grafana-module/app/core/selectors/navModel';
import { store } from '@grafana-module/app/store/store';
import { StoreState, useSelector } from '@grafana-module/app/types';

export function usePageNav(navId?: string, oldProp?: NavModel): NavModel | undefined {
  if (oldProp) {
    return oldProp;
  }

  if (!navId) {
    return;
  }

  // Page component is used in so many tests, this simplifies not having to initialize a full redux store
  if (!store) {
    return;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSelector(createSelector(getNavIndex, (navIndex) => getNavModel(navIndex, navId ?? 'home')));
}

function getNavIndex(store: StoreState) {
  return store.navIndex;
}
