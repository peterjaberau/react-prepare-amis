
import { create } from 'zustand';
import { getOidcToken } from '../utils/LocalStorageUtils';
import { getThemeConfig } from '../utils/ThemeUtils';

export const OM_SESSION_KEY = 'om-session';

export const useApplicationStore = create()((set, get) => ({
  isApplicationLoading: false,
  theme: getThemeConfig(),
  applicationConfig: {
    customTheme: getThemeConfig(),
  } as any,
  currentUser: undefined,
  newUser: undefined,
  isAuthenticated: Boolean(getOidcToken()),
  authConfig: undefined,
  authorizerConfig: undefined,
  isSigningUp: false,
  jwtPrincipalClaims: [],
  jwtPrincipalClaimsMapping: [],
  userProfilePics: {},
  cachedEntityData: {},
  selectedPersona: {} as any,
  searchCriteria: '',
  inlineAlertDetails: undefined,
  applications: [],
  appPreferences: {},

  setInlineAlertDetails: (inlineAlertDetails: any) => {
    set({ inlineAlertDetails });
  },

  setHelperFunctionsRef: (helperFunctions: any) => {
    set({ ...helperFunctions });
  },

  setApplicationConfig: (config: any) => {
    set({ applicationConfig: config, theme: config.customTheme });
  },


  setApplicationLoading: (loading: boolean) => {
    set({ isApplicationLoading: loading });
  },

  updateCachedEntityData: ({ id, entityDetails }: any) => {
    set({
      cachedEntityData: {
        ...(get() as any)?.cachedEntityData,
        [id]: entityDetails,
      },
    });
  },


  updateSearchCriteria: (criteria: any) => {
    set({ searchCriteria: criteria });
  },

}));
