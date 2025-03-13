import { useMemo } from 'react';

import { SelectableValue } from '@data/index';
import { SQLEditor } from '@grafana/plugin-ui';

import { ExpressionQuery } from '../types';

interface Props {
  refIds: Array<SelectableValue<string>>;
  query: ExpressionQuery;
  onChange: (query: ExpressionQuery) => void;
}

export const SqlExpr = ({ onChange, refIds, query }: Props) => {
  const vars = useMemo(() => refIds.map((v) => v.value!), [refIds]);

  const initialQuery = `select * from ${vars[0]} limit 1`;

  const onEditorChange = (expression: string) => {
    onChange({
      ...query,
      expression,
    });
  };

  return <SQLEditor query={query.expression || initialQuery} onChange={onEditorChange}></SQLEditor>;
};
