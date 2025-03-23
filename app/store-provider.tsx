import { createStore } from "@xstate/store";
import { useRef, createContext, useContext } from "react";

const StoreContext = createContext(null as any);

const makeStore = () => {
  return createStore({ state: {} } as any); // Empty initial state
};
export type AppStore = ReturnType<typeof makeStore>;

export default function XStateStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = createStore({ state: {} } as any);
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store)
    throw new Error("useStore must be used within a XStateStoreProvider");
  return store;
};

/*
example usage:

export function Counter() {
  const store = useStore();
  const { state, send } = store.useSelector((s) => s);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => send("increment")}>Increment</button>
      <button onClick={() => send("decrement")}>Decrement</button>
    </div>
  );
}




 */
