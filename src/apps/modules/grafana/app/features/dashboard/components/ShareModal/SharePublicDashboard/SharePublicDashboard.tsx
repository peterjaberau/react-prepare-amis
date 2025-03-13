import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@data/index';
import { Spinner, useStyles2 } from '@grafana/ui/src';
import { useGetPublicDashboardQuery } from '@grafana-module/app/features/dashboard/api/publicDashboardApi';
import { publicDashboardPersisted } from '@grafana-module/app/features/dashboard/components/ShareModal/SharePublicDashboard/SharePublicDashboardUtils';
import { ShareModalTabProps } from '@grafana-module/app/features/dashboard/components/ShareModal/types';
import { useSelector } from '@grafana-module/app/types';

import { HorizontalGroup } from '../../../../plugins/admin/components/HorizontalGroup';

import { ConfigPublicDashboard } from './ConfigPublicDashboard/ConfigPublicDashboard';
import { CreatePublicDashboard } from './CreatePublicDashboard/CreatePublicDashboard';
import { useGetUnsupportedDataSources } from './useGetUnsupportedDataSources';

interface Props extends ShareModalTabProps {}

export const Loader = () => {
  const styles = useStyles2(getStyles);

  return (
    <HorizontalGroup className={styles.loadingContainer}>
      <>
        Loading configuration
        <Spinner size="lg" className={styles.spinner} />
      </>
    </HorizontalGroup>
  );
};

export const SharePublicDashboard = (props: Props) => {
  const { data: publicDashboard, isLoading, isError } = useGetPublicDashboardQuery(props.dashboard.uid);
  const dashboardState = useSelector((store) => store.dashboard);
  const dashboard = dashboardState.getModel()!;
  const { unsupportedDataSources } = useGetUnsupportedDataSources(dashboard);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : !publicDashboardPersisted(publicDashboard) ? (
        <CreatePublicDashboard hasError={isError} />
      ) : (
        <ConfigPublicDashboard publicDashboard={publicDashboard!} unsupportedDatasources={unsupportedDataSources} />
      )}
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  loadingContainer: css({
    height: '280px',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
  }),
  spinner: css({
    marginBottom: theme.spacing(0),
  }),
});
