import { FetchResponse } from '@runtime/index';

export function createFetchResponse<T>(data: T): FetchResponse<T> {
  return {
    data,
    status: 200,
    url: 'http://localhost:3070/api/ds/query',
    config: { url: 'http://localhost:3070/api/ds/query' },
    type: 'basic',
    statusText: 'Ok',
    redirected: false,
    headers: new Headers(),
    ok: true,
  };
}
