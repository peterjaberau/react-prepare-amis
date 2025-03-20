import { useCallback, useMemo } from 'react';

import { SelectableValue } from '@data/index';
import { SceneObject, sceneGraph } from '@scenes/index';
import { Select } from '@grafana-ui/index';
import { useSelector } from '~/types';

import { getLastKey, getVariablesByKey } from '../../../variables/state/selectors';

export interface Props {
  id?: string;
  repeat?: string;
  onChange: (name?: string) => void;
}

export const RepeatRowSelect = ({ repeat, onChange, id }: Props) => {
  const variables = useSelector((state) => {
    return getVariablesByKey(getLastKey(state), state);
  });

  const variableOptions = useMemo(() => {
    const options: Array<SelectableValue<string | null>> = variables.map((item) => {
      return { label: item.name, value: item.name };
    });

    if (options.length === 0) {
      options.unshift({
        label: 'No template variables found',
        value: null,
      });
    }

    options.unshift({
      label: 'Disable repeating',
      value: null,
    });

    return options;
  }, [variables]);

  const onSelectChange = useCallback((option: SelectableValue<string | null>) => onChange(option.value!), [onChange]);

  return <Select inputId={id} value={repeat} onChange={onSelectChange} options={variableOptions} />;
};

interface Props2 {
  sceneContext: SceneObject;
  repeat: string | undefined;
  id?: string;
  onChange: (name?: string) => void;
}

export const RepeatRowSelect2 = ({ sceneContext, repeat, id, onChange }: Props2) => {
  const sceneVars = useMemo(() => sceneGraph.getVariables(sceneContext.getRoot()), [sceneContext]);
  const variables = sceneVars.useState().variables;

  const variableOptions = useMemo(() => {
    const options: Array<SelectableValue<string | null>> = variables.map((item) => ({
      label: item.state.name,
      value: item.state.name,
    }));

    if (options.length === 0) {
      options.unshift({
        label: 'No template variables found',
        value: null,
      });
    }

    options.unshift({
      label: 'Disable repeating',
      value: null,
    });

    return options;
  }, [variables]);

  const onSelectChange = useCallback((option: SelectableValue<string | null>) => onChange(option.value!), [onChange]);

  return <Select inputId={id} value={repeat} onChange={onSelectChange} options={variableOptions} />;
};
