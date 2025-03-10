import { MachineContextRGL } from "./machineContextRGL"

export const useMachineRGL: any = () => {

  const actor = MachineContextRGL.useActorRef();
  const state = MachineContextRGL.useSelector((state: any) => state);

  return {
    actor: actor,
    state: state,
    components: state.context.components,
    global: state.context.global,
  }
}
