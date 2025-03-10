import { useState, useEffect } from "react";
import { Demo } from "./components";
import { data as gridLayoutPresets, getPresetList } from "./presets";
import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiPanel } from "@elastic/eui";
import { getInitialState } from "./presets";

const ReactGridLayoutApp = () => {
  const [selectedKey, setSelectedKey]: any = useState("showcase" as any);

  // [{key: 'showcase', enabled: true if hasOwnProperty defaultProps }]
  const [presetList, setPresetList] = useState(getPresetList());

  const [currentState, setCurrentState] = useState<any>(
    getInitialState(selectedKey),
  );



  // mounted
  useEffect(() => {
    setCurrentState({
      ...currentState,
      additionalProps: {
        ...currentState.additionalProps,
        mounted: true,
      }
    });

  }, []);



  useEffect(() => {
    setCurrentState(getInitialState(selectedKey));

  }, [selectedKey]);

  return (
    <>
      <EuiFlexGroup direction="column"  >
        <EuiFlexItem>
          <EuiFlexGroup direction="row" justifyContent="flexStart" wrap={true}>
            <EuiFlexItem grow={false}></EuiFlexItem>

            {presetList.map((item: any) => {
              return (
                <EuiFlexItem key={item.name} grow={false}>
                  <EuiButton
                    color={selectedKey === item.name ? "primary" : "text"}
                    size={"s"}
                    onClick={() => {
                      setSelectedKey(item.name);
                    }}
                    isDisabled={!item.enabled}
                  >
                    {item.name}
                  </EuiButton>
                </EuiFlexItem>
              );
            })}
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel hasBorder={true}>

                <Demo {...currentState} />

          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};

export default ReactGridLayoutApp;
