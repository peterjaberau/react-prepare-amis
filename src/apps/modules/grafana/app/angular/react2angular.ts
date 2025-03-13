import { config } from '@runtime/index';
import coreModule from 'app/angular/core_module';
import { provideTheme } from 'app/core/utils/ConfigProvider';

export function react2AngularDirective(name: string, component: any, options: any) {
  coreModule.directive(name, [
    'reactDirective',
    (reactDirective) => {
      return reactDirective(provideTheme(component, config.theme2), options);
    },
  ]);
}
