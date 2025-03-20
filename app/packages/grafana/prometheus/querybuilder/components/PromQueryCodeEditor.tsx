// Core Grafana history https://github.com/grafana/grafana/blob/v11.0.0-preview/public/app/plugins/datasource/prometheus/querybuilder/components/PromQueryCodeEditor.tsx
import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@data/index';
import { useStyles2 } from '@grafana-ui/index';

import { PromQueryField } from '../../components/PromQueryField';
import { PromQueryEditorProps } from '../../components/types';

import { PromQueryBuilderExplained } from './PromQueryBuilderExplained';

type PromQueryCodeEditorProps = PromQueryEditorProps & {
  showExplain: boolean;
};

export function PromQueryCodeEditor(props: PromQueryCodeEditorProps) {
  const { query, datasource, range, onRunQuery, onChange, data, app, showExplain } = props;
  const styles: any = useStyles2(getStyles as any);

  return (
    <div
      className={styles.wrapper}
    >
      <PromQueryField
        datasource={datasource}
        query={query}
        range={range}
        onRunQuery={onRunQuery}
        onChange={onChange}
        history={[]}
        data={data}
        app={app}
      />
      {showExplain && <PromQueryBuilderExplained query={query.expr} />}
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    // This wrapper styling can be removed after the old PromQueryEditor is removed.
    // This is removing margin bottom on the old legacy inline form styles
    wrapper: css({
      '.gf-form': {
        marginBottom: 0,
      },
    }),
  };
};
