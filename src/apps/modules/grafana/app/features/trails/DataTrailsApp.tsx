import { css } from '@emotion/css';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom-v5-compat';

import {
  DataQueryRequest,
  DataSourceGetTagKeysOptions,
  DataSourceGetTagValuesOptions,
  PageLayoutType,
} from '@data/index';
import { config, locationService } from '@runtime/index';
import { SceneComponentProps, SceneObjectBase, SceneObjectState, UrlSyncContextProvider } from '@scenes/index';
import { useStyles2 } from '@grafana-ui/index';
import { Page } from '@grafana-module/app/core/components/Page/Page';
import { getClosestScopesFacade, ScopesFacade, ScopesSelector } from '@grafana-module/app/features/scopes';

import { AppChromeUpdate } from '../../core/components/AppChrome/AppChromeUpdate';

import { DataTrail } from './DataTrail';
import { DataTrailsHome } from './DataTrailsHome';
import { getTrailStore } from './TrailStore/TrailStore';
import { HOME_ROUTE, RefreshMetricsEvent, TRAILS_ROUTE } from './shared';
import { getMetricName, getUrlForTrail, newMetricsTrail } from './utils';

export interface DataTrailsAppState extends SceneObjectState {
  trail: DataTrail;
  home: DataTrailsHome;
}

export class DataTrailsApp extends SceneObjectBase<DataTrailsAppState> {
  private _scopesFacade: ScopesFacade | null;

  public constructor(state: DataTrailsAppState) {
    super(state);

    this._scopesFacade = getClosestScopesFacade(this);
  }

  public enrichDataRequest(): Partial<DataQueryRequest> {
    if (!config.featureToggles.promQLScope) {
      return {};
    }

    return {
      scopes: this._scopesFacade?.value,
    };
  }

  public enrichFiltersRequest(): Partial<DataSourceGetTagKeysOptions | DataSourceGetTagValuesOptions> {
    if (!config.featureToggles.promQLScope) {
      return {};
    }

    return {
      scopes: this._scopesFacade?.value,
    };
  }

  goToUrlForTrail(trail: DataTrail) {
    locationService.push(getUrlForTrail(trail));
    this.setState({ trail });
  }

  static Component = ({ model }: SceneComponentProps<DataTrailsApp>) => {
    const { trail, home } = model.useState();

    return (
      <Routes>
        {/* The routes are relative to the HOME_ROUTE */}
        <Route
          path={'/'}
          element={
            <Page
              navId="explore/metrics"
              layout={PageLayoutType.Standard}
              // Returning null to prevent default behavior which renders a header
              renderTitle={() => null}
              subTitle=""
            >
              <home.Component model={home} />
            </Page>
          }
        />
        <Route path={TRAILS_ROUTE.replace(HOME_ROUTE, '')} element={<DataTrailView trail={trail} />} />
      </Routes>
    );
  };
}

function DataTrailView({ trail }: { trail: DataTrail }) {
  const styles = useStyles2(getStyles);
  const [isInitialized, setIsInitialized] = useState(false);
  const { metric } = trail.useState();

  useEffect(() => {
    if (!isInitialized) {
      if (trail.state.metric !== undefined) {
        getTrailStore().setRecentTrail(trail);
      }
      setIsInitialized(true);
    }
  }, [trail, isInitialized]);

  if (!isInitialized) {
    return null;
  }

  return (
    <UrlSyncContextProvider scene={trail}>
      <Page navId="explore/metrics" pageNav={{ text: getMetricName(metric) }} layout={PageLayoutType.Custom}>
        {config.featureToggles.enableScopesInMetricsExplore && (
          <AppChromeUpdate
            actions={
              <div className={styles.topNavContainer}>
                <ScopesSelector />
              </div>
            }
          />
        )}
        <trail.Component model={trail} />
      </Page>
    </UrlSyncContextProvider>
  );
}

let dataTrailsApp: DataTrailsApp;

export function getDataTrailsApp() {
  if (!dataTrailsApp) {
    const $behaviors = config.featureToggles.enableScopesInMetricsExplore
      ? [
          new ScopesFacade({
            handler: (facade) => {
              const trail = facade.parent && 'trail' in facade.parent.state ? facade.parent.state.trail : undefined;

              if (trail instanceof DataTrail) {
                trail.publishEvent(new RefreshMetricsEvent());
                trail.checkDataSourceForOTelResources();
              }
            },
          }),
        ]
      : undefined;

    dataTrailsApp = new DataTrailsApp({
      trail: newMetricsTrail(),
      home: new DataTrailsHome({}),
      $behaviors,
    });
  }

  return dataTrailsApp;
}

const getStyles = () => ({
  topNavContainer: css({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyItems: 'flex-start',
  }),
});
