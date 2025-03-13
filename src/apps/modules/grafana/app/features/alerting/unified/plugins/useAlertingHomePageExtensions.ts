import { PluginExtensionPoints } from '@grafana/data';
import { usePluginComponents } from '@runtime/index';

export function useAlertingHomePageExtensions() {
  return usePluginComponents({
    extensionPointId: PluginExtensionPoints.AlertingHomePage,
    limitPerPlugin: 1,
  });
}
