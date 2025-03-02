import { setup, spawnChild, sendTo, assign, fromPromise, fromCallback } from 'xstate';
import { Ok } from "ts-results"
import { initialContext } from "./rootMachineConfig.ts"


export const rootMachine = setup({
  types: {
    context: {} as any,
    events: {} as any,
  },
  actions: {
    setValue: assign({
      value: (_, event: any) => event?.data
    }),
    setActiveKey: assign(({ context, event }: any) => {
      context.components.aiAnt.internal.activeKey = `${event.data.key}`;
    }),
    addConversation: assign(({ context, event }: any) => {
      const items = context.components.aiAnt.conversationList.items;
      context.components.aiAnt.conversationList.items = [
        ...items,
        {
          key: `${items.length}`,
          label: `New Conversation ${items.length}`,
        },
      ];
      context.components.aiAnt.internal.activeKey = `${items}`;
    }),
  },
  actors: {
    loadFromApi: fromPromise(async ({ input }: any) => {
      await new Promise((resolve: any) => setTimeout(resolve, 1_00));
      return new Ok([]);
    }),
  },
  guards: {

  },
}).createMachine({
  id: "root-machine",
  initial: 'loading',
  context: {
    ...initialContext,
    value: [],

  } as any,
  states: {
    loading: {
      invoke: {
        src: "loadFromApi",
        id: "loadFromApi",
        onDone: {
          target: "ready",
          actions: "setValue",
        },
      },
    },
    ready: {
      on: {
        INCOMING_EVENT: {
          actions: "setValue",
        },
        onAddConversation: {
          actions: "addConversation",
        },
        onConversationClick: {
          actions: "setActiveKey",
        },

      },
    },
  },
});
