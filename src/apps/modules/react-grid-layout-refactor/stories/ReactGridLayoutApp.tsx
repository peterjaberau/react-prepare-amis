import { useState, useEffect } from "react";
import { Demo } from "./components";
import { data as gridLayoutPresets, getPresetList } from "./presets";
import {
  EuiButtonGroup,
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
} from "@elastic/eui";

import { getInitialState } from "./presets";

const dashboardConfigKeys = [
  "compactType",
  "isBounded",
  "autoSize",
  "isDraggable",
  "isResizable",
  "isDroppable",
  "measureBeforeMount",
];
const ReactGridLayoutApp = () => {
  const [selectedKey, setSelectedKey]: any = useState("showcase" as any);
  const [presetList, setPresetList] = useState(getPresetList());
  const [currentState, setCurrentState] = useState<any>(
    getInitialState(selectedKey),
  );

  const onChangeDashboardConfig = (id: any) => {
    setCurrentState({
      ...currentState,
      defaultProps: {
        ...currentState.defaultProps,
        [id]: !currentState.defaultProps[id],
      },
    });
  };

  // [{key: 'showcase', enabled: true if hasOwnProperty defaultProps }]

  // mounted
  useEffect(() => {
    setCurrentState({
      ...currentState,
      additionalProps: {
        ...currentState.additionalProps,
        mounted: true,
      },
    });
  }, []);

  console.log("presetList", presetList);
  useEffect(() => {
    setCurrentState(getInitialState(selectedKey));
  }, [selectedKey]);


  return (
    <>
      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <EuiFlexGroup direction="row" justifyContent="spaceBetween">
            <EuiFlexItem grow={true}>
              <EuiFlexGroup
                direction="column"
                justifyContent="flexStart"
                gutterSize={"s"}
              >
                {Object.entries(
                  presetList.reduce((acc: any, item: any) => {
                    if (!acc[item.group]) {
                      acc[item.group] = [];
                    }
                    acc[item.group].push(item);
                    return acc;
                  }, {}),
                ).map(([group, items]: [string, any[]] | any) => (
                  <EuiFlexItem grow={false} key={group}>
                    <EuiButtonGroup
                      isFullWidth={false}
                      key={group}
                      buttonSize="compressed"
                      onChange={(id: any) => {
                        setSelectedKey(id);
                      }}
                      legend={group}
                      options={items.map((item: any) => {
                        return {
                          id: item.name,
                          label: item.name,
                          isDisabled: !item.enabled,
                        };
                      })}
                      idSelected={selectedKey}
                    />
                  </EuiFlexItem>
                ))}
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem grow={true}>
              <EuiFlexGroup
                direction="column"
                justifyContent="flexStart"
                gutterSize={"s"}
              >
                <EuiFlexItem grow={false} key={"dashboardConfig"}>
                  <EuiButtonGroup
                    type="multi"
                    idToSelectedMap={currentState.defaultProps}
                    isFullWidth={false}
                    buttonSize="compressed"
                    onChange={(id) => onChangeDashboardConfig(id)}
                    legend={"Dashboard Config"}
                    options={dashboardConfigKeys.map((item: any) => {
                      return {
                        id: item,
                        label: item,
                      };
                    })}
                    // options={[
                    //   { id: "compactType", label: "compactType", isDisabled: false },
                    // ]}
                    // idSelected={dashboardConfig}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
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

/*



<EuiButtonGroup
            buttonSize="compressed"
            onChange={(id: any) => {
              setSelectedKey(id);
            }}
            legend={"Presets"}
            options={
              presetList.map((item: any) => {
                return {
                  id: item.name,
                  label: item.name,
                  isDisabled: !item.enabled,
                };
              })
            }
            idSelected={selectedKey}
          />

 */
