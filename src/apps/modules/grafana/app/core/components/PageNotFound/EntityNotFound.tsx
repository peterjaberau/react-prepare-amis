import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@data/index';
import { EmptyState, TextLink, useStyles2 } from '@grafana-ui/index';
import { Trans } from '@grafana-module/app/core/internationalization';

export interface Props {
  /**
   * Defaults to Page
   */
  entity?: string;
}

export function EntityNotFound({ entity = 'Page' }: Props) {
  const styles = useStyles2(getStyles);
  const lowerCaseEntity = entity.toLowerCase();

  return (
    <div className={styles.container} >
      <EmptyState message={`${entity} not found`} variant="not-found">
        <Trans i18nKey="entity-not-found.description">
          We&apos;re looking but can&apos;t seem to find this {{ lowerCaseEntity }}. Try returning{' '}
          <TextLink href="/">home</TextLink> or seeking help on the{' '}
          <TextLink href="https://community.grafana.com" external>
            community site.
          </TextLink>
        </Trans>
      </EmptyState>
    </div>
  );
}

export function getStyles(theme: GrafanaTheme2) {
  return {
    container: css({
      padding: theme.spacing(8, 2, 2, 2),
    }),
  };
}
