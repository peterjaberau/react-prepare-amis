import { SceneComponentProps, SceneObjectBase } from '@scenes/index';
import { t } from '@grafana-module/app/core/internationalization';
import { useGetPublicDashboardQuery } from '@grafana-module/app/features/dashboard/api/publicDashboardApi';
import { Loader } from '@grafana-module/app/features/dashboard/components/ShareModal/SharePublicDashboard/SharePublicDashboard';
import { publicDashboardPersisted } from '@grafana-module/app/features/dashboard/components/ShareModal/SharePublicDashboard/SharePublicDashboardUtils';
import { shareDashboardType } from '@grafana-module/app/features/dashboard/components/ShareModal/utils';

import { getDashboardSceneFor } from '../../utils/utils';
import { SceneShareTabState } from '../types';

import { ConfigPublicDashboard } from './ConfigPublicDashboard';
import { CreatePublicDashboard } from './CreatePublicDashboard';

export class SharePublicDashboardTab extends SceneObjectBase<SceneShareTabState> {
  public tabId = shareDashboardType.publicDashboard;
  static Component = SharePublicDashboardTabRenderer;

  public getTabLabel() {
    return t('share-modal.tab-title.public-dashboard', 'Public Dashboard');
  }
}

function SharePublicDashboardTabRenderer({ model }: SceneComponentProps<SharePublicDashboardTab>) {
  const { data: publicDashboard, isLoading: isGetLoading } = useGetPublicDashboardQuery(
    getDashboardSceneFor(model).state.uid!
  );

  return (
    <>
      {isGetLoading ? (
        <Loader />
      ) : !publicDashboardPersisted(publicDashboard) ? (
        <CreatePublicDashboard model={model} />
      ) : (
        <ConfigPublicDashboard model={model} publicDashboard={publicDashboard} isGetLoading={isGetLoading} />
      )}
    </>
  );
}
