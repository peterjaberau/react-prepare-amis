import {
  createMachine,
  assign,
  setup,
  fromPromise,
  sendParent,
  ActorRefFrom,
  stopChild,
} from "xstate";
import { initialData } from "./config";
import { getCardActorId } from "./helpers";

import { Ok } from "ts-results";
import invariant from "tiny-invariant";

export const cardMachine = setup({
  types: {
    input: {} as any,
    context: {} as any,
    events: {} as any,
  },
  actors: {
    deleteCardFromServer: fromPromise(async () => {
      await new Promise((res) => setTimeout(res, 1_00));
    }),
  },
}).createMachine({
  id: "Card",
  context: ({ input }: any) => input,
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "editing.start": {
          target: "Editing",
        },
        delete: {
          target: "Deleting",
        },
      },
    },
    Editing: {
      on: {
        "editing.cancel": {
          target: "Idle",
        },
        "editing.submit": {
          target: "Idle",
          actions: assign({
            title: ({ event }) => event.title,
            content: ({ event }) => event.content,
          }),
        },
      },
    },
    Deleting: {
      invoke: {
        src: "deleteCardFromServer",
        input: ({ context }) => ({ cardId: context.id }),
        onDone: {
          target: "Done",
          actions: sendParent(({ context }) => ({
            type: "card.delete.confirmed",
            cardId: context.id,
          })),
        },
      },
    },
    Done: {
      type: "final",
    },
  },
});

