import {
  assign,
  createMachine,
  setup,
  fromPromise,
  stopChild, sendParent, ActorRefFrom
} from "xstate";

import { Ok } from "ts-results";
import invariant from "tiny-invariant";
import { initialPanels, actionMapping } from "./config";





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

      const response = actionMapping[event.name]()

      if (!response) {
        return;
      }

      console.log("action.playRequestAction----", {
        context: context,
        event: event,
        response: response,
      });


      const content = event?.content;

      console.log({
        action: event.name,
        request: event?.data,
        event: event,
        context: context,
        log: response.log,
        content: content,
      })

      if (content) {
        context.content = content;
      }

      // return {
      //   ...context,
      //   content: response.content,
      // }

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



        "playing.request": {
          actions: "playRequestAction",
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
