import { css } from '@emotion/css';
import { ComponentType, ReactNode, useEffect } from "react";
// eslint-disable-next-line no-restricted-imports
import { BrowserRouter as Router } from 'react-router-dom';
// import { useDynamicRouter} from '@/router-context';

import { GrafanaTheme2 } from '@data/index';
import {
  locationService,
  LocationServiceProvider,
  useChromeHeaderHeight,
  useSidecar_EXPERIMENTAL,
} from '@runtime/index';
import { GlobalStyles, IconButton, ModalRoot, Stack, useSplitter, useStyles2 } from '@grafana-ui/index';

import { AngularRoot } from '../angular/AngularRoot';
import { AppChrome } from '../core/components/AppChrome/AppChrome';
import { AppNotificationList } from '../core/components/AppNotifications/AppNotificationList';
import { ModalsContextProvider } from '../core/context/ModalsContextProvider';
import { QueriesDrawerContextProvider } from '../features/explore/QueriesDrawer/QueriesDrawerContext';

function ExtraProviders(props: { children: ReactNode; providers: Array<ComponentType<{ children: ReactNode }>> }) {
  return props.providers.reduce((tree, Provider): ReactNode => {
    return <Provider>{tree}</Provider>;
  }, props.children);
}

type RouterWrapperProps = {
  routes?: JSX.Element | false | { path: string; element: JSX.Element }[] | any;
  bodyRenderHooks: ComponentType[];
  pageBanners: ComponentType[];
  providers: Array<ComponentType<{ children: ReactNode }>>;
};
export function RouterWrapper(props: RouterWrapperProps) {
  // const { registerRoutes } = useDynamicRouter();

  // Register routes dynamically when RouterWrapper is mounted
  // useEffect(() => {
  //   registerRoutes(props.routes);
  // }, [registerRoutes, props.routes]);


  return (
      <>
        <Router>
          <LocationServiceProvider service={locationService}>
            <QueriesDrawerContextProvider>
              <ExtraProviders providers={props.providers}>
                <ModalsContextProvider>
                  <AppChrome>
                    <AngularRoot />
                    <AppNotificationList />
                    <Stack gap={0} grow={1} direction="column">
                      {props.pageBanners.map((Banner, index) => (
                        <Banner key={index.toString()} />
                      ))}
                      {props.routes}
                    </Stack>
                    {props.bodyRenderHooks.map((Hook, index) => (
                      <Hook key={index.toString()} />
                    ))}
                  </AppChrome>
                  <ModalRoot />
                </ModalsContextProvider>
              </ExtraProviders>
            </QueriesDrawerContextProvider>
          </LocationServiceProvider>
        </Router>
      </>
  );
}

export function ExperimentalSplitPaneRouterWrapper(props: RouterWrapperProps) {
  const { closeApp, locationService, activePluginId } = useSidecar_EXPERIMENTAL();

  let { containerProps, primaryProps, secondaryProps, splitterProps } = useSplitter({
    direction: 'row',
    initialSize: 0.6,
    dragPosition: 'end',
    handleSize: 'sm',
  });

  function alterStyles<T extends { style: React.CSSProperties }>(props: T): T {
    return {
      ...props,
      style: { ...props.style, overflow: 'auto', minWidth: 'unset', minHeight: 'unset' },
    };
  }
  primaryProps = alterStyles(primaryProps);
  secondaryProps = alterStyles(secondaryProps);

  const headerHeight = useChromeHeaderHeight();
  const styles = useStyles2(getStyles, headerHeight);

  const sidecarOpen = Boolean(activePluginId);

  return (
    <div {...(sidecarOpen ? containerProps : { className: styles.dummyWrapper })}>
      <div {...(sidecarOpen ? primaryProps : { className: styles.dummyWrapper })}>
        <RouterWrapper {...props} />
      </div>
      {sidecarOpen && (
        <>
          <div {...splitterProps} />
          <div {...secondaryProps}>
            <Router>
              <LocationServiceProvider service={locationService}>
                <GlobalStyles />
                <div className={styles.secondAppChrome}>
                  <div className={styles.secondAppToolbar}>
                    <IconButton
                      size={'lg'}
                      style={{ margin: '8px' }}
                      name={'times'}
                      aria-label={'close'}
                      onClick={() => closeApp()}
                    />
                  </div>
                  <div className={styles.secondAppWrapper}>
                    {props.routes}
                  </div>
                </div>
              </LocationServiceProvider>
            </Router>
          </div>
        </>
      )}
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2, headerHeight: number | undefined) => {
  return {
    secondAppChrome: css({
      label: 'secondAppChrome',
      display: 'flex',
      height: '100%',
      width: '100%',
      paddingTop: headerHeight || 0,
      flexGrow: 1,
      flexDirection: 'column',
    }),

    secondAppToolbar: css({
      label: 'secondAppToolbar',
      display: 'flex',
      justifyContent: 'flex-end',
    }),

    secondAppWrapper: css({
      label: 'secondAppWrapper',
      overflow: 'auto',
      flex: '1',
    }),

    dummyWrapper: css({
      label: 'dummyWrapper',
      display: 'flex',
      height: '100vh',
      flexDirection: 'column',
    }),
  };
};
