import { setup, assign, fromPromise } from "xstate";
import { Ok } from "ts-results";

export const rootMachine = setup({
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
  id: "root-machine",
  initial: "idle",
  context: {
    scope: {},
    config: {},
    registry: {},
    locale: {},
    backend: {},
    schema: {},
    data: {},
    auth: {},
    runtime: {},
    plugins: {},
    time: {}
  },
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
