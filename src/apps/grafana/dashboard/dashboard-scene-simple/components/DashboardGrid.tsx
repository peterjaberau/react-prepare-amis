import React from "react";
import { EuiPanel } from "@elastic/eui";
import ReactGridLayout from "react-grid-layout";
import { data as initialDashboardData } from "../../mock-data/dashboards";
import { GRID_COLUMN_COUNT } from "../../constants";
import { DashboardGridItems } from "@/apps/grafana/dashboard/dashboard-scene-simple/components/DashboardGridItems.tsx";


function buildLayout(panels: any) {
  let layout: ReactGridLayout.Layout[] = [];
  let panelMap: any = {};

  let count = 0;
  for (const panel of panels) {
    if (!panel.key) {
      panel.key = `panel-${panel.id}-${Date.now()}`;
    }
    panelMap[panel.key] = panel;

    if (!panel.gridPos) {
      console.log("panel without gridpos");
      continue;
    }

    const panelPos: ReactGridLayout.Layout = {
      i: panel.key,
      x: panel.gridPos.x,
      y: panel.gridPos.y,
      w: panel.gridPos.w,
      h: panel.gridPos.h,
    };

    if (panel.type === "row") {
      panelPos.w = GRID_COLUMN_COUNT;
      panelPos.h = 1;
      panelPos.isResizable = false;
      panelPos.isDraggable = panel.collapsed;
    }

    layout.push(panelPos);
  }
};

export function DashboardGrid() {


  const [dashboardData, setDashboardData] = React.useState(initialDashboardData);
  const [layout, setLayout] = React.useState(buildLayout(dashboardData.panels) as any);


  const onDragStopHandler = (layout: any, oldItem: any, newItem: any) => {
    console.log("onDragStopHandler", {layout: layout, oldItem: oldItem, newItem:newItem});
  }

  const onResizeHandler = (layout: any, oldItem: any, newItem: any) => {
    console.log("onResizeHandler", {layout: layout, oldItem: oldItem, newItem:newItem});
  }

  const onResizeStopHandler = (layout: any, oldItem: any, newItem: any) => {
    console.log("onResizeStopHandler", {layout: layout, oldItem: oldItem, newItem:newItem});
  }

  const onLayoutChangeHandler = (layout: any) => {
    console.log("onLayoutChangeHandler", {layout: layout});
  }


  return (
    <div
      style={{
        flex: "1 1 auto",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ width: "1646px", height: "100%" }}>
        <ReactGridLayout
          width={1646}
          isDraggable={true}
          isResizable={true}
          containerPadding={[0, 0]}
          useCSSTransforms={true}
          margin={[8, 8]}
          cols={24}
          rowHeight={30}
          draggableHandle=".grid-drag-handle"
          draggableCancel=".grid-drag-cancel"
          layout={layout}
          onDragStop={onDragStopHandler}
          onResize={onResizeHandler}
          onResizeStop={onResizeStopHandler}
          onLayoutChange={onLayoutChangeHandler}
        >
          <DashboardGridItems panels={dashboardData.panels} />
        </ReactGridLayout>
      </div>
    </div>
  );
}
