import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '~/api/createBaseQuery';
import { getAPIBaseURL } from '~/api/utils';

export const BASE_URL = getAPIBaseURL('folder.grafana.app', 'v0alpha1');

export const api = createApi({
  reducerPath: 'folderAPI',
  baseQuery: createBaseQuery({
    baseURL: BASE_URL,
  }),
  endpoints: () => ({}),
});
