

export const pluginVersion = "11.6.0-pre";

export type UpdateConfig = {
  render: boolean,
  dataChanged: boolean,
  schemaChanged: boolean,
};

export enum DebugMode {
  Cursor = 'cursor',
  Events = 'events',
  Render = 'render',
  State = 'State',
  ThrowError = 'ThrowError',
}

export interface Options {
  counters?: UpdateConfig;
  mode: DebugMode;
}
