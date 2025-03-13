import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom-v5-compat';

import { UrlQueryMap } from '@data/index';
import { locationSearchToObject, locationService } from '@runtime/index';

export function useQueryParams(): [UrlQueryMap, (values: UrlQueryMap, replace?: boolean) => void] {
  const { search } = useLocation();
  const queryParams = useMemo(() => locationSearchToObject(search || ''), [search]);
  const update = useCallback((values: UrlQueryMap, replace?: boolean) => locationService.partial(values, replace), []);
  return [queryParams, update];
}
