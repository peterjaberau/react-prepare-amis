import { css } from '@emotion/css';
import { FC, useCallback, useEffect, useState } from 'react';
import { useAsync } from 'react-use';

import { CoreApp, GrafanaTheme2, LoadingState, PanelData } from '@data/index';
import { getDataSourceSrv } from '@runtime/index';
import { DataQuery } from '@schema/index';
import { useStyles2 } from '@grafana-ui/index';
import { DataSourceType } from '@grafana-module/app/features/alerting/unified/utils/datasource';
import { getTimeSrv } from '@grafana-module/app/features/dashboard/services/TimeSrv';
import { QueryErrorAlert } from '@grafana-module/app/features/query/components/QueryErrorAlert';
import { LokiQueryType } from '@grafana-module/app/plugins/datasource/loki/dataquery';
import { AlertQuery } from '@grafana-module/app/types/unified-alerting-dto';

import { isPromOrLokiQuery } from '../../utils/rule-form';

import { VizWrapper } from './VizWrapper';

export interface RecordingRuleEditorProps {
  queries: AlertQuery[];
  onChangeQuery: (updatedQueries: AlertQuery[]) => void;
  runQueries: () => void;
  panelData: Record<string, PanelData>;
  dataSourceName: string;
}

export const RecordingRuleEditor: FC<RecordingRuleEditorProps> = ({
  queries,
  onChangeQuery,
  runQueries,
  panelData,
  dataSourceName,
}) => {
  const [data, setData] = useState<PanelData>({
    series: [],
    state: LoadingState.NotStarted,
    timeRange: getTimeSrv().timeRange(),
  });

  const styles = useStyles2(getStyles);

  useEffect(() => {
    setData(panelData?.[queries[0]?.refId]);
  }, [panelData, queries]);

  const {
    error,
    loading,
    value: dataSource,
  } = useAsync(() => {
    return getDataSourceSrv().get(dataSourceName);
  }, [dataSourceName]);

  const handleChangedQuery: any = useCallback(
    (changedQuery: DataQuery | any) => {
      if (!isPromOrLokiQuery(changedQuery as any) || !dataSource) {
        return;
      }

      const [query] = queries;
      const { uid: dataSourceId, type } = dataSource;
      const isLoki = type === DataSourceType.Loki;
      const expr: any = changedQuery.expr;

      const merged = {
        ...query,
        ...changedQuery,
        datasourceUid: dataSourceId,
        expr,
        model: {
          expr,
          datasource: changedQuery.datasource,
          refId: changedQuery.refId,
          editorMode: changedQuery.editorMode,
          // Instant and range are used by Prometheus queries
          instant: changedQuery.instant,
          range: changedQuery.range,
          // Query type is used by Loki queries
          // On first render/when creating a recording rule, the query type is not set
          // unless the user has changed it betwee range/instant. The cleanest way to handle this
          // is to default to instant, or whatever the changed type is
          queryType: isLoki ? changedQuery.queryType || LokiQueryType.Instant : changedQuery.queryType,
          legendFormat: changedQuery.legendFormat,
        },
      };
      onChangeQuery([merged]);
    },
    [dataSource, queries, onChangeQuery]
  );

  if (loading || dataSource?.name !== dataSourceName) {
    return null;
  }

  const dsi = getDataSourceSrv().getInstanceSettings(dataSourceName);

  if (error || !dataSource || !dataSource?.components?.QueryEditor || !dsi) {
    const errorMessage = error?.message || 'Data source plugin does not export any Query Editor component';
    return <div>Could not load query editor due to: {errorMessage}</div>;
  }

  const QueryEditor = dataSource.components.QueryEditor;

  return (
    <>
      {queries.length && (
        <>
          <QueryEditor
            query={queries[0]}
            queries={queries}
            app={CoreApp.UnifiedAlerting}
            onChange={handleChangedQuery}
            onRunQuery={runQueries}
            datasource={dataSource}
          />
          {(data?.errors || []).map((err) => {
            return <QueryErrorAlert key={err.message} error={err} />;
          })}
        </>
      )}

      {data && (
        <div className={styles.vizWrapper}>
          <VizWrapper data={data} />
        </div>
      )}
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  vizWrapper: css({
    margin: theme.spacing(1, 0),
  }),
});
