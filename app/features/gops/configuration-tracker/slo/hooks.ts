import { sloApi } from '~/features/alerting/unified/api/sloApi';
import { usePluginBridge } from '~/features/alerting/unified/hooks/usePluginBridge';
import { SupportedPlugin } from '~/features/alerting/unified/types/pluginBridges';

export function useSloChecks() {
  const { installed: sloPluginInstalled } = usePluginBridge(SupportedPlugin.Slo);

  const { data, isLoading } = sloApi.endpoints.getSlos.useQuery(undefined, {
    skip: !sloPluginInstalled,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  return {
    isLoading,
    hasSlo: Boolean(data?.slos.length),
    hasSloWithAlert: Boolean(data?.slos?.some((slo) => slo.alerting)),
  };
}
