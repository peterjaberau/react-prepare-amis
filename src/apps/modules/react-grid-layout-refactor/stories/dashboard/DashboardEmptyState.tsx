import { EuiFlexGroup, EuiFlexItem, EuiPanel } from "@elastic/eui";
import { ReactNode } from "react";

type AnyComponentTypes = {
  children?: ReactNode | any;
  [key: string]: ReactNode | any;
};


type DashboardEmptyStateInnerProps = AnyComponentTypes & {
  justifyContent?:
    | "flexStart"
    | "center"
    | "flexEnd"
    | "spaceBetween"
    | "spaceAround"
    | "spaceEvenly";
};

const DashboardEmptyStateInner = (props: DashboardEmptyStateInnerProps) => {
  const { children, justifyContent = "flexStart", ...rest } = props;
  return (
    <EuiFlexGroup
      justifyContent={justifyContent}
      alignItems="center"
      gutterSize="s"
      {...rest}
    >
      {children}
    </EuiFlexGroup>
  );
};

export const DashboardEmptyState = (props: AnyComponentTypes) => {
  return (
    <EuiFlexGroup direction="row" justifyContent={"center"}>
      <EuiFlexItem grow={true}>
        <DashboardEmptyStateInner> DashboardEmptyState.DashboardEmptyStateInner </DashboardEmptyStateInner>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
