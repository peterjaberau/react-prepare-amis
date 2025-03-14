import { useEffect } from 'react';

import { useDispatch } from '@grafana-module/app/types';
import { StateHistoryItem } from '@grafana-module/app/types/unified-alerting';

import { fetchGrafanaAnnotationsAction } from '../state/actions';
import { AsyncRequestState } from '../utils/redux';

import { useUnifiedAlertingSelector } from './useUnifiedAlertingSelector';

export function useManagedAlertStateHistory(ruleUID: string) {
  const dispatch = useDispatch();
  const history = useUnifiedAlertingSelector<AsyncRequestState<StateHistoryItem[]>>(
    (state) => state.managedAlertStateHistory
  );

  useEffect(() => {
    dispatch(fetchGrafanaAnnotationsAction(ruleUID));
  }, [dispatch, ruleUID]);

  return history;
}
