import { getCardActorId } from "@/apps/modules/custom-actor-v1/machine/helpers.ts";
import {
  assign,
  createMachine,
  setup,
  fromPromise,
  sendParent,
  ActorRefFrom,
  stopChild,
} from "xstate";

import { Ok } from "ts-results";
import invariant from "tiny-invariant";

export const initialPanels: any[] = [
  {
    id: "panel-1",
    title: "title 1",
    collapsible: true,
    isCollapsed: false,
    content: "content 1",
    menu: [
      {
        label: "Menu Log",
        send: { name: "log", params: { key1: "value1 from menu" } },
      },
      {
        label: "Menu Log Context",
        send: { name: "logContext", params: { info: "logContext from menu" } },
      },
    ],
    actions: [
      { label: "Log", send: { name: "log", params: { key1: "value1" } } },
      { label: "Log Context", send: { name: "logContext" } },
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
        label: "Menu Log",
        send: { name: "log", params: { key2: "value2  from menu" } },
      },
      {
        label: "Menu Log Context",
        send: { name: "logContext", params: { info: "logContext from menu2" } },
      },
    ],
    actions: [
      {
        label: "Log",
        send: { name: "log", params: { key2: "value2 from action" } },
      },
      { label: "Log Context", send: { name: "logContext" } },
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
  },
}).createMachine({
  id: "grafanaPlayPanelMachine",
  context: ({ input }: any) => input,
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "playing.start": {
          target: "Playing",
        },
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
          actions: sendParent(({ context }) => ({
            type: "panel.play.done",
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
  id: "grafanaPlayMachine",
  initial: "Initializing",
  context: {
    panels: [],
  },
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
                  input: panels,
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
        Cards: {
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
    },
  },
});
