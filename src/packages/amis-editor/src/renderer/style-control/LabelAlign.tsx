import {FormControlProps, FormItem} from '@/packages/amis-core/src';
import {Select} from '@/packages/amis-ui/src';
import React from 'react';

const LabelAlign: React.FC<FormControlProps> = props => {
  const store = props.manager.store;
  const node = store.getNodeById(store.activeId);
  const parent = store.getNodeById(node.parentId);
  const parentMode = parent?.schema?.mode;

  function handleSizeChange(res: any) {
    const value = res.value;
    if (!value) {
      return;
    }
    props.onChange(value);
    if (parentMode !== 'flex') {
      // Historical baggage, can only change mode
      if (value === 'inherit') {
        props.setValue(undefined, 'mode');
      } else if (value !== 'top') {
        props.setValue('horizontal', 'mode');
      } else {
        props.setValue('normal', 'mode');
      }
    }
  }

  return (
    <Select
      className=":LabelAlign"
      value={props.value || 'inherit'}
      onChange={handleSizeChange}
      clearable={false}
      options={[
        {
          label: 'Inheritance',
          value: 'inherit'
        },
        {
          label: 'Top and bottom layout',
          value: 'top'
        },
        {
          label: 'Horizontal left',
          value: 'left'
        },
        {
          label: 'Horizontal right',
          value: 'right'
        }
      ]}
    />
  );
};

@FormItem({type: 'label-align', strictMode: false})
export class LabelAlignRenderer extends React.Component<FormControlProps> {
  render() {
    return <LabelAlign {...this.props} />;
  }
}
