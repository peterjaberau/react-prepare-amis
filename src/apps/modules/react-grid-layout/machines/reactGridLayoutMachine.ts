import {
  setup,
  raise,
  spawnChild,
  sendTo,
  assign,
  fromPromise,
  fromCallback,
} from "xstate";
import { Ok } from "ts-results";
import { initialContext } from "./reactGridLayoutMachineConfig.ts";
import {
  handleMoveWidgetToCanvas,
  handleOpenWidgetPopover,
  handleCloseWidgetPopover,
  handleCreateWidget,
  handlerGetNewSessionActor,
  handlerLoadExampleActor,
  isFirstSessionGuard,
} from "./actionsReactGridLayout.ts";
import { v4 as uuidv4 } from "uuid";

//https://github.com/peterjaberau/react-prepare/blob/5beede5e664827c4fa524b1904f8ff0ab6ebab73/examples/amis-app/src/machines/myMachines.ts

export const reactGridLayoutMachine = setup({
  types: {
    context: {} as any,
    events: {} as any,
  },
  actions: {

    //common
    renameCanvasAction: assign(({ context, event }) => {
      return {
        ...context,
        canvases: context.canvases.map((canvas: any) => {
          if (canvas.id === event.params.canvasId) {
            return {
              ...canvas,
              name: event.params.newName,
            };
          }
          return canvas;
        }),
      };
    }),

    //ReactGridLayoutApp
    setterNewSessionAction: assign(({ context, event }) => {
      console.log({ context: context, event: event });

      const newCanvas = event.output.val;
      const updatedContext = {
        ...context,
        selected: {
          exampleId: newCanvas.id,
        },
        canvases: [newCanvas],
      };
      return updatedContext;
    }),
    setterLoadExampleAction: assign(({ context, event }) => {
      const loadedCanvas = event.output.val;
      const updatedContext = {
        ...context,
        selected: {
          exampleId: loadedCanvas.id,
        },
        canvases: loadedCanvas.data,
      };

      return updatedContext;

      // return updatedContext;
      // return context;
    }),
    addCanvasAction: assign(({ context, event }) => {
      const newCanvas = {
        ...context.presets.emptyCanvas,
        id: uuidv4(),
        name: `Canvas ${context.canvases.length + 1}`,
      };
      return {
        ...context,
        canvases: [...context.canvases, newCanvas],
      };
    }),
    removeCanvasAction: assign(({ context, event }) => {
      const toRemoveCanvasId = event.params.canvasId;
      const remainingCanvases = context.canvases.filter(
        (canvas: any) => canvas.id !== toRemoveCanvasId,
      );
      return {
        ...context,
        canvases: remainingCanvases,
      };
    }),
    updateCanvasAction: assign(({ context, event }) => {

      console.log('-----updateCanvasAction----', { context:context, event:event })


      return {
        ...context,
        canvases: context.canvases.map((canvas: any) => {
          if (canvas.id === event.params.updatedCanvas.id) {
            return event.params.updatedCanvas;
          }
          return canvas;
        }),
      };
    }),
    createWidgetAction: assign(({ context, event }) => {

      const title = event.params.title
      const targetCanvasId = event.params.targetCanvasId

      console.log('-----createWidgetAction----', { title:title, targetCanvasId:targetCanvasId })

      const targetCanvas = context.canvases.find(
        (canvas: any) => canvas.id === targetCanvasId,
      );
      console.log('-----targetCanvas----', { targetCanvas:targetCanvas })
      if (!targetCanvas) return;

      const id = uuidv4();
      const newWidget = {
        i: id,
        x: (targetCanvas.widgets.length * 4) % targetCanvas.config.cols,
        y: Math.floor(targetCanvas.widgets.length / 3) * 4,
        w: 4,
        h: 4,
        name: title,
        canvasId: targetCanvasId,
      };

      const updatedCanvas = {
        ...targetCanvas,
        widgets: [...targetCanvas.widgets, newWidget],
      };


      return {
        ...context,
        canvases: context.canvases.map((canvas: any) => {
          if (canvas.id === updatedCanvas.id) {
            return updatedCanvas;
          }
          return canvas;
        }),
      };


    }),
    openWidgetPopoverAction: assign(({ context, event }) => {

      const isOpen = context.components.ReactGridLayoutApp.isWidgetPopoverOpen
      if (isOpen) {
        context.components.ReactGridLayoutApp.isWidgetPopoverOpen = false
      } else {
        context.components.ReactGridLayoutApp.isWidgetPopoverOpen = true
      }

    }),
    closeWidgetPopoverAction: assign(({ context, event }) => {
      context.components.ReactGridLayoutApp.isWidgetPopoverOpen = false
    }),
    openLoadFromMenuPopoverAction: assign(({ context, event }) => {

      const isOpen = context.components.ReactGridLayoutApp.isLoadFromMenuOpen
      if (isOpen) {
        context.components.ReactGridLayoutApp.isLoadFromMenuOpen = false
      } else {
        context.components.ReactGridLayoutApp.isLoadFromMenuOpen = true
      }

    }),
    closeLoadFromMenuPopoverAction: assign(({ context, event }) => {
      context.components.ReactGridLayoutApp.isLoadFromMenuOpen = false
    }),
    openGlobalJsonAction: assign(({ context, event }) => {
      context.components.ReactGridLayoutApp.isGlobalJSONModalOpen = true
    }),
    closeGlobalJsonAction: assign(({ context, event }) => {
      context.components.ReactGridLayoutApp.isGlobalJSONModalOpen = false
    }),


    //CanvasHeader
    startEditingCanvasAction: assign(({ context, event }) => {
      context.components.CanvasHeader.isEditing = true
    }),
    cancelEditingCanvasAction: assign(({ context, event }) => {
      context.components.CanvasHeader.isEditing = false
    }),
    updateLocalCanvasNameAction: assign(({ context, event }) => {
      context.components.CanvasHeader.localName = event.params.newName
    }),

    saveCanvasNameAction: assign(({ context, event }) => {

      const updatedCanvasName = context.components.CanvasHeader.newName

      return {
        ...context,
        canvases: context.canvases.map((canvas: any) => {
          if (canvas.id === event.params.canvasId) {
            return {
              ...canvas,
              name: updatedCanvasName,
            };
          }
          return canvas;
        }),
      };

      // return {
      //   ...context,
      //   canvases: context.canvases.map((canvas: any) => {
      //     if (canvas.id === event.params.canvasId) {
      //       return {
      //         ...canvas,
      //         name: event.params.newName,
      //       };
      //     }
      //     return canvas;
      //   }),
      // };
    }),


    moveToCanvasAction: assign(({ context, event }) => {
      const widgetId = event.params.widgetId;
      const targetCanvasId = event.params.targetCanvasId;
      // return handleMoveWidgetToCanvas(context, widgetId, targetCanvasId);
    }),

    toggleSettingsCanvasAction: assign(({ context, event }) => {
      context.components.CanvasHeader.isSettingsOpen = !context.components.CanvasHeader.isSettingsOpen
    }),
    changeConfigCanvasAction: assign(({ context, event }) => {
      if (context.components.CanvasHeader.onUpdateCanvas) {
        const updatedCanvas = {
          ...context.components.CanvasHeader.canvas,
          config: event.params.newConfig,
        }
        context.components.CanvasHeader.onUpdateCanvas(updatedCanvas)
      }
    }),
    openWidgetCanvasPopoverAction: assign(({ context, event }) => {
      const rect = (event as any).currentTarget.getBoundingClientRect()
      context.components.CanvasHeader.widgetPopoverPosition = {
        x: rect.left,
        y: rect.bottom + window.scrollY,
      }
      context.components.CanvasHeader.isWidgetPopoverOpen = true
    }),
    closeWidgetCanvasPopoverAction: assign(({ context, event }) => {
      context.components.CanvasHeader.isWidgetPopoverOpen = false
    }),
    createWidgetFromCanvasHeaderAction: assign(({ context, event }) => {
      context.components.CanvasHeader.isWidgetPopoverOpen = false
      context.components.WidgetCreationPopover.selectedCanvases = [context.components.CanvasHeader.canvas]
    }),


  },
  actors: {
    handlerGetNewSessionActor,
    handlerLoadExampleActor,
  },
  guards: {
    isFirstSessionGuard,
  },
}).createMachine({
  id: "react-grid-layout-machine",
  initial: "idle",
  context: {
    ...initialContext,
  } as any,
  states: {
    idle: {
      always: [
        {
          target: "stateNewSession",
          guard: "isFirstSessionGuard",
        },
      ],
    },
    ready: {
      on: {
        //ReactGridLayoutApp
        LOAD_EXAMPLE: {
          target: "stateLoadExample",
        },
        NEW_SESSION: {
          target: "stateNewSession",
        },
        REMOVE_CANVAS: {
          actions: "removeCanvasAction",
        },
        ADD_CANVAS: {
          actions: "addCanvasAction",
        },
        RENAME_CANVAS: {
          actions: "renameCanvasAction",
        },
        UPDATE_CANVAS: {
          actions: "updateCanvasAction",
        },
        CREATE_WIDGET: {
          actions: "createWidgetAction",
        },
        OPEN_WIDGET_POPOVER: {
          actions: "openWidgetPopoverAction",
        },
        CLOSE_WIDGET_POPOVER: {
          actions: "closeWidgetPopoverAction",
        },
        OPEN_LOAD_FROM_MENU_POPOVER: {
          actions: "openLoadFromMenuPopoverAction",
        },
        OPEN_GLOBAL_JSON: {
          actions: "openGlobalJsonAction",
        },
        CLOSE_GLOBAL_JSON: {
          actions: "closeGlobalJsonAction",
        },

        //CanvasHeader
        MOVE_TO_CANVAS: {
          actions: "moveToCanvasAction",
        },
        CANVAS_START_EDITING: {
          actions: "startEditingCanvasAction",
        },
        CANVAS_UPDATE_LOCAL_NAME: {
          actions: ["updateLocalCanvasNameAction"],
        },
        CANVAS_SAVE_NAME: {
          actions: ["saveCanvasNameAction", "cancelEditingCanvasAction"],
        },
        CANVAS_CANCEL_EDITING: {
          actions: "cancelEditingCanvasAction",
        },
        CANVAS_TOGGLE_SETTINGS: {
          actions: "toggleSettingsCanvasAction",
        },
        CANVAS_CONFIG_CHANGE: {
          actions: "changeConfigCanvasAction",
        },
        CANVAS_OPEN_WIDGET_POPOVER: {
          actions: "openWidgetCanvasPopoverAction",
        },
        CANVAS_CLOSE_WIDGET_POPOVER: {
          actions: "closeWidgetCanvasPopoverAction",
        },
        CANVAS_CREATE_WIDGET_FROM_CANVAS_HEADER: {
          actions: "createWidgetFromCanvasHeaderAction",
        },


      },
    },
    stateNewSession: {
      invoke: {
        src: "handlerGetNewSessionActor",
        id: "handlerGetNewSessionActor",
        input: ({ context, event }: any) => ({
          context: context,
          event: event,
        }),
        onDone: {
          target: "stateCompleted",
          actions: "setterNewSessionAction",
        },
      },
    },

    stateLoadExample: {
      invoke: {
        src: "handlerLoadExampleActor",
        id: "handlerLoadExampleActor",
        input: ({ context, event }: any) => ({
          context: context,
          event: event,
          params: { exampleId: event.params.exampleId },
        }),
        onDone: {
          target: "stateCompleted",
          actions: ["setterLoadExampleAction", "closeLoadFromMenuPopoverAction"],
        },
      },
    },

    stateCompleted: {
      always: [
        {
          target: "ready",
        },
      ],
    },
  },
});
