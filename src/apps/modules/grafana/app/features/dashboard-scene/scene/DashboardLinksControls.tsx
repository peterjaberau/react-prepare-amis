import { sanitizeUrl } from '@data/text/sanitize';
import { sceneGraph } from '@scenes/index';
import { DashboardLink } from '@schema/index';
import { Badge, Tooltip } from '@grafana-ui/index';
import {
  DashboardLinkButton,
  DashboardLinksDashboard,
} from '@grafana-module/app/features/dashboard/components/SubMenu/DashboardLinksDashboard';
import { getLinkSrv } from '@grafana-module/app/features/panel/panellinks/link_srv';

import { LINK_ICON_MAP } from '../settings/links/utils';

import { DashboardScene } from './DashboardScene';

export interface Props {
  links: DashboardLink[];
  dashboard: DashboardScene;
}

export function DashboardLinksControls({ links, dashboard }: Props) {
  sceneGraph.getTimeRange(dashboard).useState();
  const uid = dashboard.state.uid;

  if (!links || !uid) {
    return null;
  }

  return (
    <>
      {links.map((link: DashboardLink, index: number) => {
        const linkInfo = getLinkSrv().getAnchorInfo(link);
        const key = `${link.title}-$${index}`;

        if (link.type === 'dashboards') {
          return <DashboardLinksDashboard key={key} link={link} linkInfo={linkInfo} dashboardUID={uid} />;
        }

        const icon = LINK_ICON_MAP[link.icon];

        const linkElement = (
          <DashboardLinkButton
            icon={icon}
            href={sanitizeUrl(linkInfo.href)}
            target={link.targetBlank ? '_blank' : undefined}
            rel="noreferrer"
            data-testid={selectors.components.DashboardLinks.link}
          >
            {linkInfo.title}
          </DashboardLinkButton>
        );

        return (
        <div key={key} data-testid={selectors.components.DashboardLinks.container}>
          <Badge text={"DashboardLinksControls"} color={"darkgrey"} style={{ position: 'absolute', top: 0, left: 0, zIndex:1000}}  />

          {link.tooltip ? <Tooltip content={linkInfo.tooltip}>{linkElement}</Tooltip> : linkElement}
          </div>
        );
      })}
    </>
  );
}
