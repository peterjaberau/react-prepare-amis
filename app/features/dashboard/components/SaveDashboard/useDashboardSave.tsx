import { cloneDeep } from 'lodash-es';
import { useAsyncFn } from 'react-use';

import { locationUtil } from '@data/index';
import { locationService, reportInteraction } from '@runtime/index';
import { Dashboard } from '@schema/index';
import appEvents from '~/core/app_events';
import { useAppNotification } from '~/core/copy/appNotification';
import { updateDashboardName } from '~/core/reducers/navBarTree';
import { useSaveDashboardMutation } from '~/features/browse-dashboards/api/browseDashboardsAPI';
import { DashboardModel } from '~/features/dashboard/state/DashboardModel';
import { useDispatch } from '~/types';
import { DashboardSavedEvent } from '~/types/events';

import { updateDashboardUidLastUsedDatasource } from '../../utils/dashboard';

import { SaveDashboardOptions } from './types';

const saveDashboard = async (
  saveModel: any,
  options: SaveDashboardOptions,
  dashboard: DashboardModel,
  saveDashboardRtkQuery: ReturnType<typeof useSaveDashboardMutation>[0]
) => {
  const query = await saveDashboardRtkQuery({
    dashboard: saveModel,
    folderUid: options.folderUid ?? dashboard.meta.folderUid ?? saveModel.meta?.folderUid,
    message: options.message,
    overwrite: options.overwrite,
    k8s: dashboard.meta.k8s,
  });

  if ('error' in query) {
    throw query.error;
  }

  return query.data;
};

export const useDashboardSave = (isCopy = false) => {
  const dispatch = useDispatch();
  const notifyApp = useAppNotification();
  const [saveDashboardRtkQuery] = useSaveDashboardMutation();
  const [state, onDashboardSave] = useAsyncFn(
    async (clone: Dashboard, options: SaveDashboardOptions, dashboard: DashboardModel) => {
      try {
        const result = await saveDashboard(clone, options, dashboard, saveDashboardRtkQuery);
        dashboard.version = result.version;

        // Altering the clone leads to an error due to the clone being immutable
        clone = cloneDeep(clone);
        clone.version = result.version;
        dashboard.clearUnsavedChanges(clone, options);

        // important that these happen before location redirect below
        appEvents.publish(new DashboardSavedEvent());
        notifyApp.success('Dashboard saved');

        //Update local storage dashboard to handle things like last used datasource
        updateDashboardUidLastUsedDatasource(result.uid);

        if (isCopy) {
          reportInteraction('grafana_dashboard_copied', {
            name: dashboard.title,
            url: result.url,
          });
        } else {
          reportInteraction(`grafana_dashboard_${dashboard.id ? 'saved' : 'created'}`, {
            name: dashboard.title,
            url: result.url,
          });
        }

        const currentPath = locationService.getLocation().pathname;
        const newUrl = locationUtil.stripBaseFromUrl(result.url);

        if (newUrl !== currentPath && result.url) {
          setTimeout(() => locationService.replace(newUrl));
        }
        if (dashboard.meta.isStarred) {
          dispatch(
            updateDashboardName({
              id: dashboard.uid,
              title: dashboard.title,
              url: newUrl,
            })
          );
        }
        return result;
      } catch (error) {
        if (error instanceof Error) {
          notifyApp.error(error.message ?? 'Error saving dashboard');
        }
        throw error;
      }
    },
    [dispatch, notifyApp]
  );

  return { state, onDashboardSave };
};
