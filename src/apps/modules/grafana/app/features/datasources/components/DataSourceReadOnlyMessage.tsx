import { Alert } from '@grafana-ui/index';

export const readOnlyMessage =
  'This data source was added by config and cannot be modified using the UI. Please contact your server admin to update this data source.';

export function DataSourceReadOnlyMessage() {
  return (
    <Alert data-testid={e2eSelectors.pages.DataSource.readOnly} severity="info" title="Provisioned data source">
      {readOnlyMessage}
    </Alert>
  );
}
