import { Outlet } from "react-router";
import { assign, fromCallback, setup } from "xstate";
import { createBrowserInspector } from "@statelyai/inspect";
import { RenderRootWrapper } from "@/routes/components/RootWrapper.tsx";



export default function Routes() {

  return (
    <div>
      <h1>Routes</h1>
      <RenderRootWrapper>
        <Outlet />
      </RenderRootWrapper>
    </div>
  );

}
