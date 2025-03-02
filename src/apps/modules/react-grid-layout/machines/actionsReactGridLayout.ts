import { v4 as uuidv4 } from "uuid";
import { Canvas } from "@/apps/modules/react-grid-layout/types";
import React from "react";
import { emptyCanvas } from "@/apps/modules/react-grid-layout/data/examples.ts";
import { AnyActorLogic, assign, fromPromise } from "xstate";
import { Ok } from "ts-results";



export const handleMoveWidgetToCanvas = (
  widgetId: string,
  sourceCanvasId: string,
  targetCanvasId: string,
  canvases: any,
) => {
  // Find the source and target canvases
  const sourceCanvas = canvases.find(
    (canvas: any) => canvas.id === sourceCanvasId,
  );
  const targetCanvas = canvases.find(
    (canvas: any) => canvas.id === targetCanvasId,
  );

  if (!sourceCanvas || !targetCanvas) return;

  // Find the widget to move
  const widgetToMove = sourceCanvas.widgets.find(
    (widget: any) => widget.i === widgetId,
  );

  if (!widgetToMove) return;

  // Create a copy of the widget with the new canvasId
  const movedWidget = {
    ...widgetToMove,
    canvasId: targetCanvasId,
    // Position the widget at a reasonable location in the target canvas
    x: 0,
    y:
      targetCanvas.widgets.length > 0
        ? Math.max(...targetCanvas.widgets.map((w: any) => w.y + w.h))
        : 0,
  };

  // Remove the widget from the source canvas
  const updatedSourceCanvas = {
    ...sourceCanvas,
    widgets: sourceCanvas.widgets.filter(
      (widget: any) => widget.i !== widgetId,
    ),
  };

  // Add the widget to the target canvas
  const updatedTargetCanvas = {
    ...targetCanvas,
    widgets: [...targetCanvas.widgets, movedWidget],
  };

  // Update both canvases
  return {
    canvases: canvases.map((canvas: any) => {
      if (canvas.id === sourceCanvasId) return updatedSourceCanvas;
      if (canvas.id === targetCanvasId) return updatedTargetCanvas;
      return canvas;
    }),
  };
};

export const handleOpenWidgetPopover = (event: React.MouseEvent) => {
  return {
    widgetPopoverPosition: { x: event.clientX, y: event.clientY },
    isWidgetPopoverOpen: true,
  };
};

export const handleCloseWidgetPopover = () => {
  return {
    isWidgetPopoverOpen: false,
  };
};

export const handleCreateWidget = (
  title: string,
  targetCanvasId: string,
  canvases: any,
) => {
  const targetCanvas = canvases.find(
    (canvas: any) => canvas.id === targetCanvasId,
  );

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

  //handleUpdateCanvas(updatedCanvas, canvases);
};


export const handlerLoadExampleActor = fromPromise(async ({ input }: any) => {
  await new Promise((resolve: any) => setTimeout(resolve, 1_00));

  const exampleId = input.event.params.exampleId;
  const examplePayload = input.context.data.find((example: any) => example.id === exampleId);

  return new Ok(examplePayload);
});

export const handlerGetNewSessionActor = fromPromise(async ({ input }: any) => {
  await new Promise((resolve: any) => setTimeout(resolve, 1_00));
  return new Ok(input.context.presets.emptyCanvas);
});


export const isFirstSessionGuard = ({ context }: any) => {
  return !context.canvases || context.canvases.length === 0;
};

/*

          //actions: [
          //               assign({
          //                 statusMessage: "Profile updated",
          //               }),
          //               sendTo(
          //                 ({ system }) => system.get("root"),
          //                 ({ context }) => ({
          //                   type: "updateUserData",
          //                   params: {
          //                     username: context.username,
          //                     avatar_character: context.avatar_character,
          //                     avatar_background: context.avatar_background,
          //                   },
          //                 }),
          //               ),
          //             ],

// input = { content, event }

export const handleNewSession = () => {
  // Generate a new empty canvas with a fresh ID
  const newEmptyCanvas = emptyCanvas.map((canvas) => ({
    ...canvas,
    id: uuidv4(),
  }));

  return {
    canvases: newEmptyCanvas,
  }
};

export const handleNewSession = () => {
  // Generate a new empty canvas with a fresh ID
  const newEmptyCanvas = emptyCanvas.map((canvas) => ({
    ...canvas,
    id: uuidv4(),
  }));

  return {
    canvases: newEmptyCanvas,
  }
};

const userFetcher = fromPromise(({ input }) => {
  return fetch(`/users/${input.userId}`).then((res) => res.json());
});


//input: ({ context, event }: any) => ({ scope: '', data: event.data, }),
        //        input: ({ event }: any) => ({ username: event.username, password: event.password }),
        //input: {},
        // input: ({ event, context }) => {
        //           const endTimestamp = Math.floor(Date.now() / 1000)
        //           return {
        //             description: event.description,
        //             start_time: `@${endTimestamp - context.timerValue}`,
        //             end_time: `@${endTimestamp}`,
        //           }
        //         },
        // input: ({ context }: any) => ({
        //           from: '',
        //           to: '',
        //         }),
        //input: ({ context }) => ({
        //             id: context.userId,
        //             username: context.username,
        //             avatar_character: context.avatar_character,
        //             avatar_background: context.avatar_background,
        //           }),

*/
