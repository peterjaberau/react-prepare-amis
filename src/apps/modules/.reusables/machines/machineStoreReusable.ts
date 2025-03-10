import { MachineContextReusable } from "./machineContextReusable.tsx"

export const useMachineReusable: any = () => {

  const actor = MachineContextReusable.useActorRef();
  const state = MachineContextReusable.useSelector((state: any) => state);

  return {
    actor: actor,
    state: state,
    components: state.context.components,
    global: state.context.global,
  }
}
