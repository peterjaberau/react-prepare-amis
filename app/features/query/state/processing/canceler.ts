import { MonoTypeOperatorFunction } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { BackendSrv } from '@grafana-module/app/core/services/backend_srv';

export function cancelNetworkRequestsOnUnsubscribe<T>(
  backendSrv: BackendSrv,
  requestId: string | undefined
): MonoTypeOperatorFunction<T> {
  return finalize(() => {
    if (requestId) {
      backendSrv.resolveCancelerIfExists(requestId);
    }
  });
}
