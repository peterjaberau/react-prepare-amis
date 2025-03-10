import { ReactNode } from "react";

import { EuiFlexGroup, EuiFlexItem, EuiPanel } from "@elastic/eui";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardContent } from "./DashboardContent.tsx";




type AnyComponentTypes = {
  children?: ReactNode | any;
  [key: string]: ReactNode | any;
}

export type DashboardPanelProps = AnyComponentTypes & {
  type?: "row" | "card" | any;
  title?: string;
  id?: number;
  gridPos?:  { x: number; y: number; w: number; h: number; i: string; };
}

export type DashboardProps = AnyComponentTypes & {
  uid?: string;
  editable?: boolean;
  dashboard_id?: string;
  title?: string;
  header?: {
    left?: ReactNode;
    center?: ReactNode;
    right?: ReactNode;
  }
  content?: {
    // common
    type?: "grid" | "document" | "notebook" | "board" | "draw" | "diagram" | "automationDesigner" | "appDesign"

    //layout = grid
    options?: {
      compactType?: "vertical" | "horizontal";
      maxRows?: number;
      transformScale?: number;
      allowOverlap?: boolean;
      isDraggable: boolean,
      isResizable: boolean,
      className?: string;
      rowHeight?: number;
      cols: { lg?: number, md?: number, sm?: number, xs?: number, xxs?: number };
      [key: string]: any;
    },
    panels?: DashboardPanelProps[];
  };
}

export const Dashboard = () => {
  return (
    <EuiPanel>
      <EuiFlexGroup direction="column">
        <EuiFlexItem grow={false}>
          <DashboardHeader />
        </EuiFlexItem>
        <EuiFlexItem grow={true}>
          <DashboardEmptyState />
        </EuiFlexItem>
        <EuiFlexItem grow={true}>
          <DashboardContent />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
};
