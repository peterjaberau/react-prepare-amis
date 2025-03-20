import { reportInteraction } from '@runtime/index';
import { Button, ButtonVariant, ComponentSize, ModalsController } from '@grafana-ui/index';
import { DashboardModel } from '~/features/dashboard/state/DashboardModel';

import { SaveDashboardDrawer } from './SaveDashboardDrawer';

interface SaveDashboardButtonProps {
  dashboard: DashboardModel;
  onSaveSuccess?: () => void;
  size?: ComponentSize;
  onClick?: () => void;
}

export const SaveDashboardButton = ({ dashboard, onSaveSuccess, size }: SaveDashboardButtonProps) => {
  return (
    <ModalsController>
      {({ showModal, hideModal }) => {
        return (
          <Button
            size={size}
            onClick={() => {
              showModal(SaveDashboardDrawer, {
                dashboard,
                onSaveSuccess,
                onDismiss: hideModal,
              });
            }}
          >
            Save dashboard
          </Button>
        );
      }}
    </ModalsController>
  );
};

type Props = SaveDashboardButtonProps & { variant?: ButtonVariant };

export const SaveDashboardAsButton = ({ dashboard, onClick, onSaveSuccess, variant, size }: Props) => {
  return (
    <ModalsController>
      {({ showModal, hideModal }) => {
        return (
          <Button
            size={size}
            onClick={() => {
              reportInteraction('grafana_dashboard_save_as_clicked');
              onClick?.();
              showModal(SaveDashboardDrawer, {
                dashboard,
                onSaveSuccess,
                onDismiss: hideModal,
                isCopy: true,
              });
            }}
            variant={variant}
          >
            Save as
          </Button>
        );
      }}
    </ModalsController>
  );
};
