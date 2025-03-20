import { createApi } from '@reduxjs/toolkit/query/react';

import { config } from '@runtime/index';
import { createBaseQuery } from '@grafana-module/app/api/createBaseQuery';

export const BASE_URL = `apis/provisioning.grafana.app/v0alpha1/namespaces/${config.namespace}`;

export const api = createApi({
  reducerPath: 'provisioningAPI',
  baseQuery: createBaseQuery({
    baseURL: BASE_URL,
  }),
  endpoints: () => ({}),
});
