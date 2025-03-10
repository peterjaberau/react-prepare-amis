import { EuiFlexGroup, EuiFlexItem, EuiPanel } from "@elastic/eui";
import { ReactNode } from "react";

type AnyComponentTypes = {
  children?: ReactNode | any;
  [key: string]: ReactNode | any;
};

type DashboardHeaderSectionProps = AnyComponentTypes & {
  justifyContent?:
    | "flexStart"
    | "center"
    | "flexEnd"
    | "spaceBetween"
    | "spaceAround"
    | "spaceEvenly";
};

export const DashboardHeaderSection = (props: DashboardHeaderSectionProps) => {
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

export const DashboardHeader = (props: AnyComponentTypes) => {
  return (
    <EuiFlexGroup direction="row" justifyContent={"spaceBetween"}>
      <EuiFlexItem grow={true}>
        <DashboardHeaderSection> left section </DashboardHeaderSection>
      </EuiFlexItem>
      <EuiFlexItem grow={true}>
        <DashboardHeaderSection justifyContent={"center"}>
          {" "}
          middle section{" "}
        </DashboardHeaderSection>
      </EuiFlexItem>
      <EuiFlexItem grow={true}>
        <DashboardHeaderSection justifyContent={"flexEnd"}>
          {" "}
          right section{" "}
        </DashboardHeaderSection>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
