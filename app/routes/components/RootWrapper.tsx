import {createBrowserInspector} from "@statelyai/inspect"
import {useActor} from "@xstate/react"
import {type ActorOptions, type AnyActorLogic, assign, fromCallback, setup} from "xstate"
import { cloneElement, ReactNode } from "react";


const rootWrapperMachine = setup({
  types: {
    context: {} as { updateId: number, inspector: any },
    events: {} as { type: "inspector.open" } | { type: "inspector.closed" },
  },
  actors: {
    "Wait for inspector window to be closed": fromCallback<any, { inspector: any }>(
      ({input, sendBack}) => {
        const timerId = setInterval(() => {
            if (input.inspector.adapter.targetWindow!.closed) {
              sendBack({type: "inspector.closed"})
            }
          },
          1_00)

        return () => {
          clearInterval(timerId)
        }
      },
    ),
  },
  actions: {
    "Create inspector and assign to context": assign({
      inspector: () => createBrowserInspector(),
    }),
    "Increment update id in context": assign({
      updateId: ({context}) => context.updateId + 1,
    }),
  },
}).createMachine({
  context: {
    updateId: 0,
    inspector: undefined,
  },
  initial: "closed",
  states: {
    closed: {
      on: {
        "inspector.open": {
          target: "open",
          actions: ["Create inspector and assign to context", "Increment update id in context"],
        },
      },
    },
    open: {
      invoke: {
        src: "Wait for inspector window to be closed",
        input: ({context}) => {
          if (context.inspector === undefined) {
            throw new Error("Inspector must be defined in context")
          }

          return {
            inspector: context.inspector!,
          }
        },
      },
      on: {
        "inspector.closed": {
          target: "closed",
        },
      },
    },
  },
})


const RootWrapperSetter = ({inspector, children}: any) => {
  const actorOptions: ActorOptions<AnyActorLogic> | undefined =
    (inspector === undefined) ? undefined : {inspect: inspector.inspect as any}
  return <>{cloneElement(children, { actorOptions })}</>
}

export const RenderRootWrapper = ({ children }: { children: ReactNode }) => {
  const [state, send] = useActor(rootWrapperMachine);
  const isClosed = state.matches("closed");

  return (
    <div style={{ background: 'red'}}>
      <button
        disabled={!isClosed}
        onClick={() => {
          send({type: "inspector.open"})
        }}
      >
        {isClosed ? "Open Inspector" : "Visualizing"}
      </button>
      <RootWrapperSetter
        key={state.context.updateId}
        children={children}
        inspector={state.context.inspector}
      />
    </div>
  );
};
