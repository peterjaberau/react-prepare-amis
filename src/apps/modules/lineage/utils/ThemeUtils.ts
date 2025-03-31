
import { DEFAULT_THEME } from '../constants/Appearance.constants';

export const getThemeConfig = (theme?: any) => {
  return {
    primaryColor: theme?.primaryColor || DEFAULT_THEME.primaryColor,
    errorColor: theme?.errorColor || DEFAULT_THEME.errorColor,
    successColor: theme?.successColor || DEFAULT_THEME.successColor,
    warningColor: theme?.warningColor || DEFAULT_THEME.warningColor,
    infoColor: theme?.infoColor || DEFAULT_THEME.infoColor,
  };
};
