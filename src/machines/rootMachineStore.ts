import { RootMachineContext } from "./RootMachineContext.tsx"

export const useRootMachine: any = () => {

  const actor = RootMachineContext.useActorRef();
  const state = RootMachineContext.useSelector((state: any) => state);

  return {
    actor: actor,
    state: state,
    components: state.context.components,
    global: state.context.global,
  }
}
