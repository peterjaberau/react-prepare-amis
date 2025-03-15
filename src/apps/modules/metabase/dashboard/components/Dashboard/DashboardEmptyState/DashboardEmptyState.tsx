import type { ReactNode } from "react";

import EmptyDashboardBot from "assets/img/dashboard-empty.svg";
import {
  EuiButton,
  EuiIcon,
  EuiText,
  EuiTitle,
} from "@elastic/eui";
import { Stack } from "@grafana-ui/index";

interface DashboardEmptyStateProps {
  addQuestion?: () => void;
  isDashboardEmpty: boolean;
  isEditing?: boolean;
  isNightMode: boolean;
}

const getDefaultTitle = (isDashboardEmpty: boolean) =>
  isDashboardEmpty ? `This dashboard is empty` : `There's nothing here, yet`;

function InlineIcon({ type }: { type: string }) {
  return <EuiIcon type={type} />;
}

function EmptyStateWrapper({
  isNightMode,
  children,
}: {
  isNightMode: boolean;
  children: ReactNode;
}) {
  return (
    <Stack
      alignItems="center"
      color={isNightMode ? "text-white" : "inherit"}
      data-testid="dashboard-empty-state"
      height="100%"
      justifyContent="center"
      gap={4}
      minHeight="20rem"
    >
      <img src={EmptyDashboardBot} alt={`Empty dashboard illustration`} />
      {children}
    </Stack>
  );
}

export function DashboardEmptyState({
  addQuestion,
  isDashboardEmpty,
  isEditing,
  isNightMode,
}: DashboardEmptyStateProps) {
  const defaultTitle = getDefaultTitle(isDashboardEmpty);
  return (
    <EmptyStateWrapper isNightMode={isNightMode}>
      <>
        <Stack alignItems="center" maxWidth="25rem" gap={2}>
          <EuiTitle size={"m"}>
            <h3>
              {isEditing
                ? `Create a new question or browse your collections for an existing one.`
                : defaultTitle}
            </h3>
          </EuiTitle>

          <EuiText textAlign="center" data-testid="dashboard-empty-state-copy">
            {isEditing ? (
              <>
                Add link or text cards. You can arrange cards manually, or start
                with some default layouts by adding{" "}
                <InlineIcon key="section-icon" type="section" />{" "}
                <b key="section">a section</b>.
              </>
            ) : (
              <>
                Click on the <InlineIcon key="pencil-icon" type="pencil" />{" "}
                <b key="edit">Edit</b> button to add questions, filters, links,
                or text.
              </>
            )}
          </EuiText>
        </Stack>
        <EuiButton
          size="s"
          className={"flex shrink-0"}
          onClick={addQuestion}
          fill={true}
        >
          Add a chart
        </EuiButton>
      </>
    </EmptyStateWrapper>
  );
}

export function DashboardEmptyStateWithoutAddPrompt({
  isDashboardEmpty,
  isNightMode,
}: DashboardEmptyStateProps) {
  const title = getDefaultTitle(isDashboardEmpty);
  return (
    <EmptyStateWrapper isNightMode={isNightMode}>
      <EuiTitle size={"m"}>
        <h3>{title}</h3>
      </EuiTitle>
    </EmptyStateWrapper>
  );
}
