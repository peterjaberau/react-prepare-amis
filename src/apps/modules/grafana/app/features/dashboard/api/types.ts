import { UrlQueryMap } from '@data/index';
import { Resource } from '@grafana-module/app/features/apiserver/types';
import { DeleteDashboardResponse } from '@grafana-module/app/features/manage-dashboards/types';
import { AnnotationsPermissions, SaveDashboardResponseDTO } from '@grafana-module/app/types';

import { SaveDashboardCommand } from '../components/SaveDashboard/types';

export interface DashboardAPI<G, T> {
  /** Get a dashboard with the access control metadata */
  getDashboardDTO(uid: string, params?: UrlQueryMap): Promise<G>;
  /** Save dashboard */
  saveDashboard(options: SaveDashboardCommand<T>): Promise<SaveDashboardResponseDTO>;
  /** Delete a dashboard */
  deleteDashboard(uid: string, showSuccessAlert: boolean): Promise<DeleteDashboardResponse>;
}

// Implemented using /api/dashboards/*
export interface DashboardWithAccessInfo<T> extends Resource<T, 'DashboardWithAccessInfo'> {
  access: {
    url?: string;
    slug?: string;
    canSave?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canShare?: boolean;
    canStar?: boolean;
    canAdmin?: boolean;
    annotationsPermissions?: AnnotationsPermissions;
  }; // TODO...
}
