import { Badge } from '@grafana-ui/index';
import { PageInfoItem } from '@grafana-module/app/core/components/Page/types';

type DataSourceInfo = {
  dataSourcePluginName: string;
  alertingSupported: boolean;
};

export const useDataSourceInfo = (dataSourceInfo: DataSourceInfo): PageInfoItem[] => {
  const info: PageInfoItem[] = [];
  const alertingEnabled = dataSourceInfo.alertingSupported;

  info.push({
    label: 'Type',
    value: dataSourceInfo.dataSourcePluginName,
  });

  info.push({
    label: 'Alerting',
    value: (
      <Badge color={alertingEnabled ? 'green' : 'red'} text={alertingEnabled ? 'Supported' : 'Not supported'}></Badge>
    ),
  });

  return info;
};
