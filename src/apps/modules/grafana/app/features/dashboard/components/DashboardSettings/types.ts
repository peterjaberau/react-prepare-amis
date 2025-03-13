import { ComponentType } from 'react';

import { NavModel } from '@data/index';
import { IconName } from '@grafana-ui/index';

import { DashboardModel } from '../../state/DashboardModel';

export interface SettingsPage {
  id: string;
  title: string;
  icon: IconName;
  component: ComponentType<SettingsPageProps>;
  subTitle?: string;
}

export interface SettingsPageProps {
  dashboard: DashboardModel;
  sectionNav: NavModel;
  editIndex?: number;
}
