import { FieldConfigSource } from '@data/index';

export interface VizTypeChangeDetails {
  pluginId: string;
  options?: Record<string, unknown>;
  fieldConfig?: FieldConfigSource;
  withModKey?: boolean;
}
