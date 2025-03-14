import { SelectableValue } from '@data/index';
import { ValuePicker } from '@grafana-ui/index';

export type AddLayerButtonProps = {
  onChange: (sel: SelectableValue<string>) => void;
  options: Array<SelectableValue<string>>;
  label: string;
};

export const AddLayerButton = ({ onChange, options, label }: AddLayerButtonProps) => {
  return (
    <ValuePicker
      icon="plus"
      label={label}
      variant="secondary"
      options={options}
      onChange={onChange}
      isFullWidth={true}
    />
  );
};
