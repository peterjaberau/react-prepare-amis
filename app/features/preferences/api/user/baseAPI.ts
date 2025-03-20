import { createApi } from '@reduxjs/toolkit/query/react';

import { createBaseQuery } from '~/api/createBaseQuery';

export const baseAPI = createApi({
  reducerPath: 'userPreferencesAPI',
  baseQuery: createBaseQuery({ baseURL: '/api' }),
  endpoints: () => ({}),
});
