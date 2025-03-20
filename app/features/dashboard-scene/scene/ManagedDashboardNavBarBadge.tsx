import { Badge } from '@grafana-ui/index';
import { AnnoKeyManagerIdentity, AnnoKeyManagerKind, ManagerKind } from '@grafana-module/app/features/apiserver/types';
import { DashboardMeta } from '@grafana-module/app/types';

export default function ManagedDashboardNavBarBadge({ meta }: { meta: DashboardMeta }) {
  const obj = meta.k8s;
  if (!obj?.annotations) {
    return;
  }

  let text = 'Provisioned';
  const kind = obj.annotations?.[AnnoKeyManagerKind];
  const id = obj.annotations?.[AnnoKeyManagerIdentity];
  switch (kind) {
    case ManagerKind.Terraform:
      text = 'Terraform';
    case ManagerKind.Kubectl:
      text = 'Kubectl';
    case ManagerKind.Plugin:
      text = `Plugin: ${id}`;
  }
  return <Badge color="darkgrey" icon="exchange-alt" text={text} key="provisioned-dashboard-button-badge" />;
}
