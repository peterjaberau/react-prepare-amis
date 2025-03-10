import { machineReusable } from "./machineReusable.ts";
import { createActorContext } from "@xstate/react";

export const MachineContextReusable = createActorContext(machineReusable, {
  // inspect
  inspect: (inpectionEvent) => {
    console.log(inpectionEvent);
  },
});

export const MachineProviderReusable = ({ children }: any) => {
  return <MachineContextReusable.Provider>{children}</MachineContextReusable.Provider>;
};
