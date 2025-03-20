import { useMemo } from 'react';

import { locationService } from '@runtime/index';
import { Menu } from '@grafana-ui/index';
import { t } from '~/core/internationalization';
import { DashboardModel } from '~/features/dashboard/state/DashboardModel';
import {
  getCopiedPanelPlugin,
  onAddLibraryPanel,
  onCreateNewPanel,
  onCreateNewRow,
  onPasteCopiedPanel,
} from '~/features/dashboard/utils/dashboard';
import { DashboardInteractions } from '~/features/dashboard-scene/utils/interactions';
import { useDispatch, useSelector } from '~/types';

import { setInitialDatasource } from '../../state/reducers';

export interface Props {
  dashboard: DashboardModel;
}

const AddPanelMenu = ({ dashboard }: Props) => {
  const copiedPanelPlugin = useMemo(() => getCopiedPanelPlugin(), []);
  const dispatch = useDispatch();
  const initialDatasource = useSelector((state) => state.dashboard.initialDatasource);

  return (
    <Menu>
      <Menu.Item
        key="add-visualisation"
        label={t('dashboard.add-menu.visualization', 'Visualization')}
        onClick={() => {
          const id = onCreateNewPanel(dashboard, initialDatasource);
          DashboardInteractions.toolbarAddButtonClicked({ item: 'add_visualization' });
          locationService.partial({ editPanel: id });
          dispatch(setInitialDatasource(undefined));
        }}
      />
      <Menu.Item
        key="add-row"
        label={t('dashboard.add-menu.row', 'Row')}
        onClick={() => {
          DashboardInteractions.toolbarAddButtonClicked({ item: 'add_row' });
          onCreateNewRow(dashboard);
        }}
      />
      <Menu.Item
        key="add-panel-lib"
        label={t('dashboard.add-menu.import', 'Import from library')}
        onClick={() => {
          DashboardInteractions.toolbarAddButtonClicked({ item: 'import_from_library' });
          onAddLibraryPanel(dashboard);
        }}
      />
      <Menu.Item
        key="add-panel-clipboard"
        label={t('dashboard.add-menu.paste-panel', 'Paste panel')}
        onClick={() => {
          DashboardInteractions.toolbarAddButtonClicked({ item: 'paste_panel' });
          onPasteCopiedPanel(dashboard, copiedPanelPlugin);
        }}
        disabled={!copiedPanelPlugin}
      />
    </Menu>
  );
};

export default AddPanelMenu;
