import { machineRGL } from "./machineRGL";
import { createActorContext } from "@xstate/react";

export const MachineContextRGL = createActorContext(machineRGL, {
  // inspect
  inspect: (inpectionEvent) => {
    // console.log(inpectionEvent);
  },
});

export const MachineProviderRGL = ({ children }: any) => {
  return <MachineContextRGL.Provider>{children}</MachineContextRGL.Provider>;
};
