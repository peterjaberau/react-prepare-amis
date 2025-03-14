import { Alert, Button, Stack } from '@grafana-ui/index';

import { Trans } from '@grafana-module/app/core/internationalization';

const PUBLIC_DASHBOARD_URL =
  'https://grafana.com/docs/grafana/next/dashboards/share-dashboards-panels/shared-dashboards';


export const PublicDashboardAlert = () => (
  <Alert title="" severity="info" bottomSpacing={0} >
    <Stack justifyContent="space-between" gap={2} alignItems="center">
      <Trans i18nKey="public-dashboard.public-sharing.alert-text">
        Sharing this dashboard externally makes it entirely accessible to anyone with the link.
      </Trans>
      <Button variant="secondary" onClick={() => window.open(PUBLIC_DASHBOARD_URL, '_blank')} type="button">
        <Trans i18nKey="public-dashboard.public-sharing.learn-more-button">Learn more</Trans>
      </Button>
    </Stack>
  </Alert>
);
