import { config } from '@runtime/index';

export const isSqlDatasourceDatabaseSelectionFeatureFlagEnabled = () => {
  return !!config.featureToggles.sqlDatasourceDatabaseSelection;
};
