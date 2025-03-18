import { setup, spawnChild, sendTo, assign, fromPromise, fromCallback, AnyActorRef } from "xstate";
import { Ok } from "ts-results"
import { initialContext, initialGrafanaUiContext } from "./rootMachineConfig.ts"

export const rootMachine = setup({
  types: {
    context: {} as any,
    events: {} as any,
  },
  actions: {
    setBooleanValue: assign(({ context, event }: any) => {
      /*
        type: 'toggle', 'toggle.false', 'toggle.true'
        targetId: 'flyoutBottom', 'flyoutRight', 'sidepanelLeft'...
        extraProps: 'isVisible', 'isExpanded', 'isCollapsed'...
        props: 'size', 'ownFocus', 'side', 'type', 'maxWidth', 'outsideClickCloses'...
        value: true, false. nothing of toggle type.

       */


      console.log('setToggleValue', event);
      const targetId = event.targetId;
      const propertyKey = event.props;
      const extraPropertyKey = event.extraProps;

      const currentState = () => {
        const state: any = {};
        if (propertyKey) {
          state.props = {
            [propertyKey]: context.layout[targetId].props[propertyKey],
          };
        }
        if (extraPropertyKey) {
          state.extraProps = {
            [extraPropertyKey]: context.layout[targetId].extraProps[extraPropertyKey],
          };
        }
        return state;
      }


      const valueSetter = (value: any) => {
        if (event.type === 'toggle') {
          if (value !== undefined) {
            return !value;
          }
        } else if (event.type === 'toggle.false') {
          return false;
        } else if (event.type === 'toggle.true') {
          return true;
        } else {
          return undefined;
        }
      }

      return {
        ...context,
        layout: {
          ...context.layout,
          [targetId]: {
            ...context.layout[targetId],
            props: {
              ...context.layout[targetId].props,
              [propertyKey]: valueSetter(currentState().props?.[propertyKey]),
            },
            extraProps: {
              ...context.layout[targetId].extraProps,
              [extraPropertyKey]: valueSetter(currentState().extraProps?.[extraPropertyKey]),
            },
          },
        },
      }
    }),

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
    ...initialGrafanaUiContext,
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


        "toggle": {
          actions: "setBooleanValue",
        },
        "toggle.false": {
          actions: "setBooleanValue",
        },
        "toggle.true": {
          actions: "setBooleanValue",
        }

      },
    },
  },
});
