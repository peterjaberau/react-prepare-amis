import { useLocation } from 'react-router';

import {
  defaultsFromQuery,
  getDefaultSilenceFormValues,
} from '~/features/alerting/unified/components/silences/utils';
import { MATCHER_ALERT_RULE_UID } from '~/features/alerting/unified/utils/constants';
import { parseQueryParamMatchers } from '~/features/alerting/unified/utils/matchers';

import { AlertmanagerPageWrapper } from './components/AlertingPageWrapper';
import { GrafanaAlertmanagerDeliveryWarning } from './components/GrafanaAlertmanagerDeliveryWarning';
import { SilencesEditor } from './components/silences/SilencesEditor';
import { useAlertmanager } from './state/AlertmanagerContext';
import { withPageErrorBoundary } from './withPageErrorBoundary';

const SilencesEditorComponent = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { selectedAlertmanager = '' } = useAlertmanager();
  const potentialAlertRuleMatcher = parseQueryParamMatchers(queryParams.getAll('matcher')).find(
    (m) => m.name === MATCHER_ALERT_RULE_UID
  );

  const potentialRuleUid = potentialAlertRuleMatcher?.value;
  const formValues = getDefaultSilenceFormValues(defaultsFromQuery(queryParams));

  return (
    <>
      <GrafanaAlertmanagerDeliveryWarning currentAlertmanager={selectedAlertmanager} />
      <SilencesEditor
        formValues={formValues}
        alertManagerSourceName={selectedAlertmanager}
        ruleUid={potentialRuleUid}
      />
    </>
  );
};

function NewSilencePage() {
  const pageNav = {
    id: 'silence-new',
    text: 'Silence alert rule',
    subTitle: 'Configure silences to stop notifications from a particular alert rule',
  };
  return (
    <AlertmanagerPageWrapper navId="silences" pageNav={pageNav} accessType="instance">
      <SilencesEditorComponent />
    </AlertmanagerPageWrapper>
  );
}

export default withPageErrorBoundary(NewSilencePage);
