import { ActorRefFrom, createActor } from "xstate";
import { createContext } from "react";
import { reactGridLayoutMachine } from "./reactGridLayoutMachine.ts";
import { createActorContext } from "@xstate/react";
// import { createBrowserInspector } from '@statelyai/inspect';

// const { inspect } = createBrowserInspector();
// const inspector = createBrowserInspector({
//   filter: (inspEvent) => {
//     if (inspEvent.type === '@xstate.event') {
//       // Skip mouse drag events
//       return inspEvent.event.type !== 'mouse.drag';
//     }
//     return true;
//   },
//   iframe: document.getElementById('inspector-iframe'),
// });

export const ReactGridLayoutMachineContext = createActorContext(
  reactGridLayoutMachine,
  {
    // inspect
    inspect: (inpectionEvent) => {
      console.log(inpectionEvent);
    },

  },
);

export const ReactGridLayoutProvider = ({ children }: any) => {
  return (
    <ReactGridLayoutMachineContext.Provider>
      {children}
    </ReactGridLayoutMachineContext.Provider>
  );
};
