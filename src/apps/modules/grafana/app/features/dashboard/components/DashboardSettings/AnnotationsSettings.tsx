import { AnnotationQuery, getDataSourceRef, NavModelItem } from '@data/index';
import { getDataSourceSrv, locationService } from '@runtime/index';
import { Page } from '@grafana-module/app/core/components/Page/Page';

import { DashboardModel } from '../../state/DashboardModel';
import { AnnotationSettingsEdit, AnnotationSettingsList, newAnnotationName } from '../AnnotationSettings';

import { SettingsPageProps } from './types';

export function AnnotationsSettings({ dashboard, editIndex, sectionNav }: SettingsPageProps) {
  const onNew = () => {
    const newAnnotation: AnnotationQuery = {
      name: newAnnotationName,
      enable: true,
      datasource: getDataSourceRef(getDataSourceSrv().getInstanceSettings(null)!),
      iconColor: 'red',
    };

    dashboard.annotations.list = [...dashboard.annotations.list, { ...newAnnotation }];
    locationService.partial({ editIndex: dashboard.annotations.list.length - 1 });
  };

  const onEdit = (idx: number) => {
    locationService.partial({ editIndex: idx });
  };

  const isEditing = editIndex != null && editIndex < dashboard.annotations.list.length;

  return (
    <Page navModel={sectionNav} pageNav={getSubPageNav(dashboard, editIndex, sectionNav.node)}>
      {!isEditing && <AnnotationSettingsList dashboard={dashboard} onNew={onNew} onEdit={onEdit} />}
      {isEditing && <AnnotationSettingsEdit dashboard={dashboard} editIdx={editIndex!} />}
    </Page>
  );
}

function getSubPageNav(
  dashboard: DashboardModel,
  editIndex: number | undefined,
  node: NavModelItem
): NavModelItem | undefined {
  const parentItem = node.parentItem;
  if (editIndex == null) {
    return parentItem;
  }

  const editItem = dashboard.annotations.list[editIndex];
  if (editItem) {
    return {
      text: editItem.name,
      parentItem,
    };
  }

  return undefined;
}
