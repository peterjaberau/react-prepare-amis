import { EuiPanel, EuiEmptyPrompt, EuiButtonEmpty, EuiButton } from "@elastic/eui";

export function DashboardEmpty() {
  return (
    <EuiEmptyPrompt
      title={<h2>Start your new dashboard by adding a visualization</h2>}
      actions={[
        <EuiButton color="primary" fill>
          Add Visualization
        </EuiButton>,
      ]}
    />
  );
}
