import * as React from 'react';

import { NavModelItem } from '@data/index';
import { LibraryPanel } from '@schema/index';
import { DashboardModel } from '~/features/dashboard/state/DashboardModel';
import { PanelModel } from '~/features/dashboard/state/PanelModel';

export interface ShareModalTabProps {
  dashboard: DashboardModel;
  panel?: PanelModel;
  onDismiss?(): void;
  onCreateLibraryPanel?(libPanel: LibraryPanel): void;
}

export interface ShareModalTabModel {
  label: string;
  value: string;
  tabSuffix?: NavModelItem['tabSuffix'];
  component: React.ComponentType<ShareModalTabProps>;
}
