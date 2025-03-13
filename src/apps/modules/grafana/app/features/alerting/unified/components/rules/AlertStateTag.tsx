import { memo } from 'react';

import { AlertState } from '@data/index';
import { Icon, Tooltip } from '@grafana-ui/index';
import { GrafanaAlertState, GrafanaAlertStateWithReason, PromAlertingRuleState } from '@grafana-module/app/types/unified-alerting-dto';

import { alertStateToReadable, alertStateToState } from '../../utils/rules';
import { StateTag } from '../StateTag';
interface Props {
  state: PromAlertingRuleState | GrafanaAlertState | GrafanaAlertStateWithReason | AlertState;
  size?: 'md' | 'sm';
  isPaused?: boolean;
  muted?: boolean;
}

export const AlertStateTag = memo(({ state, isPaused = false, size = 'md', muted = false }: Props) => {
  if (isPaused) {
    return (
      <Tooltip content={'Alert evaluation is currently paused'} placement="top">
        <StateTag state="warning" size={size} muted={muted}>
          <Icon name="pause" size="xs" /> Paused
        </StateTag>
      </Tooltip>
    );
  }
  return (
    <StateTag state={alertStateToState(state)} size={size} muted={muted}>
      {alertStateToReadable(state)}
    </StateTag>
  );
});
AlertStateTag.displayName = 'AlertStateTag';
