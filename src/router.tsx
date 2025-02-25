import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
import AntdPageExample from "./apps/antd/views/AntdPageExample"
import AmisExample from "@/apps/amis/views/AmisExample";
import AppEui from "./apps/eui/App"
import { DynamicEditor } from "@/apps/amis/editor/DynamicEditor"


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/antd-page" element={<AntdPageExample />} />
        <Route path="/amis-example" element={<AmisExample />} />
        <Route path="/editor/:id" element={<DynamicEditor />} />
        <Route path="/eui" element={<AppEui />} />

        {/*<Route path="/eui/:render" element={<AppEui />} />*/}
        {/*<Route path="/editor/:id" element={<DynamicEditor />} />*/}
        {/*<Route path="/preview" element={<PreviewRenderer />} />*/}
        {/*<Route path="/examples" element={<AppEditor />} />*/}
      </Routes>
    </BrowserRouter>
  )
}

export default Router
