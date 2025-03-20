import { useAsyncFn } from 'react-use';

import { locationUtil } from '@data/index';
import { locationService, reportInteraction } from '@runtime/index';
import { Dashboard } from '@schema/index';
import { DashboardV2Spec } from '@schema/schema/dashboard/v2alpha0/types';
import appEvents from '~/core/app_events';
import { useAppNotification } from '~/core/copy/appNotification';
import { updateDashboardName } from '~/core/reducers/navBarTree';
import { useSaveDashboardMutation } from '~/features/browse-dashboards/api/browseDashboardsAPI';
import { SaveDashboardAsOptions, SaveDashboardOptions } from '~/features/dashboard/components/SaveDashboard/types';
import { useDispatch } from '~/types';
import { DashboardSavedEvent } from '~/types/events';

import { updateDashboardUidLastUsedDatasource } from '../../dashboard/utils/dashboard';
import { DashboardScene } from '../scene/DashboardScene';

export function useSaveDashboard(isCopy = false) {
  const dispatch = useDispatch();
  const notifyApp = useAppNotification();
  const [saveDashboardRtkQuery] = useSaveDashboardMutation();

  const [state, onSaveDashboard] = useAsyncFn(
    async (
      scene: DashboardScene,
      options: SaveDashboardOptions &
        SaveDashboardAsOptions & {
          // When provided, will take precedence over the scene's save model
          rawDashboardJSON?: Dashboard | DashboardV2Spec;
        }
    ) => {
      {
        let saveModel = options.rawDashboardJSON ?? scene.getSaveModel();

        if (options.saveAsCopy) {
          saveModel = scene.getSaveAsModel({
            isNew: options.isNew,
            title: options.title,
            description: options.description,
            copyTags: options.copyTags,
          });
        }

        const result = await saveDashboardRtkQuery({
          dashboard: saveModel,
          folderUid: options.folderUid,
          message: options.message,
          overwrite: options.overwrite,
          showErrorAlert: false,
          k8s: options.k8s,
        });

        if ('error' in result) {
          throw result.error;
        }

        const resultData = result.data;
        scene.saveCompleted(saveModel, resultData, options.folderUid);

        // important that these happen before location redirect below
        appEvents.publish(new DashboardSavedEvent());
        notifyApp.success('Dashboard saved');

        //Update local storage dashboard to handle things like last used datasource
        updateDashboardUidLastUsedDatasource(resultData.uid);

        if (isCopy) {
          reportInteraction('grafana_dashboard_copied', {
            name: saveModel.title,
            url: resultData.url,
          });
        } else {
          reportInteraction(`grafana_dashboard_${resultData.uid ? 'saved' : 'created'}`, {
            name: saveModel.title,
            url: resultData.url,
          });
        }

        const currentLocation = locationService.getLocation();
        const newUrl = locationUtil.stripBaseFromUrl(resultData.url);

        if (newUrl !== currentLocation.pathname) {
          setTimeout(() => {
            locationService.push({ pathname: newUrl, search: currentLocation.search });
          });
        }

        if (scene.state.meta.isStarred) {
          dispatch(
            updateDashboardName({
              id: resultData.uid,
              title: scene.state.title,
              url: newUrl,
            })
          );
        }

        return result.data;
      }
    },
    [dispatch, notifyApp]
  );

  return { state, onSaveDashboard };
}
