import { config } from '@runtime/index';
import { Alert } from '@grafana-ui/index';

const EvaluationIntervalLimitExceeded = () => (
  <Alert severity="warning" title="Global evaluation interval limit exceeded">
    A minimum evaluation interval of <strong>{config.unifiedAlerting.minInterval}</strong> has been configured in
    Grafana.
    <br />
    Please contact the administrator to configure a lower interval.
  </Alert>
);

export { EvaluationIntervalLimitExceeded };
