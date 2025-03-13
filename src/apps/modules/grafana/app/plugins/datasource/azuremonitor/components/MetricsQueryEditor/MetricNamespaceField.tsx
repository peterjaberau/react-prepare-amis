import { useCallback } from 'react';

import { SelectableValue } from '@data/index';
import { Select } from '@grafana-ui/index';

import { AzureQueryEditorFieldProps, AzureMonitorOption } from '../../types';
import { addValueToOptions } from '../../utils/common';
import { Field } from '../shared/Field';

import { setCustomNamespace } from './setQueryValue';

interface MetricNamespaceFieldProps extends AzureQueryEditorFieldProps {
  metricNamespaces: AzureMonitorOption[];
}

const MetricNamespaceField = ({
  metricNamespaces,
  query,
  variableOptionGroup,
  onQueryChange,
}: MetricNamespaceFieldProps) => {
  const handleChange = useCallback(
    (change: SelectableValue<string>) => {
      if (!change.value) {
        return;
      }

      const newQuery = setCustomNamespace(query, change.value);
      onQueryChange(newQuery);
    },
    [onQueryChange, query]
  );

  const value = query.azureMonitor?.customNamespace || query.azureMonitor?.metricNamespace;
  const options = addValueToOptions(metricNamespaces, variableOptionGroup, value);

  return (
    <Field label="Metric namespace">
      <Select
        inputId="azure-monitor-metrics-metric-namespace-field"
        value={value || null}
        onChange={handleChange}
        options={options}
        allowCustomValue
      />
    </Field>
  );
};

export default MetricNamespaceField;
