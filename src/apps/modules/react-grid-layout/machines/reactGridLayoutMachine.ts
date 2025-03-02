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


    closeWidgetPopoverAction: assign(({ context, event }) => {
      context.components.ReactGridLayoutApp.isWidgetPopoverOpen = false
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
      context.components.ReactGridLayoutApp.isWidgetPopoverOpen = true
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
        CLOSE_WIDGET_POPOVER: {
          actions: "closeWidgetPopoverAction",
        },
        CREATE_WIDGET: {
          actions: "createWidgetAction",
        },
        OPEN_WIDGET_POPOVER: {
          actions: "openWidgetPopoverAction",
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
          actions: "setterLoadExampleAction",
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
