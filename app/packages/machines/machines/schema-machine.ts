import { setup, assign, fromPromise } from "xstate";
import { Ok } from "ts-results";

export const schemaMachine = setup({
  types: {
    context: {} as any,
    events: {} as any,
  },
  actions: {
    handleEvent: assign(({ context, event }: any) => {
      console.log("handleEvent", event);
      return context;
    }),
  },
  actors: {
    handleLoader: fromPromise(async ({ input }: any) => {
      await new Promise((resolve: any) => setTimeout(resolve, 1_00));
      return new Ok([]);
    }),
  },
  guards: {},
}).createMachine({
  id: "schema-machine",
  initial: "idle",
  context: {},
  states: {
    // in
    idle: {
      on: {
        start: {
          target: "starting",
        },
      },
    },

    // process
    starting: {
      on: {
        load: {
          target: "loading",
        },
      },
    },
    loading: {
      invoke: {
        id: "handleLoader",
        src: "handleLoader",
        onDone: {
          target: "loaded",
        },
        onError: {
          target: "failed",
        },
      },
    },
    loaded: {
      on: {
        complete: {
          target: "watching",
        },
      },
    },
    failed: {
      on: {
        error: {
          target: "retry",
        },
      },
    },

    // out
    watching: {
      on: {
        event: {
          actions: "handleEvent",
        },
      },
    },
    retry: {
      on: {
        event: {
          actions: "handleEvent",
        },
      },
    },
  },
});
