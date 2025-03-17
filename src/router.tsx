import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouterProvider, useDynamicRouter } from "./router-context";
import App from "./App";
import AntdPageExample from "./apps/antd/views/AntdPageExample";
import AmisExample from "@/apps/amis/views/AmisExample";
import AppEui from "./apps/eui/App";
import { DynamicEditor } from "@/apps/amis/editor/DynamicEditor";

const DynamicRoutes = () => {
  const { routes } = useDynamicRouter();

  console.log('111');

  if (!routes || routes.length === 0) {
    console.log('2222');
    return null; // Avoid rendering an empty Fragment that might break <Routes>
  }
  return (
    <>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </>
  );
};

const RouterRoot = () => {
  return (
    <RouterProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/antd-page" element={<AntdPageExample />} />
          <Route path="/amis-example" element={<AmisExample />} />
          <Route path="/editor/:id" element={<DynamicEditor />} />
          <Route path="/eui" element={<AppEui />} />

        <>
          <DynamicRoutes />
        </>

          {/*<Route path="/eui/:render" element={<AppEui />} />*/}
          {/*<Route path="/editor/:id" element={<DynamicEditor />} />*/}
          {/*<Route path="/preview" element={<PreviewRenderer />} />*/}
          {/*<Route path="/examples" element={<AppEditor />} />*/}
        </Routes>
      </BrowserRouter>
    </RouterProvider>
  );
};

export default RouterRoot;
