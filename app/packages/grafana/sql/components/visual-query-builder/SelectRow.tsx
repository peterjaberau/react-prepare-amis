import { css } from '@emotion/css';
import { uniqueId } from 'lodash-es';
import { useCallback } from 'react';

import { SelectableValue, toOption } from '@data/index';
import { EditorField } from '@plugin-ui/index';
import { Button, Select, Stack, useStyles2 } from '@grafana-ui/index';

import { QueryEditorExpressionType, QueryEditorFunctionExpression } from '../../expressions';
import { DB, QueryFormat, SQLExpression, SQLQuery } from '../../types';
import { createFunctionField } from '../../utils/sql.utils';
import { useSqlChange } from '../../utils/useSqlChange';

import { SelectFunctionParameters } from './SelectFunctionParameters';

interface SelectRowProps {
  query: SQLQuery;
  onQueryChange: (sql: SQLQuery) => void;
  db: DB;
  columns: Array<SelectableValue<string>>;
}

export function SelectRow({ query, onQueryChange, db, columns }: SelectRowProps) {
  const styles = useStyles2(getStyles);
  const { onSqlChange } = useSqlChange({ query, onQueryChange, db });
  const timeSeriesAliasOpts: Array<SelectableValue<string>> = [];

  // Add necessary alias options for time series format
  // when that format has been selected
  if (query.format === QueryFormat.Timeseries) {
    timeSeriesAliasOpts.push({ label: 'time', value: 'time' });
    timeSeriesAliasOpts.push({ label: 'value', value: 'value' });
  }

  const onAggregationChange = useCallback(
    (item: QueryEditorFunctionExpression, index: number) => (aggregation: SelectableValue<string>) => {
      const newItem = {
        ...item,
        name: aggregation?.value,
        parameters: [
          { type: QueryEditorExpressionType.FunctionParameter as const, name: item.parameters?.[0]?.name || '' },
        ],
      };
      const newSql: SQLExpression = {
        ...query.sql,
        columns: query.sql?.columns?.map((c, i) => (i === index ? newItem : c)),
      };

      onSqlChange(newSql);
    },
    [onSqlChange, query.sql]
  );

  const onAliasChange = useCallback(
    (item: QueryEditorFunctionExpression, index: number) => (alias: SelectableValue<string>) => {
      let newItem = { ...item };

      if (alias !== null) {
        newItem = { ...item, alias: `"${alias?.value?.trim()}"` };
      } else {
        delete newItem.alias;
      }

      const newSql: SQLExpression = {
        ...query.sql,
        columns: query.sql?.columns?.map((c, i) => (i === index ? newItem : c)),
      };

      onSqlChange(newSql);
    },
    [onSqlChange, query.sql]
  );

  const removeColumn = useCallback(
    (index: number) => () => {
      const clone = [...(query.sql?.columns || [])];
      clone.splice(index, 1);
      const newSql: SQLExpression = {
        ...query.sql,
        columns: clone,
      };
      onSqlChange(newSql);
    },
    [onSqlChange, query.sql]
  );

  const addColumn = useCallback(() => {
    const newSql: SQLExpression = { ...query.sql, columns: [...(query.sql?.columns || []), createFunctionField()] };
    onSqlChange(newSql);
  }, [onSqlChange, query.sql]);

  const aggregateOptions = () => {
    const options: Array<SelectableValue<string>> = [
      { label: 'Aggregations', options: [] },
      { label: 'Macros', options: [] },
    ];
    for (const func of db.functions()) {
      // Create groups for macros
      if (func.name.startsWith('$__')) {
        options[1].options.push({ label: func.name, value: func.name });
      } else {
        options[0].options.push({ label: func.name, value: func.name });
      }
    }
    return options;
  };

  return (
    <Stack gap={2} wrap="wrap" direction="column">
      {query.sql?.columns?.map((item, index) => (
        <div key={index}>
          <Stack gap={2} alignItems="end">
            <EditorField label="Data operations" optional width={25}>
              <Select
                value={item.name ? toOption(item.name) : null}
                inputId={`select-aggregation-${index}-${uniqueId()}`}
                isClearable
                menuShouldPortal
                allowCustomValue
                options={aggregateOptions()}
                onChange={onAggregationChange(item, index)}
              />
            </EditorField>

            <SelectFunctionParameters
              currentColumnIndex={index}
              columns={columns}
              onSqlChange={onSqlChange}
              query={query}
              db={db}
            />

            <EditorField label="Alias" optional width={15}>
              <Select
                value={item.alias ? toOption(item.alias) : null}
                inputId={`select-alias-${index}-${uniqueId()}`}
                options={timeSeriesAliasOpts}
                onChange={onAliasChange(item, index)}
                isClearable
                menuShouldPortal
                allowCustomValue
              />
            </EditorField>
            <Button
              title="Remove column"
              type="button"
              icon="trash-alt"
              variant="secondary"
              size="md"
              onClick={removeColumn(index)}
            />
          </Stack>
        </div>
      ))}
      <Button
        type="button"
        onClick={addColumn}
        variant="secondary"
        title="Add column"
        size="md"
        icon="plus"
        className={styles.addButton}
      />
    </Stack>
  );
}

const getStyles = () => {
  return {
    addButton: css({ alignSelf: 'flex-start' }),
    label: css({
      padding: 0,
      margin: 0,
      width: 'unset',
    }),
  };
};
