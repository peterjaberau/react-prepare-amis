import { getEnvConfigPlayground, mockApiWorker } from "./actions.ts";

export type PanelProps = {
  id: string;
  title: string;
  collapsible?: boolean;
  isCollapsed?: boolean;
  content: string;
  menu?: { label: string; onClick: any }[];
  actions?: { label: string; onClick: any }[];
};

export const eventTypeMapping: any = {
  cancel: "playing.cancel",
  client: "playing.request",
  server: "playing.asyncRequest",
};

export const actionMapping: any = {
  getEnvConfigPlayground: getEnvConfigPlayground,
  mockApiWorker: mockApiWorker,
}

export const initialPanels: PanelProps[] | any[] = [
  {
    id: "getEnvConfig",
    title: "getEnvConfig()",
    collapsible: true,
    isCollapsed: false,
    content: "getEnvConfig() & getEnvConfig().frontend_dev_mock_api",
    menu: [
      {
        id: "menuItem-1",
        label: "Menu Log",
        onClick: {
          type: "client",
          name: "log",
          data: { key1: "value1 from menu" },
        },
      },
      {
        id: "menuItem-2",
        label: "Menu Log Context",
        onClick: {
          type: "client",
          name: "logContext",
          data: { info: "logContext from menu" },
        },
      },
    ],
    actions: [
      {
        id: "getEnvConfigPlayground.client",
        label: "Play",
        onClick: { type: "client", name: "getEnvConfigPlayground" },
      },
    ],
  },
  {
    id: "mockApiWorker",
    title: "mockApiWorker",
    collapsible: true,
    isCollapsed: false,
    content: "content 2",
    actions: [
      {
        id: "mockApiWorker.client",
        label: "Play",
        onClick: { type: "client", name: "mockApiWorker" },

      },
      {
        id: "action22",
        label: "Log Context",
        onClick: { type: "client", name: "logContext" },
      },
    ],
  },
  {
    id: "panel-3",
    title: "Actor Model in XState 3",
    content:
      "The actor model is a mathematical model of concurrent computation that treats actors as the universal primitives of computation. In XState, actors are isolated units of state and behavior.",
  },
  {
    id: "panel-4",
    title: "Actor Model in XState 4",
    content:
      "The actor model is a mathematical model of concurrent computation that treats actors as the universal primitives of computation. In XState, actors are isolated units of state and behavior.",
  },
  {
    id: "panel-5",
    title: "Actor Model in XState 5",
    content:
      "The actor model is a mathematical model of concurrent computation that treats actors as the universal primitives of computation. In XState, actors are isolated units of state and behavior.",
  },
];
