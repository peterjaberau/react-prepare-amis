import * as React from "react";
import { Demo } from "./components";
import { data as gridLayoutPresets } from "./presets";
import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiPanel } from "@elastic/eui";

const GridLayoutApp = ({ debug }: any) => {

  const [selectedConfig, setSelectedConfig] = React.useState(gridLayoutPresets.Boundaries);



  return (
    <>
      <EuiFlexGroup direction="column" >
        <EuiFlexItem>

          <EuiFlexGroup direction="row" justifyContent="flexStart" wrap={true}>
            {
              Object.entries(gridLayoutPresets).map(([key, value]) => {
                return (
                  <EuiFlexItem key={key} grow={false}>
                    <EuiButton
                      color={selectedConfig === value ? "primary" : "text"}
                      size={"s"}
                      onClick={() => {
                        setSelectedConfig(value);
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
            <Demo {...selectedConfig} debug={debug} />
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>

    </>
  );
};

export default GridLayoutApp;
