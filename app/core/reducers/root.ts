import { ReducersMapObject } from '@reduxjs/toolkit';
import { AnyAction, combineReducers } from 'redux';

import sharedReducers from '~/core/reducers';
import ldapReducers from '~/features/admin/state/reducers';
import alertingReducers from '~/features/alerting/state/reducers';
import apiKeysReducers from '~/features/api-keys/state/reducers';
import authConfigReducers from '~/features/auth-config/state/reducers';
import { browseDashboardsAPI } from '~/features/browse-dashboards/api/browseDashboardsAPI';
import browseDashboardsReducers from '~/features/browse-dashboards/state/slice';
import { publicDashboardApi } from '~/features/dashboard/api/publicDashboardApi';
import panelEditorReducers from '~/features/dashboard/components/PanelEditor/state/reducers';
import dashboardReducers from '~/features/dashboard/state/reducers';
import dataSourcesReducers from '~/features/datasources/state/reducers';
import exploreReducers from '~/features/explore/state/main';
import foldersReducers from '~/features/folders/state/reducers';
import invitesReducers from '~/features/invites/state/reducers';
import importDashboardReducers from '~/features/manage-dashboards/state/reducers';
import { cloudMigrationAPI } from '~/features/migrate-to-cloud/api';
import organizationReducers from '~/features/org/state/reducers';
import panelsReducers from '~/features/panel/state/reducers';
import { reducer as pluginsReducer } from '~/features/plugins/admin/state/reducer';
import userReducers from '~/features/profile/state/reducers';
import serviceAccountsReducer from '~/features/serviceaccounts/state/reducers';
import supportBundlesReducer from '~/features/support-bundles/state/reducers';
import teamsReducers from '~/features/teams/state/reducers';
import usersReducers from '~/features/users/state/reducers';
import templatingReducers from '~/features/variables/state/keyedVariablesReducer';

import { alertingApi } from '~/features/alerting/unified/api/alertingApi';
import { iamApi } from '~/features/iam/api/api';
import { userPreferencesAPI } from '~/features/preferences/api';
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
