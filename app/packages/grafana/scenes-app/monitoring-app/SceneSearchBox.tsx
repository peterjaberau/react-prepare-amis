import React from 'react';

import { SceneComponentProps, SceneObjectState, SceneObjectBase } from '@scenes/index';
import { Input } from '@grafana-ui/index';

export interface SceneSearchBoxState extends SceneObjectState {
  value: string;
}

export class SceneSearchBox extends SceneObjectBase<SceneSearchBoxState> {
  onChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.setState({ value: evt.currentTarget.value });
  };

  static Component = ({ model }: SceneComponentProps<SceneSearchBox>) => {
    const { value } = model.useState();

    return <Input width={25} placeholder="Search..." value={value} onChange={model.onChange} />;
  };
}
