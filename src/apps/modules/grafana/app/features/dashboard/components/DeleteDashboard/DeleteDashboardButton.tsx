import { Button, ModalsController } from '@grafana-ui/index';
import { Trans } from '@grafana-module/app/core/internationalization';

import { getDashboardSrv } from '../../services/DashboardSrv';

import { DeleteDashboardModal } from './DeleteDashboardModal';

export const DeleteDashboardButton = () => {
  const dashboard = getDashboardSrv().getCurrent()!;
  return (
    <ModalsController>
      {({ showModal, hideModal }) => (
        <Button
          variant="destructive"
          onClick={() => {
            showModal(DeleteDashboardModal, {
              dashboard,
              hideModal,
            });
          }}
          data-testid={selectors.pages.Dashboard.Settings.General.deleteDashBoard}
        >
          <Trans i18nKey="dashboard-settings.dashboard-delete-button">Delete dashboard</Trans>
        </Button>
      )}
    </ModalsController>
  );
};
