import { useReactGridLayoutMachine } from "@/apps/modules/react-grid-layout/machines/reactGridLayoutMachineStore.ts";
import {
  EuiButton,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPopover,
} from "@elastic/eui";
import React from "react";
import WidgetCreationPopover from "@/apps/modules/react-grid-layout/components/WidgetCreationPopover.tsx";

export const DashboardControls = () => {
  const { state, actor } = useReactGridLayoutMachine();

  return (
    <EuiFlexGroup direction="row" gutterSize="xs" justifyContent={'spaceBetween'}>
      <EuiFlexItem grow={false}>Canvases - {state.value} - {state.context.components.ReactGridLayoutApp.isGlobalJSONModalOpen} </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiFlexGroup
          direction={"row"}
          justifyContent={"flexEnd"}
          gutterSize="xs"
        >
          <EuiFlexItem>
            <EuiPopover
              id={"load-from-menu"}
              isOpen={
                state.context.components.ReactGridLayoutApp.isLoadFromMenuOpen
              }
              closePopover={() =>
                actor.send({ type: "CLOSE_LOAD_FROM_MENU_POPOVER" })
              }
              button={
                <EuiButton
                  size="s"
                  color="text"
                  fill
                  iconSide={"right"}
                  iconType="arrowDown"
                  onClick={() =>
                    actor.send({ type: "OPEN_LOAD_FROM_MENU_POPOVER" })
                  }
                >
                  Load
                </EuiButton>
              }
            >
              <EuiContextMenuPanel
                size="s"
                items={state.context.data.map((example: any) => (
                  <EuiContextMenuItem
                    key={example.id}
                    size="s"
                    onClick={() =>
                      actor.send({
                        type: "LOAD_EXAMPLE",
                        params: { exampleId: example.id },
                      })
                    }
                  >
                    {example.id}
                  </EuiContextMenuItem>
                ))}
              />
            </EuiPopover>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiButton
              size="s"
              color="text"
              fill
              onClick={() => actor.send({ type: "NEW_SESSION" })}
            >
              New Session
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPopover
              id={"add-new-widget-popover"}
              button={
                <EuiButton
                  size={"s"}
                  color={"text"}
                  fill
                  iconSide={"right"}
                  iconType="arrowDown"
                  onClick={() => actor.send({ type: "OPEN_WIDGET_POPOVER" })}
                >
                  Add Widget
                </EuiButton>
              }
              isOpen={
                state.context.components.ReactGridLayoutApp.isWidgetPopoverOpen
              }
              closePopover={() => actor.send({ type: "CLOSE_WIDGET_POPOVER" })}
            >
              <WidgetCreationPopover />
            </EuiPopover>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiButton
              onClick={() => actor.send({ type: "OPEN_GLOBAL_JSON" })}
              size={"s"}
              color={"text"}
              fill
            >
              Global JSON
            </EuiButton>
          </EuiFlexItem>

          <EuiFlexItem>
            <EuiButton
              size="s"
              color="text"
              fill
              onClick={() => actor.send({ type: "ADD_CANVAS" })}
            >
              Add Canvas
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
