import { css } from '@emotion/css';
import * as React from 'react';

import { GrafanaTheme2, ThemeSpacingTokens } from '@data/index';
import { useStyles2 } from '@grafana-ui/index';
import { getResponsiveStyle, ResponsiveProp } from '@grafana-ui/components/Layout/utils/responsiveness';

interface IndentProps {
  children?: React.ReactNode;
  level: number;
  spacing: ResponsiveProp<ThemeSpacingTokens>;
}

export function Indent({ children, spacing, level }: IndentProps) {
  const styles: any = useStyles2(getStyles, spacing, level);

  return <span className={css(styles.indentor)}>{children}</span>;
}


const getStyles: any = (theme: GrafanaTheme2 | any, spacing: IndentProps['spacing'] | any, level: IndentProps['level'] | any) => ({
  // @ts-ignore
  indentor: css(getResponsiveStyle(theme, spacing, (val: any): any => ({ paddingLeft: theme.spacing(val * level), } as any)),),
});
