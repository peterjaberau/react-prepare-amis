import { ReducersMapObject } from '@reduxjs/toolkit';
import { AnyAction, combineReducers } from 'redux';

import sharedReducers from '@grafana-module/app/core/reducers';
import ldapReducers from '@grafana-module/app/features/admin/state/reducers';
import alertingReducers from '@grafana-module/app/features/alerting/state/reducers';
import apiKeysReducers from '@grafana-module/app/features/api-keys/state/reducers';
import authConfigReducers from '@grafana-module/app/features/auth-config/state/reducers';
import { browseDashboardsAPI } from '@grafana-module/app/features/browse-dashboards/api/browseDashboardsAPI';
import browseDashboardsReducers from '@grafana-module/app/features/browse-dashboards/state/slice';
import { publicDashboardApi } from '@grafana-module/app/features/dashboard/api/publicDashboardApi';
import panelEditorReducers from '@grafana-module/app/features/dashboard/components/PanelEditor/state/reducers';
import dashboardReducers from '@grafana-module/app/features/dashboard/state/reducers';
import dataSourcesReducers from '@grafana-module/app/features/datasources/state/reducers';
import exploreReducers from '@grafana-module/app/features/explore/state/main';
import foldersReducers from '@grafana-module/app/features/folders/state/reducers';
import invitesReducers from '@grafana-module/app/features/invites/state/reducers';
import importDashboardReducers from '@grafana-module/app/features/manage-dashboards/state/reducers';
import { cloudMigrationAPI } from '@grafana-module/app/features/migrate-to-cloud/api';
import organizationReducers from '@grafana-module/app/features/org/state/reducers';
import panelsReducers from '@grafana-module/app/features/panel/state/reducers';
import { reducer as pluginsReducer } from '@grafana-module/app/features/plugins/admin/state/reducer';
import userReducers from '@grafana-module/app/features/profile/state/reducers';
import serviceAccountsReducer from '@grafana-module/app/features/serviceaccounts/state/reducers';
import supportBundlesReducer from '@grafana-module/app/features/support-bundles/state/reducers';
import teamsReducers from '@grafana-module/app/features/teams/state/reducers';
import usersReducers from '@grafana-module/app/features/users/state/reducers';
import templatingReducers from '@grafana-module/app/features/variables/state/keyedVariablesReducer';

import { alertingApi } from '@grafana-module/app/features/alerting/unified/api/alertingApi';
import { iamApi } from '@grafana-module/app/features/iam/api/api';
import { userPreferencesAPI } from '@grafana-module/app/features/preferences/api';
import { cleanUpAction } from '../actions/cleanUp';

const rootReducers = {
  ...sharedReducers,
  ...alertingReducers,
  ...teamsReducers,
  ...apiKeysReducers,
  ...foldersReducers,
  ...dashboardReducers,
  ...exploreReducers,
  ...dataSourcesReducers,
  ...usersReducers,
  ...serviceAccountsReducer,
  ...userReducers,
  ...invitesReducers,
  ...organizationReducers,
  ...browseDashboardsReducers,
  ...ldapReducers,
  ...importDashboardReducers,
  ...panelEditorReducers,
  ...panelsReducers,
  ...templatingReducers,
  ...supportBundlesReducer,
  ...authConfigReducers,
  plugins: pluginsReducer,
  [alertingApi.reducerPath]: alertingApi.reducer,
  [publicDashboardApi.reducerPath]: publicDashboardApi.reducer,
  [browseDashboardsAPI.reducerPath]: browseDashboardsAPI.reducer,
  [cloudMigrationAPI.reducerPath]: cloudMigrationAPI.reducer,
  [iamApi.reducerPath]: iamApi.reducer,
  [userPreferencesAPI.reducerPath]: userPreferencesAPI.reducer,
};

const addedReducers = {};

export const addReducer = (newReducers: ReducersMapObject) => {
  Object.assign(addedReducers, newReducers);
};

export const createRootReducer = () => {
  const appReducer = combineReducers({
    ...rootReducers,
    ...addedReducers,
  });

  return (state: Parameters<typeof appReducer>[0], action: AnyAction) => {
    if (action.type !== cleanUpAction.type) {
      return appReducer(state, action);
    }

    const { cleanupAction } = action.payload;
    cleanupAction(state);

    return appReducer(state, action);
  };
};
