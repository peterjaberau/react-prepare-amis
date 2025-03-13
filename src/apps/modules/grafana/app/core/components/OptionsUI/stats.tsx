import { StandardEditorProps, StatsPickerConfigSettings } from '@data/index';
import { StatsPicker } from '@grafana-ui/index';

export const StatsPickerEditor = ({
  value,
  onChange,
  item,
  id,
}: StandardEditorProps<string[], StatsPickerConfigSettings>) => {
  return (
    <StatsPicker
      stats={value}
      onChange={onChange}
      allowMultiple={!!item.settings?.allowMultiple}
      defaultStat={item.settings?.defaultStat}
      inputId={id}
    />
  );
};
