import {EuiProvider, EuiThemeProvider} from "@elastic/eui";
import {ThemeProvider} from "./providers/ThemeProvide.tsx";
import cache from "~/cache/iconCache.ts"

import {RenderInspector} from "./machines/render-inspector"
import {RenderRoot} from "./machines/render-root"

function App() {
    return (
        <EuiProvider cache={cache}>
            <EuiThemeProvider>
                <ThemeProvider>
                    <RenderInspector InScopeComponent={RenderRoot} pageTitle="Resource Picker Editor"/>
                </ThemeProvider>
            </EuiThemeProvider>
        </EuiProvider>
    )
}

export default App
