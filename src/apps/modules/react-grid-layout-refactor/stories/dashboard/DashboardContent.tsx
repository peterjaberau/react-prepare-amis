import { EuiFlexGroup, EuiFlexItem, EuiPanel } from "@elastic/eui";
import { ReactNode } from "react";
import { DashboardContentLayout } from "./DashboardContentLayout";

type AnyComponentTypes = {
  children?: ReactNode | any;
  [key: string]: ReactNode | any;
};

type DashboardContentInnerProps = AnyComponentTypes & {
  justifyContent?:
    | "flexStart"
    | "center"
    | "flexEnd"
    | "spaceBetween"
    | "spaceAround"
    | "spaceEvenly";
};


export const DashboardContentInner = (props: DashboardContentInnerProps) => {
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

export const DashboardContent = (props: AnyComponentTypes) => {
  return (
    <EuiFlexGroup direction="row" justifyContent={"spaceBetween"}>
      <EuiFlexItem grow={true}>
        <DashboardContentInner>
          <DashboardContentLayout />
        </DashboardContentInner>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
