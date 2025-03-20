import { useCallback } from 'react';

import { config } from '@runtime/index';
import { LinkButton } from '@grafana-ui/index';
import { contextSrv } from '@grafana-module/app/core/core';
import { Trans } from '@grafana-module/app/core/internationalization';
import { ROUTES } from '@grafana-module/app/features/connections/constants';
import { AccessControlAction } from '@grafana-module/app/types';

import { trackAddNewDsClicked } from '../tracking';

export function DataSourceAddButton(): JSX.Element | null {
  const canCreateDataSource = contextSrv.hasPermission(AccessControlAction.DataSourcesCreate);
  const handleClick = useCallback(() => {
    trackAddNewDsClicked({ path: location.pathname });
  }, []);

  return canCreateDataSource ? (
    <LinkButton icon="plus" href={config.appSubUrl + ROUTES.DataSourcesNew} onClick={handleClick}>
      <Trans i18nKey="data-sources.datasource-add-button.label">Add new data source</Trans>
    </LinkButton>
  ) : null;
}
