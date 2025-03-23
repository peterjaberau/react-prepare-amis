import {
  ActorRefFrom,
  assertEvent,
  assign,
  enqueueActions,
  fromCallback,
  fromPromise,
  sendParent,
  setup,
  stopChild
} from "xstate";
import { createBrowserInspector } from "@statelyai/inspect";
import { create } from "mutative";
import set from "set-value";
import toast from "react-hot-toast/headless";

import {
  handleInvokeError,
  rootPartialInput,
  getRandomString
} from "./helpers";

export const inspectorLauncherMachine = setup({
  types: {
    context: {} as { updateId: number, inspector: any },
    events: {} as { type: "inspector.open" } | { type: "inspector.closed" },
  },
  actors: {
    "Wait for inspector window to be closed": fromCallback<any, { inspector: any }>(
      ({input, sendBack}) => {
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
  actions: {
    "Create inspector and assign to context": assign({
      inspector: () => createBrowserInspector(),
    }),
    "Increment update id in context": assign({
      updateId: ({context}) => context.updateId + 1,
    }),
  },
}).createMachine({
  context: {
    updateId: 0,
    inspector: undefined,
  },
  initial: "closed",
  states: {
    closed: {
      on: {
        "inspector.open": {
          target: "open",
          actions: ["Create inspector and assign to context", "Increment update id in context"],
        },
      },
    },
    open: {
      invoke: {
        src: "Wait for inspector window to be closed",
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
})


export const rootMachine = setup({
  types: {
    events: {} as {
      type: "rp.spawn" | "rp.open" | "rp.kill" | "rp.items.selected" | "rpSpawnForm.edit",
      [k: string]: any
    },
    context: {} as {
      spawnForm: {
        uiSettings: any
        resourceType: any
        resourceSelectionType: any
      }
      resourcePickers: Map<
        string,
        {
          actorRef: ActorRefFrom<typeof resourcePickerMachineEditor>
          latestSelectedItems: Map<string, any>
        }
      >
    },
  } as any,
  actions: {
    openResourcePicker: enqueueActions(({context, enqueue, event}: any) => {
      assertEvent(event, "rp.open")
      const rp = context.resourcePickers.get(event.payload.id)
      if (!rp) return

      enqueue.sendTo(rp.actorRef, {
        type: "open",
        payload:  {
          selectedItems: rp.latestSelectedItems,
        } as any,
      } as any)
    }),
    rpInsertLastSelectedItemsIds: assign(({event, context}) => {
      assertEvent(event, "rp.items.selected")
      const id = event.payload.senderId
      return create(context, (draft) => {
        const resourcePicker = draft.resourcePickers.get(id)
        if (!resourcePicker) return
        resourcePicker.latestSelectedItems = event.payload.selectedItems
      })
    }),
    logContext: ({context}) => {
      console.log({context})
    },
    killResourcePicker: assign(({event, context}) => {
      assertEvent(event, "rp.kill")
      const actorId = event.payload.id
      stopChild(actorId)
      return create(context, (draft) => {
        draft.resourcePickers.delete(actorId)
      })
    }),
    spawnResourcePicker: assign(({context, event, spawn}: any) => {
      assertEvent(event, "rp.spawn")
      const systemId = getRandomString()
      const {spawnForm} = context
      const actorRef = spawn(resourcePickerMachineEditor, {
        input: {
          resourceSettings: {
            ...(rootPartialInput as any)[spawnForm.resourceType]?.resourceSettings,
            selectionType: spawnForm.resourceSelectionType,
          } as any,
          uiSettings: spawnForm.uiSettings,
        } satisfies any,

        id: systemId,
      })

      return create(context, (draft) => {
        draft.resourcePickers.set(actorRef.id, {
          actorRef: actorRef,
          latestSelectedItems: new Map(),
        })
      })
    }),
    editRpSpawnerForm: assign(({context, event}) => {
      assertEvent(event, "rpSpawnForm.edit")

      console.log(event)
      return create(context, (draft) => {
        set(draft.spawnForm, event.payload.key, event.payload.value)
      })
    }),
  },
}).createMachine({
  id: "root",
  initial: "idle",
  context: {
    resourcePickers: new Map(),
    spawnForm: {
      uiSettings: {
        modalSize: "large",
        resourceUiMode: "resource-item",
      },
      resourceSelectionType: "multiple",
      resourceType: "product",
    },
  },
  states: {
    idle: {
      on: {
        "rpSpawnForm.edit": {
          actions: ["editRpSpawnerForm", "logContext"],
        },
        "rp.items.selected": {
          actions: [
            ({event}) => {
              toast.success(
                `Root actor received the selected items ids from ${event.payload.senderId}`,
              )
            },
            "rpInsertLastSelectedItemsIds",
          ],
        },
        "rp.open": {
          actions: [
            "openResourcePicker",
            ({event}) => {
              toast.success(`Resource picker ${event.payload.id} opened from root actor`)
            },
          ],
        },
        "rp.kill": {
          actions: [
            "killResourcePicker",
            ({event}) => {
              toast.error(`Resource Picker ${event.payload.id} killed from root actor`)
            },
          ],
        },

        "rp.spawn": {
          actions: [
            "spawnResourcePicker",
            () => toast.success("Resource picker spawned from root actor"),
          ],
        },
      },
    },
  },
})


export const resourcePickerMachineEditor = setup({
  types: {
    input: {} as any,
    context: {} as {
      filters: any,
      selectedItems: Map<string, any>
      currentQuery: any
      currentResources: any[]
      currentPageInfo: any,
      [k: string]: any
    },
    events: {} as {
      type: "library.query.editQuery" | "rp.query.filters.edit" | "library.query.filters.clearAll" | "open" | "close" | "library.item.select" | "library.item.unselect" | "library.items.loadMore" | "library.done"
      payload: any
    },
  },

  actors: {
    getLibraryItem: fromPromise(
      async ({input}: any) => {
        return input.handler(input.query)
      },
    ),

    getFilters: fromPromise(
      async ({input}: any) => {
        return input.handler(input.resourceType)
      },
    ),
  },
  actions: {
    injectSelectedItems: assign(({event, context}: any) =>
      create(context, (draft) => {
        assertEvent(event, "open")
        draft.selectedItems = event.payload?.selectedItems ?? new Map()
      }),
    ),
    clearQueryEndCursor: assign(({context}: any) =>
      create(context, (draft) => {
        draft.currentQuery.endCursor = null
      }),
    ),
    editSearch: assign(({context, event}: any) => {
      assertEvent(event, "library.query.editQuery")
      return create(context, (draft) => {
        draft.currentQuery.query = event.payload.query
      })
    }),
    clearSelected: assign(({context}: any) =>
      create(context, (draft) => {
        draft.selectedItems.clear()
      }),
    ),
    clearFilters: assign(({event, context}: any) => {
      assertEvent(event, "library.query.filters.clearAll")
      return create(context, (draft) => {
        if (draft.currentQuery.queryType === "library") {
          for (const filterToken in draft.currentQuery.filters) {
            draft.currentQuery.filters[filterToken] = []
          }
        }
      })
    }),
    editFilter: assign(({event, context}: any) => {
      assertEvent(event, "rp.query.filters.edit")
      return create(context, (draft) => {
        if (draft.currentQuery.queryType === "library")
          draft.currentQuery.filters[event.payload.filterId] = event.payload.value
      })
    }),
    sendSelectedItemsToParent: sendParent(({context, self}: any) => {
      return {
        type: "rp.items.selected",
        payload: {
          selectedItems: context.selectedItems,
          senderId: self.id,
          resourceSettings: context.resourceSettings,
        },
      }
    }),
  },
}).createMachine({
  id: "resourcePicker",
  initial: "Closed",
  context: ({input}: any) => ({
    ...input,
    filters: undefined,
    selectedItems: new Map(),
    // TODO: Pagination with drizzle @see: https://orm.drizzle.team/learn/guides/limit-offset-pagination
    currentQuery:
      input.resourceSettings.resourceNamespace === "library"
        ? {
          queryType: "library",
          query: "",
          filters: {
            tags: [],
          },
          first: 10,
          endCursor: null,
        }
        : {
          queryType: "shopify",
          query: "",
          endCursor: null,
          first: 10,
        },
    currentResources: [],
    currentPageInfo: {
      endCursor: null,
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor: "0",
    },
  }),
  states: {
    Closed: {
      on: {
        open: {
          actions: ["injectSelectedItems"],
          target: "Open",
        },
      },
    },
    Open: {
      on: {
        close: {
          target: "Closed",
        },
      },

      initial: "Check",
      states: {
        Check: {
          always: [
            {
              target: "LoadFilters",
              guard: ({context}) => {
                return !context.filters && context.resourceSettings.resourceNamespace === "library"
              },
            },
            {
              target: "Edit",
              guard: ({context}) => {
                return context.currentResources.length > 0
              },
            },
            {
              target: "Loading",
            },
          ],
        },
        LoadFilters: {
          invoke: {
            src: "getFilters",
            input: ({context}) => {
              if (context.resourceSettings.resourceNamespace !== "library") {
                throw new Error("filters not implemented for shopify resources")
              }
              return {
                handler: context.resourceSettings.filtersHandler,
                resourceType: context.resourceSettings.resourceType,
              }
            },
            onError: {
              actions: handleInvokeError,
              target: "Edit",
            },
            onDone: {
              actions: assign(({event, context}) =>
                create(context, (draft) => {
                  draft.filters = event.output.filters
                }),
              ),
              target: "Check",
            },
          },
        },
        Loading: {
          invoke: {
            input: ({context}) => ({
              handler: context.resourceSettings.queryHandler,
              query: context.currentQuery,
            }),
            src: "getLibraryItem",
            onDone: {
              actions: assign(({event, context}) =>
                create(context, (draft) => {
                  draft.currentResources = event.output.libraryItems
                  draft.currentPageInfo = event.output.pageInfo
                  draft.currentQuery.endCursor = event.output.pageInfo.endCursor ?? null
                }),
              ),
              target: "Edit",
            },
            onError: {
              actions: handleInvokeError,
              target: "Edit",
            },
          },
        },
        Edit: {
          initial: "Selecting",
          on: {
            "library.items.loadMore": {
              target: "LoadMore",
            },
            "library.query.editQuery": {
              actions: ["editSearch", "clearQueryEndCursor"],
              target: "#resourcePicker.Open.Edit.Searching",
            },
          },
          states: {
            Selecting: {
              on: {
                "rp.query.filters.edit": {
                  actions: ["editFilter", "clearQueryEndCursor"],
                  target: "#resourcePicker.Open.Loading",
                },
                "library.query.filters.clearAll": {
                  actions: ["clearFilters", "clearQueryEndCursor"],
                  target: "#resourcePicker.Open.Loading",
                },
                "library.item.select": {
                  actions: assign(({event, context}) => {
                    const itemId = event.payload.itemId
                    const item = context.currentResources.find((item) => item.id === itemId)

                    if (!item) {
                      throw new Error(`item ${itemId} not found in currentResources`)
                    }

                    return create(context, (draft) => {
                      if (context.resourceSettings.selectionType === "single") {
                        draft.selectedItems.clear()
                      }
                      draft.selectedItems.set(event.payload.itemId, item)
                    })
                  }),
                  target: "AnalyzeSelection",
                },
                "library.item.unselect": {
                  actions: assign(({event, context}) =>
                    create(context, (draft) => {
                      draft.selectedItems.delete(event.payload.itemId)
                    }),
                  ),
                },
                "library.done": {
                  target: "#resourcePicker.Done",
                },
              },
            },
            Searching: {
              on: {
                "library.query.editQuery": {
                  actions: ["clearQueryEndCursor", "editSearch"],
                  target: "Searching",
                  reenter: true,
                },
              },
              after: {
                5e2: {
                  target: "#resourcePicker.Open.Loading",
                },
              },
            },
            AnalyzeSelection: {
              always: [
                {
                  guard: ({context}) => {
                    return (
                      // context.selectedItemIds.length === 1 &&
                      context.resourceSettings.selectionType === "single"
                    )
                  },

                  target: "#resourcePicker.Done",
                },
                {
                  target: "Selecting",
                },
              ],
            },
          },
        },
        LoadMore: {
          initial: "Retrieve",
          states: {
            Retrieve: {
              invoke: {
                input: ({context}) => ({
                  handler: context.resourceSettings.queryHandler,
                  query: context.currentQuery,
                }),
                src: "getLibraryItem",
                onDone: {
                  actions: assign(({event, context}) =>
                    create(context, (draft) => {
                      draft.currentResources.push(...event.output.libraryItems)
                      draft.currentPageInfo = event.output.pageInfo
                      draft.currentQuery.endCursor = event.output.pageInfo.endCursor ?? null
                    }),
                  ),
                  target: "Retrieved",
                },
              },
            },
            Retrieved: {
              after: {
                2e2: {
                  target: "#resourcePicker.Open.Edit",
                },
              },
            },
          },
        },
      },
    },
    Done: {
      always: [
        {
          actions: ["sendSelectedItemsToParent", "clearSelected"],
          target: "#resourcePicker.Closed",
        },
      ],
    },
  },
})
