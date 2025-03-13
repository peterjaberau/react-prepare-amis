import { PluginExtensionLink } from '@data/index';

export type ExtensionDropdownProps = {
  links: PluginExtensionLink[];
  exploreId: string;
  setSelectedExtension: (extension: PluginExtensionLink) => void;
  setIsModalOpen: (value: boolean) => void;
  isModalOpen: boolean;
  noQueriesInPane: boolean;
};
