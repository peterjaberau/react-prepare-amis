import { useCallback } from 'react';

import { locationService } from '@runtime/index';
import { IconName, Menu } from '@grafana-ui/index';
import { t } from '@grafana-module/app/core/internationalization';
import { getTrackingSource, shareDashboardType } from '@grafana-module/app/features/dashboard/components/ShareModal/utils';

import { DashboardScene } from '../../scene/DashboardScene';
import { DashboardInteractions } from '../../utils/interactions';

export interface ExportDrawerMenuItem {
  shareId: string;
  testId: string;
  label: string;
  description?: string;
  icon: IconName;
  renderCondition: boolean;
  onClick: (d: DashboardScene) => void;
}

const customShareDrawerItem: ExportDrawerMenuItem[] = [];

export function addDashboardExportDrawerItem(item: ExportDrawerMenuItem) {
  customShareDrawerItem.push(item);
}

export default function ExportMenu({ dashboard }: { dashboard: DashboardScene }) {
  const onMenuItemClick = (shareView: string) => {
    locationService.partial({ shareView });
  };

  const buildMenuItems = useCallback(() => {
    const menuItems: ExportDrawerMenuItem[] = [];

    customShareDrawerItem.forEach((d) => menuItems.push(d));

    menuItems.push({
      shareId: shareDashboardType.export,
      icon: 'arrow',
      label: t('share-dashboard.menu.export-json-title', 'Export as JSON'),
      renderCondition: true,
      onClick: () => onMenuItemClick(shareDashboardType.export),
    } as any);

    return menuItems.filter((item) => item.renderCondition);
  }, []);

  const onClick = (item: ExportDrawerMenuItem) => {
    DashboardInteractions.sharingCategoryClicked({
      item: item.shareId,
      shareResource: getTrackingSource(),
    });

    item.onClick(dashboard);
  };

  return (
    <Menu >
      {buildMenuItems().map((item) => (
        <Menu.Item
          key={item.label}
          testId={item.testId}
          label={item.label}
          icon={item.icon}
          description={item.description}
          onClick={() => onClick(item)}
        />
      ))}
    </Menu>
  );
}
