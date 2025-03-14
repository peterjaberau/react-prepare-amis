import { coreModule } from '@grafana-module/app/angular/core_module';

coreModule.directive('datasourceTlsAuthSettings', () => {
  return {
    scope: {
      current: '=',
    },
    templateUrl: 'public/app/angular/partials/tls_auth_settings.html',
  };
});
