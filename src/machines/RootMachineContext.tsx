import { ActorRefFrom, createActor } from "xstate"
import { createContext } from "react"
import { rootMachine } from "./rootMachine.ts"
import { createActorContext } from "@xstate/react"


export const RootMachineContext = createActorContext(rootMachine, {
  inspect: (inpectionEvent: any) => {
    // console.log(inpectionEvent)
  },
})

export const RootMachineProvider = ({ children }: any) => {
  return <RootMachineContext.Provider>{children}</RootMachineContext.Provider>
}
