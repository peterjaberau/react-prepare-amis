import { DEFAULT_PER_PAGE_PAGINATION } from '@grafana-module/app/core/constants';
import { CombinedRule } from '@grafana-module/app/types/unified-alerting';

import { RuleDetailsMatchingInstances } from '../../rules/RuleDetailsMatchingInstances';

interface Props {
  rule: CombinedRule;
}

const InstancesList = ({ rule }: Props) => (
  <RuleDetailsMatchingInstances
    rule={rule}
    pagination={{ itemsPerPage: DEFAULT_PER_PAGE_PAGINATION }}
    enableFiltering
  />
);

export { InstancesList };
