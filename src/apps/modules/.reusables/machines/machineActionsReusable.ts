import { v4 as uuidv4 } from "uuid";
import React from "react";
import { AnyActorLogic, assign, fromPromise } from "xstate";
import { Ok } from "ts-results";

export const handlerLoadExampleActor = fromPromise(async ({ input }: any) => {
  await new Promise((resolve: any) => setTimeout(resolve, 1_00));

  const exampleId = input.event.params.exampleId;
  const examplePayload = input.context.data.find(
    (example: any) => example.id === exampleId,
  );

  return new Ok(examplePayload);
});

export const handlerGetNewSessionActor = fromPromise(async ({ input }: any) => {
  await new Promise((resolve: any) => setTimeout(resolve, 1_00));
  return new Ok(input.context.presets.emptyCanvas);
});

export const isFirstSessionGuard = ({ context }: any) => {
  return !context.canvases || context.canvases.length === 0;
};
