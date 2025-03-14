import { css } from '@emotion/css';
import { ButtonHTMLAttributes } from 'react';

import { GrafanaTheme2 } from '@data/index';
import { Button, useStyles2 } from '@grafana-ui/index';

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const ListNewButton = ({ children, ...restProps }: Props) => {
  const styles = useStyles2(getStyles);
  return (
    <div className={styles.buttonWrapper}>
      <Button icon="plus" {...restProps}>
        {children}
      </Button>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  buttonWrapper: css({
    padding: `${theme.spacing(3)} 0`,
  }),
});
