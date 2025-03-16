import { backendSrv } from '@grafana-module/app/core/services/backend_srv';
import { setBackendSrv } from '@runtime/index';


export const backendSrvResolver = () => {

  console.log('backendSrv', backendSrv);


}
