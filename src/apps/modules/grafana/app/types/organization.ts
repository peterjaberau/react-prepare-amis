import { UserOrg } from '@grafana-module/app/types';

export interface Organization {
  name: string;
  id: number;
}

export interface OrganizationState {
  organization: Organization;
  userOrgs: UserOrg[];
}
