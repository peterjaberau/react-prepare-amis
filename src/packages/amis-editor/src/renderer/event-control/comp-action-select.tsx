/**
 * Component-specific action selector
 */

import {Option, Select} from 'amis';
import {RendererProps, getRendererByName} from 'amis-core';
import React from 'react';
import {getActionsByRendererName} from './helper';

//Basic configuration items for actions
export const BASE_ACTION_PROPS = [
  'actionType',
  '__actionDesc',
  'preventDefault',
  'stopPropagation',
  'expression'
  // 'outputVar'
];

export default class CmptActionSelect extends React.Component<RendererProps> {
  onChange(option: Option) {
    const {formStore} = this.props;
    let removeKeys: {
      [key: string]: any;
    } = {};

    // Keep required fields and filter out others
    Object.keys(formStore.data).forEach((key: string) => {
      if (
        ![
          ...BASE_ACTION_PROPS,
          'componentId',
          '__rendererName',
          '__cmptTreeSource',
          '__isScopeContainer',
          '__cmptId'
        ].includes(key)
      ) {
        removeKeys[key] = undefined;
      }
    });

    formStore.setValues({
      ...removeKeys,
      args: undefined,
      groupType: option.value,
      __cmptActionDesc: option.description
    });
    if (
      formStore.data.actionType === 'component' &&
      formStore.data.groupType === 'setValue'
    ) {
      formStore.setValueByName('args.__containerType', 'all');
      formStore.setValueByName('args.__comboType', 'all');
    }

    this.props.onChange(option.value);
  }
  render() {
    const {data, formStore} = this.props;
    // Get actions from the component tree based on type
    const actions = getActionsByRendererName(
      data.pluginActions,
      data.__rendererName
    );

    return (
      <Select
        value={formStore.data.groupType}
        className="cmpt-action-select"
        options={actions.map((item: any) => ({
          label: item.actionLabel,
          value: item.actionType,
          description: item.description
        }))}
        onChange={this.onChange.bind(this)}
        clearable={false}
      />
    );
  }
}
