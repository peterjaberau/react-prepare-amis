import { css } from '@emotion/css';
import * as React from 'react';

import { GrafanaTheme2 } from '@data/index';
import { useStyles2 } from '@grafana-ui/index';

const getStyles = (theme: GrafanaTheme2) =>
  css({
    padding: theme.spacing(0, 2),
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.secondary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });

export const DetailText = ({ children }: React.PropsWithChildren<{}>) => {
  const collapsedTextStyles = useStyles2(getStyles);
  return <div className={collapsedTextStyles}>{children}</div>;
};
