import { css } from '@emotion/css';
import { DOMAttributes } from '@react-types/shared';
import { memo, forwardRef, useCallback } from 'react';
import { useLocation } from 'react-router';

import { GrafanaTheme2, NavModelItem } from '@data/index';
import { config, reportInteraction } from '@runtime/index';
import { ScrollContainer, useStyles2, Stack } from '@grafana-ui/index';
import { useGrafana } from '~/core/context/GrafanaContext';
import { t } from '~/core/internationalization';
import { setBookmark } from '~/core/reducers/navBarTree';
import { usePatchUserPreferencesMutation } from "@grafana-module/app/features/preferences/api";
import { useDispatch, useSelector } from '~/types';

import { TOP_BAR_LEVEL_HEIGHT } from '../types';

import { MegaMenuHeader } from './MegaMenuHeader';
import { MegaMenuItem } from './MegaMenuItem';
import { usePinnedItems } from './hooks';
import { enrichWithInteractionTracking, findByUrl, getActiveItem } from './utils';

export const MENU_WIDTH = '300px';

export interface Props extends DOMAttributes {
  onClose: () => void;
}

export const MegaMenu = memo(
  forwardRef<HTMLDivElement, Props>(({ onClose, ...restProps }, ref) => {
    const navTree: any = useSelector((state) => state.navBarTree);
    const styles = useStyles2(getStyles);
    const location = useLocation();
    const { chrome } = useGrafana();
    const dispatch = useDispatch();
    const state = chrome.useState();
    const [patchPreferences] = usePatchUserPreferencesMutation();
    const pinnedItems = usePinnedItems();

    // Remove profile + help from tree
    const navItems = navTree
      .filter((item: any) => item.id !== 'profile' && item.id !== 'help')
      .map((item: any) => enrichWithInteractionTracking(item, state.megaMenuDocked));

    if (config.featureToggles.pinNavItems) {
      const bookmarksItem = findByUrl(navItems, '/bookmarks');
      if (bookmarksItem) {
        // Add children to the bookmarks section
        bookmarksItem.children = pinnedItems.reduce((acc: NavModelItem[], url: any) => {
          const item = findByUrl(navItems, url);
          if (!item) {
            return acc;
          }
          const newItem = {
            id: item.id,
            text: item.text,
            url: item.url,
            parentItem: { id: 'bookmarks', text: 'Bookmarks' },
          };
          acc.push(enrichWithInteractionTracking(newItem, state.megaMenuDocked));
          return acc;
        }, []);
      }
    }

    const activeItem = getActiveItem(navItems, state.sectionNav.node, location.pathname);

    const handleMegaMenu = () => {
      chrome.setMegaMenuOpen(!state.megaMenuOpen);
    };

    const handleDockedMenu = () => {
      chrome.setMegaMenuDocked(!state.megaMenuDocked);
      if (state.megaMenuDocked) {
        chrome.setMegaMenuOpen(false);
      }
    };

    const isPinned = useCallback(
      (url?: string) => {
        if (!url || !pinnedItems?.length) {
          return false;
        }
        return pinnedItems?.includes(url);
      },
      [pinnedItems]
    );

    const onPinItem = (item: NavModelItem) => {
      const url = item.url;
      if (url && config.featureToggles.pinNavItems) {
        const isSaved = isPinned(url);
        const newItems = isSaved ? pinnedItems.filter((i: any) => url !== i) : [...pinnedItems, url];
        const interactionName = isSaved ? 'grafana_nav_item_unpinned' : 'grafana_nav_item_pinned';
        reportInteraction(interactionName, {
          path: url,
        });
        patchPreferences({
          patchPrefsCmd: {
            navbar: {
              bookmarkUrls: newItems,
            },
          },
        }).then((data) => {
          if (!data.error) {
            dispatch(setBookmark({ item: item, isSaved: !isSaved }));
          }
        });
      }
    };

    return (
      <div  ref={ref} {...restProps}>
        <MegaMenuHeader handleDockedMenu={handleDockedMenu} handleMegaMenu={handleMegaMenu} onClose={onClose} />
        <nav className={styles.content}>
          <ScrollContainer height="100%" overflowX="hidden" showScrollIndicators>
            <ul className={styles.itemList} aria-label={t('navigation.megamenu.list-label', 'Navigation')}>
              {navItems.map((link: any, index: any) => (
                <Stack key={link.text} direction={index === 0 ? 'row-reverse' : 'row'} alignItems="start">
                  <MegaMenuItem
                    link={link}
                    isPinned={isPinned}
                    onClick={state.megaMenuDocked ? undefined : onClose}
                    activeItem={activeItem}
                    onPin={onPinItem}
                  />
                </Stack>
              ))}
            </ul>
          </ScrollContainer>
        </nav>
      </div>
    );
  })
);

MegaMenu.displayName = 'MegaMenu';

const getStyles = (theme: GrafanaTheme2) => {
  return {
    content: css({
      display: 'flex',
      flexDirection: 'column',
      height: `calc(100% - ${TOP_BAR_LEVEL_HEIGHT}px)`,
      minHeight: 0,
      position: 'relative',
    }),
    mobileHeader: css({
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(1, 1, 1, 2),
      borderBottom: `1px solid ${theme.colors.border.weak}`,

      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    }),
    itemList: css({
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      listStyleType: 'none',
      padding: theme.spacing(1, 1, 2, 1),
      [theme.breakpoints.up('md')]: {
        width: MENU_WIDTH,
      },
    }),
    dockMenuButton: css({
      display: 'none',
      position: 'relative',
      top: theme.spacing(1),

      [theme.breakpoints.up('xl')]: {
        display: 'inline-flex',
      },
    }),
  };
};
