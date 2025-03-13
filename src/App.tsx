import { GrafanaTheme  } from "@data/index";
import { EuiProvider, EuiThemeProvider } from '@elastic/eui'
import Router from "@/router.tsx";
import cache from '@/cache/iconCache'




const App: React.FC = () => {

  return (
      <>
          <EuiProvider cache={cache}>
              <EuiThemeProvider>
              <Router />
              </EuiThemeProvider>
          </EuiProvider>
      </>
  )
}

export default App
