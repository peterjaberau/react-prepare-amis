import { css } from '@emotion/css';
import { selectors as e2eSelectors } from '@selectors/index';
import { GrafanaTheme2 } from '@data/index';
import { useStyles2 } from '@grafana-ui/index';

import { useGetPublicDashboardConfig } from './usePublicDashboardConfig';

const selectors = e2eSelectors.pages.PublicDashboard;

export const PublicDashboardFooter = function () {
  const styles = useStyles2(getStyles);
  const conf = useGetPublicDashboardConfig();

  return conf.footerHide ? null : (
    <div className={styles.footer} data-testid={selectors.footer}>
      <a className={styles.link} href={conf.footerLink} target="_blank" rel="noreferrer noopener">
        {conf.footerText} <img className={styles.logoImg} alt="" src={conf.footerLogo} />
      </a>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  footer: css({
    display: 'flex',
    justifyContent: 'end',
    height: '30px',
    backgroundColor: theme.colors.background.canvas,
    position: 'sticky',
    bottom: 0,
    zIndex: theme.zIndex.navbarFixed,
    padding: theme.spacing(0.5, 0),
  }),
  link: css({
    display: 'flex',
    alignItems: 'center',
  }),
  logoImg: css({
    height: '16px',
    marginLeft: theme.spacing(0.5),
  }),
});
