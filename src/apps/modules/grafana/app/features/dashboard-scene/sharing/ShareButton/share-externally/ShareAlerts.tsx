import { contextSrv } from '@grafana-module/app/core/core';
import { EmailSharingPricingAlert } from '@grafana-module/app/features/dashboard/components/ShareModal/SharePublicDashboard/ModalAlerts/EmailSharingPricingAlert';
import { UnsupportedDataSourcesAlert } from '@grafana-module/app/features/dashboard/components/ShareModal/SharePublicDashboard/ModalAlerts/UnsupportedDataSourcesAlert';
import { UnsupportedTemplateVariablesAlert } from '@grafana-module/app/features/dashboard/components/ShareModal/SharePublicDashboard/ModalAlerts/UnsupportedTemplateVariablesAlert';
import {
  isEmailSharingEnabled,
  PublicDashboard,
  PublicDashboardShareType,
} from '@grafana-module/app/features/dashboard/components/ShareModal/SharePublicDashboard/SharePublicDashboardUtils';
import { AccessControlAction } from '@grafana-module/app/types';

import { NoUpsertPermissionsAlert } from '../../../../dashboard/components/ShareModal/SharePublicDashboard/ModalAlerts/NoUpsertPermissionsAlert';
import { PublicDashboardAlert } from '../../../../dashboard/components/ShareModal/SharePublicDashboard/ModalAlerts/PublicDashboardAlert';
import { useShareDrawerContext } from '../../ShareDrawer/ShareDrawerContext';
import { useUnsupportedDatasources } from '../../public-dashboards/hooks';

export default function ShareAlerts({ publicDashboard }: { publicDashboard?: PublicDashboard }) {
  const { dashboard } = useShareDrawerContext();
  const hasWritePermissions = contextSrv.hasPermission(AccessControlAction.DashboardsPublicWrite);
  const unsupportedDataSources = useUnsupportedDatasources(dashboard);
  const hasTemplateVariables = (dashboard.state.$variables?.state.variables.length ?? 0) > 0;

  return (
    <>
      {hasWritePermissions && hasTemplateVariables && <UnsupportedTemplateVariablesAlert showDescription={false} />}
      {!hasWritePermissions && <NoUpsertPermissionsAlert mode={publicDashboard ? 'edit' : 'create'} />}
      {hasWritePermissions && !!unsupportedDataSources?.length && (
        <UnsupportedDataSourcesAlert unsupportedDataSources={unsupportedDataSources.join(', ')} />
      )}
      {publicDashboard?.share === PublicDashboardShareType.EMAIL && isEmailSharingEnabled() && (
        <EmailSharingPricingAlert />
      )}
      {publicDashboard?.share === PublicDashboardShareType.PUBLIC && <PublicDashboardAlert />}
    </>
  );
}
