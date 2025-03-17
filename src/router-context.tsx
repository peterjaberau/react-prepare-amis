import { createContext, useContext, useState } from "react";
import { RouteObject } from "react-router-dom";

// Context for dynamically registering routes
const RouterContext = createContext({
  routes: [] as { path: string; element: JSX.Element }[], // Ensure correct type
  registerRoutes: (newRoutes: { path: string; element: JSX.Element }[]) => {},
});

// Hook to use Router Context
export const useDynamicRouter = () => useContext(RouterContext);

// Provider Component
export const RouterProvider = ({ children }: { children: React.ReactNode }) => {
  const [routes, setRoutes]: any = useState<RouteObject[] | any[]>([]);

  // Function to add routes dynamically
  const registerRoutes = (newRoutes: RouteObject[] | any) => {
    setRoutes((prevRoutes: any) => [...prevRoutes, ...newRoutes]);
  };

  return (
    <RouterContext.Provider value={{ routes, registerRoutes }}>
      {children}
    </RouterContext.Provider>
  );
};
