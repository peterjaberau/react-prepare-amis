import type { ActorRefFrom } from "xstate"
import { createActorReferenceContext } from "./hooks"
import { resourcePickerMachineEditor } from "./machines"
import React from "react";

export const {
  ActorRefProvider: ResourcePickerRefProvider,
  useActorRefContext: useResourcePickerRefContext,
  useActorRefSelector: useResourcePickerRefSelector,
} = createActorReferenceContext<ActorRefFrom<typeof resourcePickerMachineEditor>>()


