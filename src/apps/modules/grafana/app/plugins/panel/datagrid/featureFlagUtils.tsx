import { config } from '@runtime/index';

export const isDatagridEnabled = () => {
  return config.featureToggles.enableDatagridEditing;
};
