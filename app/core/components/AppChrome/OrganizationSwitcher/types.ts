import { SelectableValue } from '@data/index';
import { UserOrg } from '~/types';

export interface OrganizationBaseProps {
  orgs: UserOrg[];
  onSelectChange: (option: SelectableValue<UserOrg>) => void;
}
