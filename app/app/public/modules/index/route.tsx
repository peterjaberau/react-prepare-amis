import { useSelector } from "@xstate/store/react";
import { globalStore } from "@/store-provider.tsx";
import { EuiButton } from "@elastic/eui";

export function Route() {

  const state = useSelector(globalStore, (state) => state);

  return (
    <div>??
    <EuiButton onClick={() => console.log('state.context----', state.context)}>
      log state
    </EuiButton>
    </div>
  );
}
