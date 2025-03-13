import { locationUtil } from '@data/index';
import { LinkButton, ButtonVariant } from '@grafana-ui/index';
import { contextSrv } from '@grafana-module/app/core/core';
import { Trans } from '@grafana-module/app/core/internationalization';
import { ROUTES as CONNECTIONS_ROUTES } from '@grafana-module/app/features/connections/constants';
import { AccessControlAction } from '@grafana-module/app/types';

interface AddNewDataSourceButtonProps {
  onClick?: () => void;
  variant?: ButtonVariant;
}

export function AddNewDataSourceButton({ variant, onClick }: AddNewDataSourceButtonProps) {
  const hasCreateRights = contextSrv.hasPermission(AccessControlAction.DataSourcesCreate);
  const newDataSourceURL = locationUtil.assureBaseUrl(CONNECTIONS_ROUTES.DataSourcesNew);

  return (
    <LinkButton
      variant={variant || 'primary'}
      href={newDataSourceURL}
      disabled={!hasCreateRights}
      tooltip={!hasCreateRights ? 'You do not have permission to configure new data sources' : undefined}
      onClick={onClick}
      target="_blank"
    >
      <Trans i18nKey="data-source-picker.add-new-data-source">Configure a new data source</Trans>
    </LinkButton>
  );
}
