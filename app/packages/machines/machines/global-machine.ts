import { setup, assign, fromPromise, fromCallback } from "xstate";
import { Ok } from "ts-results";
import { createBrowserInspector } from "@statelyai/inspect";

export const globalMachine = setup({
  types: {
    context: {
      inspector: {} as any,
      debugger: {} as any,
      internal: {} as any,
      nodes: {} as any,
    } as any,
    events: {} as {
      type: "inspector.open" | "inspector.closed" | any
      payload: { [s: string]: any }
    },
  },
  actions: {
    handleOpenBrowserInspector: assign({
      inspector: () => createBrowserInspector(),
    }),
  },
  actors: {
    callbackOnBrowserInspectorClosed: fromCallback<any, { inspector: any }>(
      ({input, sendBack}: any) => {
        const timerId = setInterval(() => {
            if (input.inspector.adapter.targetWindow!.closed) {
              sendBack({type: "inspector.closed"})
            }
          },
          1_00)

        return () => {
          clearInterval(timerId)
        }
      },
    ),
  },
  guards: {},
}).createMachine({
  id: "global-machine",
  initial: "closed",
  context: {
    debugger: {},
    inspector: undefined,
    internal: {},
    nodes: {},
  },
  states: {
    // in
    closed: {
      on: {
        "inspector.open": {
          target: "open",
          actions: ["handleOpenBrowserInspector"],
        },
      },
    },
    open: {
      invoke: {
        src: "callbackOnBrowserInspectorClosed",
        input: ({context}) => {
          if (context.inspector === undefined) {
            throw new Error("Inspector must be defined in context")
          }

          return {
            inspector: context.inspector!,
          }
        },
      },
      on: {
        "inspector.closed": {
          target: "closed",
        },
      },
    },
  },
});
