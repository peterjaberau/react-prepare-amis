import { createMachine, assign } from "xstate";
import { initialCards } from "./config";

export type CardData = {
  id: string;
  title: string;
  content: string;
  children?: CardData[] | any;
};

export type CardContext = {
  cards: CardData[] | any;
};

type CardMachineContext = {
  isExpanded: boolean;
  isEditing: boolean;
  data: CardData;
  editData: {
    title: string;
    content: string;
  } | null;
  childCards: CardData[] | any;
};

export const createCardMachine = (id: string) =>
  createMachine(
    {
      id,
      context: ({ input, parent }: any) =>
        ({
          isExpanded: false,
          isEditing: false,
          data: input.data,
          editData: null,
          childCards: input.data.children || [],
        }) as CardMachineContext | any,
      initial: "idle",
      states: {
        idle: {
          on: {
            TOGGLE_EXPAND: {
              actions: "toggleExpand",
            },
            EDIT: {
              target: "editing",
              actions: "initializeEditData",
            },
            ADD_CHILD: {
              actions: "addChildCard",
            },
          },
        },
        editing: {
          on: {
            UPDATE_FIELD: {
              actions: "updateField",
            },
            SAVE: {
              target: "idle",
              actions: ["saveData", "clearEditData"],
            },
            CANCEL: {
              target: "idle",
              actions: "clearEditData",
            },
          },
        },
      },
    },
    {
      actions: {
        toggleExpand: assign({
          isExpanded: ({ context }) => !context.isExpanded,
        }),
        initializeEditData: assign({
          editData: ({ context }) => ({
            title: context.data.title,
            content: context.data.content,
          }),
          isEditing: () => true,
        }),
        updateField: assign({
          editData: ({ context, event }) => ({
            ...context.editData!,
            [event.field]: event.value,
          }),
        }),
        saveData: assign({
          data: ({ context }) => ({
            ...context.data,
            title: context.editData?.title || context.data.title,
            content: context.editData?.content || context.data.content,
          }),
          isEditing: () => false,
        }),
        clearEditData: assign({
          editData: () => null,
          isEditing: () => false,
        }),
        addChildCard: assign({
          childCards: ({ context }) => [
            ...context.childCards,
            {
              id: `${context.data.id}-child-${Date.now()}`,
              title: "New Child Card",
              content: "Edit this child card",
            },
          ],
        }),
      },
    },
  );

export const parentCardMachine = createMachine(
  {
    id: "parentCard",
    context: {
      cards: initialCards,
    },
    initial: "active",
    states: {
      active: {
        on: {
          ADD_CARD: {
            actions: "addCard",
          },
          REMOVE_CARD: {
            actions: "removeCard",
          },
        },
      },
    },
  },
  {
    actions: {
      addCard: assign({
        cards: ({ context, event }) => [...context.cards, event.card],
      }),
      removeCard: assign({
        cards: ({ context, event }) =>
          context.cards.filter((card) => card.id !== event.id),
      }),
    },
  },
);
