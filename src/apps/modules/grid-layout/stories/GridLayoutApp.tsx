import * as React from "react";
import { Demo } from "./components";
import { data as gridLayoutPresets } from "./presets";
import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiPanel } from "@elastic/eui";

const GridLayoutApp = () => {

  const [selectedConfigKey, setSelectedConfigKey]: any = React.useState('Boundaries' as any);
  const [debug, setDebug] = React.useState(false);
  // React.useEffect(() => {
  //  console.log('selectedConfigKey', selectedConfigKey);
  //  console.log('gridLayoutPresets[selectedConfigKey]', gridLayoutPresets[selectedConfigKey]);
  // }, [selectedConfigKey]);

  return (
    <>
      <EuiFlexGroup direction="column" >
        <EuiFlexItem>

          <EuiFlexGroup direction="row" justifyContent="flexStart" wrap={true}>
            <EuiFlexItem grow={false}>
              <EuiButton
                color={debug ? "primary" : "text"}
                size={"s"}
                onClick={() => {
                  setDebug(!debug);
                }}
              >
                Debug
              </EuiButton>
            </EuiFlexItem>

            {
              Object.entries(gridLayoutPresets).map(([key, value]) => {
                return (
                  <EuiFlexItem key={key} grow={false}>
                    <EuiButton
                      color={selectedConfigKey === key ? "primary" : "text"}
                      size={"s"}
                      onClick={() => {
                        setSelectedConfigKey(key as any);
                      }}
                      >
                      {key}
                    </EuiButton>
                  </EuiFlexItem>
                );
              })
            }
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel>
            <Demo {...gridLayoutPresets[selectedConfigKey] as any} debug={debug} />
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>

    </>
  );
};

export default GridLayoutApp;
