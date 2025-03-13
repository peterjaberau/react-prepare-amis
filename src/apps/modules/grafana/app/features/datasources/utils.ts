import { DataSourceJsonData, DataSourceSettings, urlUtil, locationUtil } from '@data/index';

export const constructDataSourceExploreUrl = (dataSource: DataSourceSettings<DataSourceJsonData, {}>) => {
  const exploreState = JSON.stringify({ datasource: dataSource.name, context: 'explore' });
  const exploreUrl = urlUtil.renderUrl(locationUtil.assureBaseUrl('/explore'), { left: exploreState });

  return exploreUrl;
};
