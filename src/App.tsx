import Router from "@/router.tsx";
import cache from '@/cache/iconCache'
import { EuiProvider, EuiThemeProvider } from '@elastic/eui'

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
