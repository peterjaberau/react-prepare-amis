import { DashboardControls } from "./DashboardControls";
import { DashboardDefaultLayoutManager } from "./DashboardDefaultLayoutManager";
import { EuiFlexGroup, EuiFlexItem, EuiPanel } from "@elastic/eui";

export function DashboardScene() {
  return (


    <EuiFlexGroup direction="column" >
      <EuiFlexItem grow={false}>
        <DashboardControls />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <DashboardDefaultLayoutManager />

      </EuiFlexItem>

    </EuiFlexGroup>
  );
}
