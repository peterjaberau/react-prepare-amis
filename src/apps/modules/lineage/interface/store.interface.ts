

import { AuthenticationConfiguration } from '../generated/configuration/authenticationConfiguration';
import { AuthorizerConfiguration } from '../generated/configuration/authorizerConfiguration';
import { LineageSettings } from '../generated/configuration/lineageSettings';
import { LoginConfiguration } from '../generated/configuration/loginConfiguration';
import { LogoConfiguration } from '../generated/configuration/logoConfiguration';
import { SearchSettings } from '../generated/configuration/searchSettings';
import { UIThemePreference } from '../generated/configuration/uiThemePreference';
import { Domain } from '../generated/entity/domains/domain';
import { User } from '../generated/entity/teams/user';
import { EntityReference } from '../generated/entity/type';

export interface HelperFunctions {
  onLoginHandler: () => void;
  onLogoutHandler: () => void;
  handleSuccessfulLogin: (user: any) => Promise<void>;
  handleFailedLogin: () => void;
  updateAxiosInterceptors: () => void;
}

export interface AppPreferences {
  lineageConfig?: LineageSettings;
  searchConfig?: SearchSettings;
}

export interface ApplicationStore {
  [key: string]: any;
  isApplicationLoading: boolean;
  setApplicationLoading: (loading: boolean) => void;
  userProfilePics: Record<string, User>;
  cachedEntityData: Record<string, any>;
  selectedPersona: EntityReference;
  authConfig?: any;
  applicationConfig?: UIThemePreference;
  searchCriteria: any | '';
  theme: UIThemePreference['customTheme'];
  inlineAlertDetails?: any;
  applications: string[];
  appPreferences: AppPreferences;
  setInlineAlertDetails: (alertDetails?: any) => void;
  setSelectedPersona: (persona: EntityReference) => void;
  setApplicationConfig: (config: UIThemePreference) => void;
  setAppPreferences: (preferences: AppPreferences) => void;
  setCurrentUser: (user: User) => void;
  setAuthConfig: (authConfig: any) => void;
  setAuthorizerConfig: (authorizerConfig: AuthorizerConfiguration) => void;
  setJwtPrincipalClaims: (
    claims: AuthenticationConfiguration['jwtPrincipalClaims']
  ) => void;
  setJwtPrincipalClaimsMapping: (
    claimsMapping: AuthenticationConfiguration['jwtPrincipalClaimsMapping']
  ) => void;
  setHelperFunctionsRef: (helperFunctions: HelperFunctions) => void;
  updateUserProfilePics: (data: { id: string; user: User }) => void;
  updateCachedEntityData: (data: {
    id: string;
    entityDetails: any;
  }) => void;
  updateSearchCriteria: (criteria: any | '') => void;
  setApplicationsName: (applications: string[]) => void;
}

export interface DomainStore {
  domains: Domain[];
  userDomains: EntityReference[];
  domainLoading: boolean;
  activeDomain: string;
  activeDomainEntityRef?: EntityReference;
  domainOptions: any[];
  updateDomains: (domainsArr: Domain[], selectDefault?: boolean) => void;
  updateActiveDomain: (domain: EntityReference) => void;
  setDomains: (domains: Domain[]) => void;
  setUserDomains: (userDomainsArr: EntityReference[]) => void;
  updateDomainLoading: (loading: boolean) => void;
}
