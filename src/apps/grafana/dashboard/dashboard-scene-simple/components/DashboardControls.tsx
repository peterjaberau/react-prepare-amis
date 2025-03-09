import { EuiButton, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";

export function DashboardControls() {
  return (
    <EuiFlexGroup
      direction="row"
      justifyContent="spaceBetween"
      alignItems="center"
      wrap={false}
    >
      <EuiFlexItem grow={true}>
        <EuiFlexGroup
          direction="row"
          justifyContent="flexStart"
          alignItems="center"
          wrap={false}
        >
          <EuiFlexItem grow={false}>
            <EuiButton size="s" type="button">
              Refresh
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
      <EuiFlexItem grow={true}>
        <EuiFlexGroup
          direction="row"
          justifyContent="flexEnd"
          alignItems="center"
          wrap={false}
        >
          <EuiFlexItem grow={false}>
            <EuiButton size="s" type="button">
              Last 1 hour
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton size="s" type="button">
              Last 5 min
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
