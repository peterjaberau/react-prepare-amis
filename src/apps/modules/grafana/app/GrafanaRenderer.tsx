import { GrafanaTheme } from "@data/index";
import { useEffect, useState } from "react";


export const GrafanaRenderer = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {loading ? <div>Loading...</div> : window.__grafana_app_component__}
    </>
  );
};
