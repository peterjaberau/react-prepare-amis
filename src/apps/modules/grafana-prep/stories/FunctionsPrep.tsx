import JsonView from "react18-json-view";
import { Collapse } from '@grafana-ui/index';
import { useState } from "react";
import { SearchWithResults } from "./components/SearchWithResults";

import { getEnvConfig } from "@utils/env-util.ts";

export const FunctionsPrep = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [JsonCollapsed, setJsonCollapsed] = useState(false);
  const [JsonSrc, setJsonSrc] = useState({
    getEnvConfigFn: getEnvConfig()
  });


  return (
    <>
      <Collapse  label="Functions" collapsible={true} isOpen={collapsed} onToggle={() => setCollapsed(!collapsed)}>
        {
          collapsed && (
            <JsonView
              src={JsonSrc}
              enableClipboard={false}
              collapsed={JsonCollapsed}
            />
          )
        }
      </Collapse>
      <SearchWithResults />
    </>
  );
}
