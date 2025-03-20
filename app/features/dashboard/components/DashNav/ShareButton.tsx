import { selectors as e2eSelectors } from '@selectors/index';
import { locationService } from '@runtime/index';
import { Button } from '@grafana-ui/index';
import { Trans } from '~/core/internationalization';
import { DashboardModel } from '~/features/dashboard/state/DashboardModel';
import { DashboardInteractions } from '~/features/dashboard-scene/utils/interactions';

import { shareDashboardType } from '../ShareModal/utils';

export const ShareButton = ({ dashboard }: { dashboard: DashboardModel }) => {
  return (
    <Button
      data-testid={e2eSelectors.pages.Dashboard.DashNav.shareButton}
      variant="primary"
      size="sm"
      onClick={() => {
        DashboardInteractions.toolbarShareClick();
        locationService.partial({ shareView: shareDashboardType.link });
      }}
    >
      <Trans i18nKey="dashboard.toolbar.share-button">Share</Trans>
    </Button>
  );
};
