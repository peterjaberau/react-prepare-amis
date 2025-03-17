import { EuiProvider, EuiThemeProvider } from "@elastic/eui";
// import RouterRoot from "@/router.tsx";
import cache from "@/cache/iconCache";
import { GrafanaRenderer } from "@grafana-module/app/GrafanaRenderer.tsx";

const App: React.FC = () => {
  return (
    <>
      <EuiProvider cache={cache}>
        <EuiThemeProvider>
          <GrafanaRenderer />
          {/*<RouterRoot />*/}
        </EuiThemeProvider>
      </EuiProvider>
    </>
  );
};

export default App;
