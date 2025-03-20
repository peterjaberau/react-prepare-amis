import { useState, useEffect } from 'react';

import { Dropdown, Button, Icon } from '@grafana-ui/index';
import { Trans } from '~/core/internationalization';
import { DashboardModel } from '~/features/dashboard/state/DashboardModel';

import AddPanelMenu from './AddPanelMenu';

export interface Props {
  dashboard: DashboardModel;
  onToolbarAddMenuOpen?: () => void;
}

const AddPanelButton = ({ dashboard, onToolbarAddMenuOpen }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen && onToolbarAddMenuOpen) {
      onToolbarAddMenuOpen();
    }
  }, [isMenuOpen, onToolbarAddMenuOpen]);

  return (
    <Dropdown
      overlay={() => <AddPanelMenu dashboard={dashboard} />}
      placement="bottom"
      offset={[0, 6]}
      onVisibleChange={setIsMenuOpen}
    >
      <Button
        variant="secondary"
        size="sm"
        fill="outline"
      >
        <Trans i18nKey="dashboard.toolbar.add">Add</Trans>
        <Icon name={isMenuOpen ? 'angle-up' : 'angle-down'} size="lg" />
      </Button>
    </Dropdown>
  );
};

export default AddPanelButton;
