import { css } from '@emotion/css';
import { useCallback } from 'react';
import * as React from 'react';

import { GrafanaTheme2 } from '@data/index';
import { reportInteraction } from '@runtime/index';
import { Button, InlineSwitch, useStyles2 } from '@grafana-ui/index';

export type Props = {
  wrapLines?: boolean;
  onChangeWrapLines: (wrapLines: boolean) => void;
  onScrollCenterClick: () => void;
};

function getStyles(theme: GrafanaTheme2) {
  return {
    buttons: css({
      display: 'flex',
      gap: theme.spacing(1),
    }),
  };
}

export const LogContextButtons = (props: Props) => {
  const styles = useStyles2(getStyles);
  const { wrapLines, onChangeWrapLines, onScrollCenterClick } = props;
  const internalOnChangeWrapLines = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const state = event.currentTarget.checked;
      reportInteraction('grafana_explore_logs_log_context_toggle_lines_clicked', {
        state,
      });
      onChangeWrapLines(state);
    },
    [onChangeWrapLines]
  );

  return (
    <div className={styles.buttons}>
      <InlineSwitch showLabel value={wrapLines} onChange={internalOnChangeWrapLines} label="Wrap lines" />
      <Button variant="secondary" onClick={onScrollCenterClick}>
        Center matched line
      </Button>
    </div>
  );
};
