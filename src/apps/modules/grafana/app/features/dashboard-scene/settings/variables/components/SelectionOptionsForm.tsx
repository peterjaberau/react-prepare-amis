import { ChangeEvent, FormEvent } from 'react';

import { Stack } from '@grafana-ui/index';
import { VariableCheckboxField } from '@grafana-module/app/features/dashboard-scene/settings/variables/components/VariableCheckboxField';
import { VariableTextField } from '@grafana-module/app/features/dashboard-scene/settings/variables/components/VariableTextField';

interface SelectionOptionsFormProps {
  multi: boolean;
  includeAll: boolean;
  allowCustomValue?: boolean;
  allValue?: string | null;
  onMultiChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAllowCustomValueChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onIncludeAllChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAllValueChange: (event: FormEvent<HTMLInputElement>) => void;
}

export function SelectionOptionsForm({
  multi,
  allowCustomValue,
  includeAll,
  allValue,
  onMultiChange,
  onAllowCustomValueChange,
  onIncludeAllChange,
  onAllValueChange,
}: SelectionOptionsFormProps) {
  return (
    <Stack direction="column" gap={2} height="inherit" alignItems="start">
      <VariableCheckboxField
        value={multi}
        name="Multi-value"
        description="Enables multiple values to be selected at the same time"
        onChange={onMultiChange}
      />
      {onAllowCustomValueChange && ( // backwards compat with old arch, remove on cleanup
        <VariableCheckboxField
          value={allowCustomValue ?? true}
          name="Allow custom values"
          description="Enables users to add custom values to the list"
          onChange={onAllowCustomValueChange}
        />
      )}
      <VariableCheckboxField
        value={includeAll}
        name="Include All option"
        description="Enables an option to include all variables"
        onChange={onIncludeAllChange}
      />
      {includeAll && (
        <VariableTextField
          defaultValue={allValue ?? ''}
          onBlur={onAllValueChange}
          name="Custom all value"
          placeholder="blank = auto"
        />
      )}
    </Stack>
  );
}
