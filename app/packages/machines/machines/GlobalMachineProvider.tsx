import { createContext, useContext } from "react";
import { setup, assign, fromPromise, fromCallback, ActorRefFrom, assertEvent } from "xstate";
import { rootMachine } from "./RootMachineProvider";
import {create} from "mutative";
import set from "set-value";

import { createBrowserInspector } from "@statelyai/inspect";
import { Ok } from "ts-results";
import { invariant } from "jest-util";

type GlobalContextType = {
  globalActor: ActorRefFrom<typeof globalMachine>;
};

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

export const globalMachine = setup({
  types: {
    context: {
      inspector: {} as any,
      debugger: {} as any,
      internal: {} as any,
      nodes: {} as any,
    } as any,
    events: {} as {
      type: "inspector.open" | "inspector.closed" | any;
      payload: { [s: string]: any };
    },
  },
  actions: {
    handleOpenBrowserInspector: assign({
      inspector: () => createBrowserInspector(),
    }),

    handleCreateRootActor: assign(({context, event, spawn}: any) => {

      // parse event
      assertEvent(event, "rootActor.create")
      const systemId = 'root-actor'
      const {rootActor} = context

      // prepare actorRef for rootActor with input
      const actorRef = spawn(rootMachine, {
        input: {
          test: {
            rootCreationTime: Date.now(),
          },
        },
        id: systemId,
      })

      // immutable gloabl context update.
      return create(context, (draft) => {
        draft.rootActor.set(actorRef.id, {
          actorRef: actorRef,
        })
      })
    }),

    handleUpdateRootActor: assign(({context, event, spawn}: any) => {
        assertEvent(event, "rootActor.update")
      return create(context, (draft) => {
        set(draft.rootActor, event.payload.key, event.payload.value)
      })


    }),
  },
  actors: {
    rootMachine,

    invokeGlobalInitiation: fromPromise(async () => {
      await new Promise((res) => setTimeout(res, 2_000));
      return new Ok({
        root: rootMachine,
      });
    }),


    callbackOnBrowserInspectorClosed: fromCallback<any, { inspector: any }>(
      ({ input, sendBack }: any) => {
        const timerId = setInterval(() => {
          if (input.inspector.adapter.targetWindow!.closed) {
            sendBack({ type: "inspector.closed" });
          }
        }, 1_00);

        return () => {
          clearInterval(timerId);
        };
      },
    ),
  },
  guards: {},
}).createMachine({
  id: "global-machine",
  initial: "initiating",
  context: {
    inspector: undefined,
    rootActor: {},
  },
  states: {
    initiating: {
      invoke: {
        id: "invokeGlobalInitiation",
        src: "invokeGlobalInitiation",
        onDone: {
          guard: ({ event }) => event.output.ok === true,
          target: "ready",
          actions: assign(({ event, spawn }) => {
            invariant(event.output.ok === true);

            return {
              root: event.output.val.rootActor.map((root: any) =>
                spawn("rootMachine", {
                  id: 'root-actor',
                  input: root,
                  systemId: 'root-actor',
                })
              ),
              quotes: event.output.val.quotes.map((quote) =>
                spawn("quoteMachine", {
                  id: getQuoteActorId(quote.id),
                  input: quote,
                  systemId: getQuoteActorId(quote.id),
                })
              ),
              collections: event.output.val.collections.map((collection) =>
                spawn("collectionMachine", {
                  id: getCollectionActorId(collection.id),
                  input: collection,
                  systemId: getCollectionActorId(collection.id),
                })
              ),
            };
          }),
        },
      },
    },

    ready: {
      on: {
        "inspector.open": {
          target: "open",
          actions: ["handleOpenBrowserInspector"],
        },
      },
    },
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
        input: ({ context }) => {
          if (context.inspector === undefined) {
            throw new Error("Inspector must be defined in context");
          }

          return {
            inspector: context.inspector!,
          };
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

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}
