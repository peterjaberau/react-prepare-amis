import React from 'react';

import { SelectableValue } from '@data/index';
import { SceneComponentProps, SceneObjectBase, SceneObjectState } from '@scenes/index';
import { RadioButtonGroup } from '@grafana-ui/index';

export interface SceneRadioToggleState extends SceneObjectState {
  options: Array<SelectableValue<string>>;
  value: string;
}

export class SceneRadioToggle extends SceneObjectBase<SceneRadioToggleState> {
  public onChange = (value: string) => {
    this.setState({ value });
  };

  public static Component = ({ model }: SceneComponentProps<SceneRadioToggle>) => {
    const { options, value } = model.useState();

    return <RadioButtonGroup options={options} value={value} onChange={model.onChange} />;
  };
}
