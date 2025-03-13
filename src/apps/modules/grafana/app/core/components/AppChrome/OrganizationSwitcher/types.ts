import { SelectableValue } from '@data/index';
import { UserOrg } from 'app/types';

export interface OrganizationBaseProps {
  orgs: UserOrg[];
  onSelectChange: (option: SelectableValue<UserOrg>) => void;
}
