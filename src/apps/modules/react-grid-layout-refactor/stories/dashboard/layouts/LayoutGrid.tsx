import { EuiFlexGroup, EuiFlexItem, EuiPanel } from "@elastic/eui";
import { ReactNode } from "react";

type AnyComponentTypes = {
  children?: ReactNode | any;
  [key: string]: ReactNode | any;
};

type LayoutGridInnerProps = AnyComponentTypes & {
  justifyContent?:
    | "flexStart"
    | "center"
    | "flexEnd"
    | "spaceBetween"
    | "spaceAround"
    | "spaceEvenly";
};

export const LayoutGridInner = (props: LayoutGridInnerProps) => {
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

export const LayoutGrid = (props: AnyComponentTypes) => {
  return (
    <EuiFlexGroup direction="row" justifyContent={"spaceBetween"}>
      <EuiFlexItem grow={true}>
        <LayoutGridInner> LayoutGrid.LayoutGridInner </LayoutGridInner>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
