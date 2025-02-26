import {ListenerAction} from 'amis-core';
import {RendererPluginAction} from '@/packages/amis-editor-core/src';

export interface ActionConfig extends ListenerAction {
  [propName: string]: any;
}

export interface ActionEventConfig {
  [propName: string]: {
    weight?: number; // weight
    actions: ActionConfig[]; // Action set to be executed
    __isBroadcast?: boolean; // Distinguish broadcast events
    debounce?: {
      wait: number;
    };
    track?: {
      id: string;
      name: string;
    };
  };
}

//Component tree structure
export interface ComponentInfo {
  label: string;
  value: string;
  type: string;
  disabled?: boolean;
  actions?: RendererPluginAction[]; // Action set
  children?: ComponentInfo[];
  id: string;
}

export interface ContextVariables {
  // Context formula variables
  label: string;
  value?: any;
  tag?: string | string[];
  children?: any[];
  path?: string;
}
