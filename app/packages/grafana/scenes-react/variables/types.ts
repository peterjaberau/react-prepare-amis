import { VariableValue } from '@scenes/index';
import { VariableHide } from '@schema/index';

export interface VariableProps {
  name: string;
  label?: string;
  hide?: VariableHide;
  initialValue?: VariableValue;
}
