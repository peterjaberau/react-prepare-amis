import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@data/index';
import { useStyles2 } from '@grafana-ui/index';

// this custom component is necessary because the Grafana UI <Divider /> component is not backwards compatible with Grafana < 10.1.0
export const Divider = () => {
  const styles = useStyles2(getStyles);
  return <hr className={styles.horizontalDivider} />;
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    horizontalDivider: css({
      borderTop: `1px solid ${theme.colors.border.weak}`,
      margin: theme.spacing(2, 0),
      width: '100%',
    }),
  };
};
