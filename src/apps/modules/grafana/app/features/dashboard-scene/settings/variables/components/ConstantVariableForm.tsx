import { FormEvent } from 'react';


import { VariableLegend } from './VariableLegend';
import { VariableTextField } from './VariableTextField';

interface ConstantVariableFormProps {
  constantValue: string;
  onChange: (event: FormEvent<HTMLInputElement>) => void;
}

export function ConstantVariableForm({ onChange, constantValue }: ConstantVariableFormProps) {
  return (
    <>
      <VariableLegend>Constant options</VariableLegend>
      <VariableTextField
        defaultValue={constantValue}
        name="Value"
        placeholder="your metric prefix"
        onBlur={onChange}
        width={30}
      />
    </>
  );
}
