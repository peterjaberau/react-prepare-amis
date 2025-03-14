import { SelectableValue } from '@data/index';
import { UserOrg } from '@grafana-module/app/types';

export interface OrganizationBaseProps {
  orgs: UserOrg[];
  onSelectChange: (option: SelectableValue<UserOrg>) => void;
}
