import { ActorRefFrom, assign, fromPromise, sendParent, setup, stopChild } from "xstate";
import {
  AppEvents, AuthorDto, AuthorEvents,
  CollectionDto,
  CollectionEvents,
  QuoteDto,
  QuoteEvents
} from "@/apps/modules/state-actors/helpers/types.ts";
import { Ok } from "ts-results";
import { authorsData, collectionsData, quotesData } from "@/apps/modules/state-actors/helpers/data.ts";
import {
  getAuthorActorId,
  getCollectionActorId,
  getQuoteActorId
} from "@/apps/modules/state-actors/helpers/functions.ts";

// @ts-ignore
import invariant from "tiny-invariant";

export const authorMachine = setup({
  types: {
    input: {} as AuthorDto,
    context: {} as AuthorDto,
    events: {} as AuthorEvents,
  },
}).createMachine({
  id: "Author",
  context: ({ input }) => input,
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "editing.start": {
          target: "Editing",
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
            fullname: ({ event }) => event.fullname,
            birth_date: ({ event }) => event.birthday,
          }),
        },
      },
    },
  },
});

export const quoteMachine = setup({
  types: {
    input: {} as QuoteDto,
    context: {} as QuoteDto,
    events: {} as QuoteEvents,
  },
  actors: {
    deleteQuoteFromServer: fromPromise(
      async () => {
        await new Promise((res) => setTimeout(res, 1_000));
      }
    ),
  },
}).createMachine({
  id: "Quote",
  context: ({ input }) => input,
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
            author_id: ({ event }) => event.authorId,
            text: ({ event }) => event.text,
            collections_id: ({ event }) => event.collectionId ?? null,
          }),
        },
      },
    },
    Deleting: {
      invoke: {
        src: "deleteQuoteFromServer",
        input: ({ context }) => ({ quoteId: context.id }),
        onDone: {
          target: "Done",
          actions: sendParent(({ context }) => ({
            type: "quote.delete.confirmed",
            quoteId: context.id,
          })),
        },
      },
    },
    Done: {
      type: "final",
    },
  },
});

export const collectionMachine = setup({
  types: {
    context: {} as CollectionDto,
    input: {} as CollectionDto,
    events: {} as CollectionEvents
  },
}).createMachine({
  context: ({ input }) => input,
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "editing.start": {
          target: "Editing",
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
            name: ({ event }) => event.name,
          }),
        },
      },
    },
  },
});

export const appMachine = setup({
  types: {
    context: {} as {
      quotes: Array<ActorRefFrom<typeof quoteMachine>>;
      authors: Array<ActorRefFrom<typeof authorMachine>>;
      collections: Array<ActorRefFrom<typeof collectionMachine>>;
    },
    events: {} as AppEvents

  },
  actors: {
    authorMachine,
    quoteMachine,
    collectionMachine,
    getInitialData: fromPromise(async () => {
      await new Promise((res) => setTimeout(res, 2_000));

      return new Ok({
        authors: authorsData,
        quotes: quotesData,
        collections: collectionsData,
      });
    }),
    saveNewQuote: fromPromise(async () => {
      await new Promise((res) => setTimeout(res, 1_000));
    }),
    saveNewAuthor: fromPromise(async () => {
      await new Promise((res) => setTimeout(res, 1_000));
    }),
  },
}).createMachine({
  id: "App",
  context: {
    authors: [],
    quotes: [],
    collections: [],
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
              authors: event.output.val.authors.map((author) =>
                spawn("authorMachine", {
                  id: getAuthorActorId(author.id),
                  input: author,
                  systemId: getAuthorActorId(author.id),
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
    Ready: {
      type: "parallel",
      states: {
        Authors: {
          initial: "Idle",
          states: {
            Idle: {
              on: {
                "author.new.open": {
                  target: "Creating",
                },
              },
            },
            Creating: {
              initial: "Editing",
              states: {
                Editing: {
                  on: {
                    "author.new.cancel": {
                      target: "Done",
                    },
                    "author.new.submit": {
                      target: "Submitting",
                      actions: assign({
                        authors: ({ context, event, spawn }) => {
                          const newAuthorId = String(Math.random());

                          return context.authors.concat(
                            spawn("authorMachine", {
                              id: getAuthorActorId(newAuthorId),
                              input: {
                                id: newAuthorId,
                                fullname: event.fullname,
                                birth_date: event.birthday ?? null,
                              },
                              systemId: getAuthorActorId(newAuthorId),
                            })
                          );
                        },
                      }),
                    },
                  },
                },
                Submitting: {
                  invoke: {
                    src: "saveNewAuthor",
                    input: ({ context }) => {
                      const lastCreatedAuthor = context.authors.at(-1)
                        ?.getSnapshot().context;
                      invariant(lastCreatedAuthor !== undefined);

                      return lastCreatedAuthor;
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
        Quotes: {
          initial: "Idle",
          states: {
            Idle: {
              on: {
                "quote.new.open": {
                  target: "Creating",
                },
              },
            },
            Creating: {
              initial: "Editing",
              states: {
                Editing: {
                  on: {
                    "quote.new.cancel": {
                      target: "Done",
                    },
                    "quote.new.submit": {
                      target: "Submitting",
                      actions: assign({
                        quotes: ({ context, event, spawn }) => {
                          const newQuoteId = String(Math.random());

                          return context.quotes.concat(
                            spawn("quoteMachine", {
                              id: getQuoteActorId(newQuoteId),
                              input: {
                                id: newQuoteId,
                                author_id: event.authorId,
                                collections_id: null,
                                created_at: new Date().toISOString(),
                                text: event.text,
                              },
                              systemId: getQuoteActorId(newQuoteId),
                            })
                          );
                        },
                      }),
                    },
                  },
                },
                Submitting: {
                  invoke: {
                    src: "saveNewQuote",
                    input: ({ context }) => {
                      const lastCreatedQuote = context.quotes
                        .at(-1)
                        ?.getSnapshot().context;
                      invariant(lastCreatedQuote !== undefined);

                      return lastCreatedQuote;
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
        "quote.delete.confirmed": {
          actions: [
            stopChild(({ event }) => getQuoteActorId(event.quoteId)),
            assign({
              quotes: ({ context, event }) =>
                context.quotes.filter(
                  (quote) => quote.id !== getQuoteActorId(event.quoteId)
                ),
            }),
          ],
        },
      },
    },
  },
});
