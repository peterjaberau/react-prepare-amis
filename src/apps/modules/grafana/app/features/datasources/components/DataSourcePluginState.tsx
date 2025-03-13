import { PluginState } from '@data/index';
import { PluginStateInfo } from 'app/features/plugins/components/PluginStateInfo';

export type Props = {
  state?: PluginState;
};

export function DataSourcePluginState({ state }: Props) {
  return (
    <div className="gf-form">
      <div className="gf-form-label width-10">Plugin state</div>
      <div className="gf-form-label gf-form-label--transparent">
        <PluginStateInfo state={state} />
      </div>
    </div>
  );
}
