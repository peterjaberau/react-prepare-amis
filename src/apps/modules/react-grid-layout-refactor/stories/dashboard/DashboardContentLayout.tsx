import { EuiFlexGroup, EuiFlexItem, EuiPanel } from "@elastic/eui";
import { ReactNode } from "react";
import { LayoutGrid } from "./layouts/LayoutGrid";

type AnyComponentTypes = {
  children?: ReactNode | any;
  [key: string]: ReactNode | any;
};

type DashboardContentLayoutInnerProps = AnyComponentTypes & {
  justifyContent?:
    | "flexStart"
    | "center"
    | "flexEnd"
    | "spaceBetween"
    | "spaceAround"
    | "spaceEvenly";
};


export const DashboardContentLayoutInner = (props: DashboardContentLayoutInnerProps) => {
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

export const DashboardContentLayout = (props: AnyComponentTypes) => {
  return (
    <EuiFlexGroup direction="row" justifyContent={"spaceBetween"}>
      <EuiFlexItem grow={true}>
        <DashboardContentLayoutInner>
          <LayoutGrid />
        </DashboardContentLayoutInner>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
