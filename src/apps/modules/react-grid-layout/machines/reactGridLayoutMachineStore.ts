import { ReactGridLayoutMachineContext } from "./ReactGridLayoutMachineContext"

export const useReactGridLayoutMachine: any = () => {

  const actor = ReactGridLayoutMachineContext.useActorRef();
  const state = ReactGridLayoutMachineContext.useSelector((state: any) => state);

  return {
    actor: actor,
    state: state,
    components: state.context.components,
    global: state.context.global,
  }
}