export const parentCardMachine = setup({
  types: {
    context: {} as {
      cards: Array<ActorRefFrom<typeof cardMachine>>;
    },
    events: {} as any,
  },
  actors: {
    cardMachine,
    getInitialData: fromPromise(async () => {
      await new Promise((res) => setTimeout(res, 1_00));

      return new Ok({
        cards: initialData,
      });
    }),
    addNewCard: fromPromise(async () => {
      await new Promise((res) => setTimeout(res, 1_00));
    }),
  },
})
  .createMachine({
  id: "ParentCard",
  context: {
    cards: [],
  },
  initial: "Loading initial data",
  states: {
    "Loading initial data": {
      invoke: {
        src: "getInitialData",
        onDone: {
          guard: ({ event }) => event.output.ok === true,
          target: "Ready",
          actions: assign(({ event, spawn }) => {
            invariant(event.output.ok === true);

            return {
              cards: event.output.val.cards.map((card: any) =>
                spawn("cardMachine", {
                  id: getCardActorId(card.id),
                  input: card,
                  systemId: getCardActorId(card.id),
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
                "card.new.open": {
                  target: "Creating",
                },
              },
            },
            Creating: {
              initial: "Editing",
              states: {
                Editing: {
                  on: {
                    "card.new.cancel": {
                      target: "Done",
                    },
                    "card.new.submit": {
                      target: "Submitting",
                      actions: assign({
                        cards: ({ context, event, spawn }) => {
                          const newCardId = String(Math.random());

                          return context.cards.concat(
                            spawn("cardMachine", {
                              id: getCardActorId(newCardId),
                              input: {
                                id: newCardId,
                                title: event.fullname,
                                content: event.birthday ?? null,
                              },
                              systemId: getCardActorId(newCardId),
                            }),
                          );
                        },
                      }),
                    },
                  },
                },
                Submitting: {
                  invoke: {
                    src: "addNewCard",
                    input: ({ context }) => {
                      const lastCreatedCard = context.cards
                        .at(-1)
                        ?.getSnapshot().context;
                      invariant(lastCreatedCard !== undefined);

                      return lastCreatedCard;
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
        "card.delete.confirmed": {
          actions: [
            stopChild(({ event }) => getCardActorId(event.cardId)),
            assign({
              cards: ({ context, event }) =>
                context.cards.filter(
                  (card) => card.id !== getCardActorId(event.cardId),
                ),
            }),
          ],
        },
      },
    },
  },
});


/*


import {
  createMachine,
  assign,
  setup,
  fromPromise,
  sendParent,
  ActorRefFrom,
  stopChild,
} from "xstate";
import { initialData } from "./config";
import { getCardActorId } from "./helpers";
import { Ok } from "ts-results";
import invariant from "tiny-invariant";

export const cardMachine = setup({
  types: {
    input: {} as any,
    context: {} as any,
    events: {} as any,
  },
  actors: {
    deleteCardFromServer: fromPromise(async () => {
      await new Promise((res) => setTimeout(res, 1_000));
    }),
  },
}).createMachine({
  id: "Card",
  context: ({ input }: any) => input,
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "editing.start": {
          target: "Editing",
        },
        delete: {
          target: "Deleting",
        },
      },
    },
    Editing: {
      on: {
        "editing.cancel": {
          target: "Idle",
        },
        "editing.submit": {
          target: "Idle",
          actions: assign({
            title: ({ event }) => event.title,
            content: ({ event }) => event.content,
          }),
        },
      },
    },
    Deleting: {
      invoke: {
        src: "deleteCardFromServer",
        input: ({ context }) => ({ cardId: context.id }),
        onDone: {
          target: "Done",
          actions: sendParent(({ context }) => ({
            type: "card.delete.confirmed",
            cardId: context.id,
          })),
        },
      },
    },
    Done: {
      type: "final",
    },
  },
});

export const parentCardMachine = setup({
  types: {
    context: {} as {
      cards: Array<ActorRefFrom<typeof cardMachine>>;
    },
    events: {} as any,
  },
  actors: {
    cardMachine,
    getInitialData: fromPromise(async () => {
      await new Promise((res) => setTimeout(res, 2_000));

      return new Ok({
        cards: initialData,
      });
    }),
    addNewCard: fromPromise(async () => {
      await new Promise((res) => setTimeout(res, 1_000));
    }),
  },
}).createMachine({
  id: "ParentCard",
  context: {
    cards: [],
  },
  initial: "Loading initial data",
  states: {
    "Loading initial data": {
      invoke: {
        src: "getInitialData",
        onDone: {
          guard: ({ event }) => event.output.ok === true,
          target: "Ready",
          actions: assign(({ event, spawn }) => {
            invariant(event.output.ok === true);

            return {
              cards: event.output.val.cards.map((card: any) =>
                spawn("cardMachine", {
                  id: getCardActorId(card.id),
                  input: card,
                  systemId: getCardActorId(card.id),
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
                "card.new.open": {
                  target: "Creating",
                },
              },
            },
            Creating: {
              initial: "Editing",
              states: {
                Editing: {
                  on: {
                    "card.new.cancel": {
                      target: "Done",
                    },
                    "card.new.submit": {
                      target: "Submitting",
                      actions: assign({
                        cards: ({ context, event, spawn }) => {
                          const newCardId = String(Math.random());

                          return context.cards.concat(
                            spawn("cardMachine", {
                              id: getCardActorId(newCardId),
                              input: {
                                id: newCardId,
                                title: event.fullname,
                                content: event.birthday ?? null,
                              },
                              systemId: getCardActorId(newCardId),
                            }),
                          );
                        },
                      }),
                    },
                  },
                },
                Submitting: {
                  invoke: {
                    src: "addNewCard",
                    input: ({ context }) => {
                      const lastCreatedCard = context.cards
                        .at(-1)
                        ?.getSnapshot().context;
                      invariant(lastCreatedCard !== undefined);

                      return lastCreatedCard;
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
        "card.delete.confirmed": {
          actions: [
            stopChild(({ event }) => getCardActorId(event.cardId)),
            assign({
              cards: ({ context, event }) =>
                context.cards.filter(
                  (card) => card.id !== getCardActorId(event.cardId),
                ),
            }),
          ],
        },
        "card.new": {
          actions: assign({
            cards: ({ context, spawn }) => {
              const newCardId = String(Math.random());
              return context.cards.concat(
                spawn("cardMachine", {
                  id: getCardActorId(newCardId),
                  input: {
                    id: newCardId,
                    title: "New Card",
                    content: null,
                  },
                  systemId: getCardActorId(newCardId),
                }),
              );
            },
          }),
        },
      },
    },
  },
});


 */
