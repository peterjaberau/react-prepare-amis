import { AppEvents, UrlQueryMap } from '@data/index';
import { FetchError, getBackendSrv } from '@runtime/index';
import { Dashboard } from '@schema/index';
import appEvents from '@grafana-module/app/core/app_events';
import { dashboardWatcher } from '@grafana-module/app/features/live/dashboard/dashboardWatcher';
import { DeleteDashboardResponse } from '@grafana-module/app/features/manage-dashboards/types';
import { SaveDashboardResponseDTO, DashboardDTO } from '@grafana-module/app/types';

import { SaveDashboardCommand } from '../components/SaveDashboard/types';

import { DashboardAPI } from './types';

export class LegacyDashboardAPI implements DashboardAPI<DashboardDTO, Dashboard> {
  constructor() {}

  saveDashboard(options: SaveDashboardCommand<Dashboard>): Promise<SaveDashboardResponseDTO> {
    dashboardWatcher.ignoreNextSave();

    return getBackendSrv().post<SaveDashboardResponseDTO>('/api/dashboards/db/', {
      dashboard: options.dashboard,
      message: options.message ?? '',
      overwrite: options.overwrite ?? false,
      folderUid: options.folderUid,
    });
  }

  deleteDashboard(uid: string, showSuccessAlert: boolean): Promise<DeleteDashboardResponse> {
    return getBackendSrv().delete<DeleteDashboardResponse>(`/api/dashboards/uid/${uid}`, undefined, {
      showSuccessAlert,
    });
  }

  async getDashboardDTO(uid: string, params?: UrlQueryMap) {
    const result = await getBackendSrv().get<DashboardDTO>(`/api/dashboards/uid/${uid}`, params);

    if (result.meta.isFolder) {
      appEvents.emit(AppEvents.alertError, ['Dashboard not found']);
      const fetchError: FetchError = {
        status: 404,
        config: { url: `/api/dashboards/uid/${uid}` },
        data: { message: 'Dashboard not found' },
      };
      throw fetchError;
    }

    return result;
  }
}
