import { FormEvent } from 'react';
import { useAsync } from 'react-use';

import { DataSourceInstanceSettings, SelectableValue, TimeRange } from '@data/index';
import { selectors } from '@selectors/index';
import { getDataSourceSrv } from '@runtime/index';
import { QueryVariable } from '@scenes/index';
import { DataSourceRef, VariableRefresh, VariableSort } from '@schema/index';
import { Field } from '@grafana-ui/index';
import { QueryEditor } from '~/features/dashboard-scene/settings/variables/components/QueryEditor';
import { SelectionOptionsForm } from '~/features/dashboard-scene/settings/variables/components/SelectionOptionsForm';
import { DataSourcePicker } from '~/features/datasources/components/picker/DataSourcePicker';
import { getVariableQueryEditor } from '~/features/variables/editor/getVariableQueryEditor';
import { QueryVariableRefreshSelect } from '~/features/variables/query/QueryVariableRefreshSelect';
import { QueryVariableSortSelect } from '~/features/variables/query/QueryVariableSortSelect';

import { VariableLegend } from './VariableLegend';
import { VariableTextAreaField } from './VariableTextAreaField';

type VariableQueryType = QueryVariable['state']['query'];

interface QueryVariableEditorFormProps {
  datasource?: DataSourceRef;
  onDataSourceChange: (dsSettings: DataSourceInstanceSettings) => void;
  query: VariableQueryType;
  onQueryChange: (query: VariableQueryType) => void;
  onLegacyQueryChange: (query: VariableQueryType, definition: string) => void;
  timeRange: TimeRange;
  regex: string | null;
  onRegExChange: (event: FormEvent<HTMLTextAreaElement>) => void;
  sort: VariableSort;
  onSortChange: (option: SelectableValue<VariableSort>) => void;
  refresh: VariableRefresh;
  onRefreshChange: (option: VariableRefresh) => void;
  isMulti: boolean;
  onMultiChange: (event: FormEvent<HTMLInputElement>) => void;
  allowCustomValue?: boolean;
  onAllowCustomValueChange?: (event: FormEvent<HTMLInputElement>) => void;
  includeAll: boolean;
  onIncludeAllChange: (event: FormEvent<HTMLInputElement>) => void;
  allValue: string;
  onAllValueChange: (event: FormEvent<HTMLInputElement>) => void;
}

export function QueryVariableEditorForm({
  datasource: datasourceRef,
  onDataSourceChange,
  query,
  onQueryChange,
  onLegacyQueryChange,
  timeRange,
  regex,
  onRegExChange,
  sort,
  onSortChange,
  refresh,
  onRefreshChange,
  isMulti,
  onMultiChange,
  allowCustomValue,
  onAllowCustomValueChange,
  includeAll,
  onIncludeAllChange,
  allValue,
  onAllValueChange,
}: QueryVariableEditorFormProps) {
  const { value: dsConfig } = useAsync(async () => {
    const datasource = await getDataSourceSrv().get(datasourceRef ?? '');
    const VariableQueryEditor = await getVariableQueryEditor(datasource);
    const defaultQuery = datasource?.variables?.getDefaultQuery?.();

    if (!query && defaultQuery) {
      const query =
        typeof defaultQuery === 'string' ? defaultQuery : { ...defaultQuery, refId: defaultQuery.refId ?? 'A' };
      onQueryChange(query);
    }

    return { datasource, VariableQueryEditor };
  }, [datasourceRef]);
  const { datasource, VariableQueryEditor } = dsConfig ?? {};

  return (
    <>
      <VariableLegend>Query options</VariableLegend>
      <Field label="Data source" htmlFor="data-source-picker">
        <DataSourcePicker current={datasourceRef} onChange={onDataSourceChange} variables={true} width={30} />
      </Field>

      {datasource && VariableQueryEditor && (
        <QueryEditor
          onQueryChange={onQueryChange}
          onLegacyQueryChange={onLegacyQueryChange}
          datasource={datasource}
          query={query}
          VariableQueryEditor={VariableQueryEditor}
          timeRange={timeRange}
        />
      )}

      <VariableTextAreaField
        defaultValue={regex ?? ''}
        name="Regex"
        description={
          <div>
            Optional, if you want to extract part of a series name or metric node segment.
            <br />
            Named capture groups can be used to separate the display text and value (
            <a
              className="external-link"
              href="https://grafana.com/docs/grafana/latest/variables/filter-variables-with-regex#filter-and-modify-using-named-text-and-value-capture-groups"
              target="__blank"
            >
              see examples
            </a>
            ).
          </div>
        }
        placeholder="/.*-(?<text>.*)-(?<value>.*)-.*/"
        onBlur={onRegExChange}
        testId={selectors.pages.Dashboard.Settings.Variables.Edit.QueryVariable.queryOptionsRegExInputV2}
        width={52}
      />

      <QueryVariableSortSelect
        testId={selectors.pages.Dashboard.Settings.Variables.Edit.QueryVariable.queryOptionsSortSelectV2}
        onChange={onSortChange}
        sort={sort}
      />

      <QueryVariableRefreshSelect
        testId={selectors.pages.Dashboard.Settings.Variables.Edit.QueryVariable.queryOptionsRefreshSelectV2}
        onChange={onRefreshChange}
        refresh={refresh}
      />

      <VariableLegend>Selection options</VariableLegend>
      <SelectionOptionsForm
        multi={!!isMulti}
        includeAll={!!includeAll}
        allowCustomValue={allowCustomValue}
        allValue={allValue}
        onMultiChange={onMultiChange}
        onIncludeAllChange={onIncludeAllChange}
        onAllValueChange={onAllValueChange}
        onAllowCustomValueChange={onAllowCustomValueChange}
      />
    </>
  );
}
