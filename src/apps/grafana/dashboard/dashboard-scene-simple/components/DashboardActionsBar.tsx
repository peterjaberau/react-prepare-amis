import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonEmpty,
  EuiContextMenuPanel,
  EuiContextMenuItem,
  EuiPopover, EuiButton
} from "@elastic/eui";
import { PropsWithChildren } from "react";

export function DashboardScene() {
  return (
    <EuiFlexGroup justifyContent="flexEnd" alignItems="center" wrap={false}>
      <EuiFlexItem grow={false}>
        <EuiButton size="s" type="button">Add Viz</EuiButton>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButton size="s" type="button">Add Row</EuiButton>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButton size="s" type="button">Save dashboard</EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
