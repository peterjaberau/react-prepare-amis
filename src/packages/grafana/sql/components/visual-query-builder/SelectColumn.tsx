import { useId } from 'react';

import { SelectableValue } from '@data/index';
import { EditorField } from '@grafana/plugin-ui';
import { Select } from '@grafana/ui';

interface Props {
  columns: Array<SelectableValue<string>>;
  onParameterChange: (value?: string) => void;
  value: SelectableValue<string> | null;
}

export function SelectColumn({ columns, onParameterChange, value }: Props) {
  const selectInputId = useId();

  return (
    <EditorField label="Column" width={25}>
      <Select
        value={value}
        inputId={selectInputId}
        menuShouldPortal
        options={[{ label: '*', value: '*' }, ...columns]}
        allowCustomValue
        onChange={(s) => onParameterChange(s.value)}
      />
    </EditorField>
  );
}
