import { SelectableValue } from '@data/index';
import { Segment } from '@grafana-ui/index';

interface Props {
  value: string;
  onChange: (item: SelectableValue<string>) => void;
  disabled?: boolean;
}

const options = ['=', '!=', '<', '>', '=~', '!~'].map<SelectableValue<string>>((value) => ({
  label: value,
  value,
}));

export const OperatorSegment = ({ value, disabled, onChange }: Props) => {
  return (
    <Segment
      className="query-segment-operator"
      value={value}
      disabled={disabled}
      options={options}
      onChange={onChange}
    />
  );
};
