import {createBrowserInspector} from "@statelyai/inspect"
import {useActor} from "@xstate/react"
import {type ActorOptions, type AnyActorLogic, assign, fromCallback, setup} from "xstate"


const appWrapperMachine = setup({
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


const AppWrapperSetter = ({inspector, InScopeComponent}: any) => {
  const actorOptions: ActorOptions<AnyActorLogic> | undefined =
    (inspector === undefined) ? undefined : {inspect: inspector.inspect as any}
  return <InScopeComponent actorOptions={actorOptions}/>
}

export const RenderAppWrapper = () => {

  const [state, send] = useActor(appWrapperMachine)
  const isClosed = state.matches("closed")

  return (
    <>
      <AppWrapperSetter
        key={state.context.updateId}
        InScopeComponent={InScopeComponent}
        inspector={state.context.inspector}
      />

      <EuiFlexGroup alignItems={"center"} justifyContent={"center"}>
        <PanelChrome
          title={pageTitle}
          actions={
            <Button
              disabled={!isClosed}
              onClick={() => {
                send({type: "inspector.open"})
              }}
            >
              {isClosed ? "Open Inspector" : "Visualizing"}
            </Button>

          }
        >
          <EuiFlexGroup style={{width: "1200px"}}>
            <InspectorSetter
              key={state.context.updateId}
              InScopeComponent={InScopeComponent}
              inspector={state.context.inspector}
            />
          </EuiFlexGroup>
        </PanelChrome>
      </EuiFlexGroup>

    </>
  )
}



const GlobalSetter = ({inspector, InScopeComponent}: any) => {
  const actorOptions: ActorOptions<AnyActorLogic> | undefined =
    (inspector === undefined) ? undefined : {inspect: inspector.inspect as any}
  return <InScopeComponent actorOptions={actorOptions}/>
}


export const RenderGlobal = ({InScopeComponent}: any) => {

  const [state, send] = useActor(globalMachine)
  const isClosed = state.matches("closed")

  return (
    <>
      <Outlet />
      <EuiFlexGroup alignItems={"center"} justifyContent={"center"}>
        <PanelChrome
          title={pageTitle}
          actions={
            <Button
              disabled={!isClosed}
              onClick={() => {
                send({type: "inspector.open"})
              }}
            >
              {isClosed ? "Open Inspector" : "Visualizing"}
            </Button>

          }
        >
          <EuiFlexGroup style={{width: "1200px"}}>
            <InspectorSetter
              key={state.context.updateId}
              InScopeComponent={InScopeComponent}
              inspector={state.context.inspector}
            />
          </EuiFlexGroup>
        </PanelChrome>
      </EuiFlexGroup>

    </>
  )
}
