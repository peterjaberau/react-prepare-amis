import {
  assign,
  createMachine,
  setup,
  fromPromise,
  stopChild, sendParent, ActorRefFrom
} from "xstate";

import { Ok } from "ts-results";
import invariant from "tiny-invariant";
import { getCardActorId } from "@/apps/modules/custom-actor-v1/machine/helpers.ts";

type PanelProps = {
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

export const initialPanels: PanelProps[] | any[] = [
  {
    id: "panel-1",
    title: "title 1",
    collapsible: true,
    isCollapsed: false,
    content: "content 1",
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
        id: "action1",
        label: "Log",
        onClick: { type: "client", name: "log", data: { key1: "value1" } },
      },
      {
        id: "action2",
        label: "Log Context",
        onClick: { type: "client", name: "logContext" },
      },
    ],
  },
  {
    id: "panel-2",
    title: "title 2",
    collapsible: true,
    isCollapsed: false,
    content: "content 2",
    menu: [
      {
        id: "menuItem-11",
        label: "Menu Log",
        onClick: { type: "client", name: "log", data: "value2  from menu" },
      },
      {
        id: "menuItem-22",
        label: "Menu Log Context",
        onClick: {
          type: "client",
          name: "logContext",
          data: "logContext from menu2",
        },
      },
    ],
    actions: [
      {
        id: "action11",
        label: "Log",
        onClick: { type: "client", name: "log", data: "value2 from action" },
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

export function getPlayPanelActorId(id: string) {
  return `panel-${id}`;
}

export const grafanaPlayPanelMachine = setup({
  types: {
    input: {} as any,
    context: {} as any,
    events: {} as any,
  },
  actions: {
    toggleCollapse: assign(({ context }) => {
      return {
        ...context,
        isCollapsed: !context.isCollapsed,
      };
    }),

    playRequestAction: assign(({ context, event }) => {
      console.log("action.playRequestAction----", {
        context: context,
        event: event,
      });
    }),
    playCancelAction: assign(({ context, event }) => {
      console.log("action.playCancelAction----", {
        context: context,
        event: event,
      });
    }),
  },
  actors: {
    playAsyncExecution: fromPromise(async () => {
      await new Promise((res) => setTimeout(res, 1_00));
    }),
    revokePanel: fromPromise(async () => {
      await new Promise((res) => setTimeout(res, 1_00));
    }),
  },
}).createMachine({
  id: "Panel",
  context: ({ input }: any) => input,
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "playing.start": {
          target: "Playing",
        },
        revoke: {
          target: "Revoking",
        },


        "TOGGLE_COLLAPSE": {
          actions: "toggleCollapse",
        }
      },
    },
    Playing: {
      on: {
        "playing.cancel": {
          target: "Idle",
          actions: "playCancelAction",
        },
        "playing.request": {
          target: "Idle",
          actions: "playRequestAction",
        },
        "playing.asyncRequest": {
          target: "Awaiting",
          actions: "playRequestAction",
        },
      },
    },
    Awaiting: {
      invoke: {
        src: "playAsyncExecution",
        input: ({ context }: any) => ({ panelId: context.id }),
        onDone: {
          target: "Done",
          actions: sendParent(({ context }: any) => ({
            type: "panel.playing.done",
            panelId: context.id,
          })),
        },
      },
    },
    Revoking: {
      invoke: {
        src: "revokePanel",
        input: ({ context }) => ({ panelId: context.id }),
        onDone: {
          target: "Done",
          actions: sendParent(({ context }) => ({
            type: "panel.revoke.confirmed",
            panelId: context.id,
          })),
        },
      },
    },
    Done: {
      type: "final",
    },
  },
});

export const grafanaPlayMachine = setup({
  types: {
    input: {
      panels: Array<ActorRefFrom<typeof grafanaPlayPanelMachine>>,
    } as any,
    context: {} as any,
    events: {} as any,
  },
  actors: {
    grafanaPlayPanelMachine,
    getInitialPanels: fromPromise(async () => {
      await new Promise((res) => setTimeout(res, 1_00));
      return new Ok({
        panels: initialPanels,
      });
    }),
    addNewPanel: fromPromise(async () => {
      await new Promise((res) => setTimeout(res, 1_00));
    }),
  },
}).createMachine({
  id: "Panels",
  context: {
    panels: [],
  },
  initial: "Initializing",
  states: {
    Initializing: {
      invoke: {
        src: "getInitialPanels",
        onDone: {
          guard: ({ event }: any) => event.output.ok === true,
          target: "Ready",
          actions: assign(({ event, spawn }) => {
            invariant(event.output.ok === true);
            return {
              panels: event.output.val.panels.map((panel: any) =>
                spawn("grafanaPlayPanelMachine", {
                  id: getPlayPanelActorId(panel.id),
                  input: panel,
                  systemId: getPlayPanelActorId(panel.id),
                }),
              ),
            };
          }),
        },
      },
    },
    Ready: {
      type: "parallel",
      states: {
        Panels: {
          initial: "Idle",
          states: {
            Idle: {
              on: {
                "panel.new.start": {
                  target: "Starting",
                },
              },
            },
            Starting: {
              initial: "Playing",
              states: {
                Playing: {
                  on: {
                    "panel.new.cancel": {
                      target: "Done",
                    },
                    "panel.new.request": {
                      target: "Done",
                      actions: assign({
                        panels: ({ context, event, spawn }) => {
                          const newPanelId = String(Math.random());

                          return context.panels.concat(
                            spawn("grafanaPlayPanelMachine", {
                              id: getPlayPanelActorId(newPanelId),
                              input: {
                                id: newPanelId,
                                title: event.title,
                                content: event.content,
                                menu: [],
                                actions: [],
                              },
                              systemId: getPlayPanelActorId(newPanelId),
                            }),
                          );
                        },
                      }),
                    },
                    "panel.new.asyncRequest": {
                      target: "Awaiting",
                      actions: assign({
                        panels: ({ context, event, spawn }) => {
                          const newPanelId = String(Math.random());

                          return context.panels.concat(
                            spawn("grafanaPlayPanelMachine", {
                              id: getPlayPanelActorId(newPanelId),
                              input: {
                                id: newPanelId,
                                title: event.title,
                                content: event.content,
                                menu: [],
                                actions: [],
                              },
                              systemId: getPlayPanelActorId(newPanelId),
                            }),
                          );
                        },
                      }),
                    },
                  },
                },
                Awaiting: {
                  invoke: {
                    src: "addNewPanel",
                    input: ({ context }) => {
                      const lastCreatedPanel = context.panels
                        .at(-1)
                        ?.getSnapshot().context;
                      invariant(lastCreatedPanel !== undefined);

                      return lastCreatedPanel;
                    },
                    onDone: {
                      target: "Done",
                    },
                  },
                },
                Done: {
                  type: "final",
                },
              },
              onDone: {
                target: "Idle",
              },
            },
          },
        },
      },
      on: {
        "panel.revoke.confirmed": {
          actions: [
            stopChild(({ event }) => getPlayPanelActorId(event.panelId)),
            assign({
              panels: ({ context, event }) =>
                context.cards.filter(
                  (panel: any) => panel.id !== getPlayPanelActorId(event.panelId),
                ),
            }),
          ],
        },
      },
    },
  },
});
