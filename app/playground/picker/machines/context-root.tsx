import type { ActorRefFrom } from "xstate"
import { createActorReferenceContext } from "./hooks"
import { rootMachine } from "./machines"

export const {
  ActorRefProvider: RootProvider,
  useActorRefContext: useRootRef,
  useActorRefSelector: useRootSelector,
} = createActorReferenceContext<ActorRefFrom<typeof rootMachine>>()
