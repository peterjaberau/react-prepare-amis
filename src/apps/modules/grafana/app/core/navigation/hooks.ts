import { useLocation } from 'react-router-dom';

import { locationService } from '@runtime/index';

export type UseUrlParamsResult = [URLSearchParams, (params: Record<string, unknown>, replace?: boolean) => void];

/** @internal experimental */
export function useUrlParams(): UseUrlParamsResult {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const updateUrlParams = (params: Record<string, unknown>, replace?: boolean) => {
    // Should find a way to use history directly here
    locationService.partial(params, replace);
  };

  return [params, updateUrlParams];
}
