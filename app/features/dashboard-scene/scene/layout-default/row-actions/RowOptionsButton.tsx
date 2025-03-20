import { SceneObject } from '@scenes/index';
import { Icon, ModalsController } from '@grafana-ui/index';
import { t } from '@grafana-module/app/core/internationalization';

import { OnRowOptionsUpdate } from './RowOptionsForm';
import { RowOptionsModal } from './RowOptionsModal';

export interface RowOptionsButtonProps {
  title: string;
  repeat?: string;
  parent: SceneObject;
  onUpdate: OnRowOptionsUpdate;
  isUsingDashboardDS: boolean;
}

export const RowOptionsButton = ({ repeat, title, parent, onUpdate, isUsingDashboardDS }: RowOptionsButtonProps) => {
  return (
    <ModalsController>
      {({ showModal, hideModal }) => {
        return (
          <button
            type="button"
            className="pointer"
            aria-label={t('dashboard.default-layout.row-options.button.label', 'Row options')}
            onClick={() => {
              showModal(RowOptionsModal, {
                title,
                repeat,
                parent,
                onDismiss: hideModal,
                onUpdate: (title: string, repeat?: string | null) => {
                  onUpdate(title, repeat);
                  hideModal();
                },
                isUsingDashboardDS,
              });
            }}
          >
            <Icon name="cog" />
          </button>
        );
      }}
    </ModalsController>
  );
};

RowOptionsButton.displayName = 'RowOptionsButton';
