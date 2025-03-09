import { EuiPanel } from "@elastic/eui";
import { useEffect, useState } from "react";
import { internalDashboardConfig } from "../../constants";
import { data as initialDashboardData } from "../../mock-data/dashboards";
import { DashboardGridItem } from "@/apps/grafana/dashboard/dashboard-scene-simple/components/DashboardGridItem.tsx";

interface DashboardGridItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  gridWidth?: number;
  windowHeight: number;
  windowWidth: number;
  children: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function DashboardGridItems({ panels }: any) {

  const [internalState, setInternalState] = useState(internalDashboardConfig);

  const [panelElements, setPanelElements] = useState<any[]>([]);


  return (
    <>
      {panels.map((panel: any) => {
        return (
          <DashboardGridItem key={panel.id} windowHeight={internalDashboardConfig.windowHeight} windowWidth={internalDashboardConfig.windowWidth} gridPos={panel.gridPos} isViewing={false}>
            <EuiPanel>
              {panel.title}
            </EuiPanel>
          </DashboardGridItem>
        )
      })}
    </>


  );
}
