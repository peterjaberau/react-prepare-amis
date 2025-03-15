import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiFlyoutResizable,
  EuiTitle,
  EuiPortal,
} from "@elastic/eui";
import { useState } from "react";
import { ThemeProvider as GrafanaThemeProvider } from "./ThemeProvide";
import { css, cx } from "@emotion/css";
import { FunctionsPrep } from "./stories/FunctionsPrep";

const flyoutHeadingId = "flyout-grafana-prep";
export const GrafanaPrep = () => {
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);

  const closeFlyout = () => setIsFlyoutVisible(false);
  const toggleFlyout = () => setIsFlyoutVisible(!isFlyoutVisible);

  return (
    <>
      <GrafanaThemeProvider>
      <EuiButton onClick={toggleFlyout}>Show flyout</EuiButton>
      {isFlyoutVisible && (
        <EuiPortal>
          <EuiFlyoutResizable
            draggable={true}
            type={"overlay"}
            ownFocus={false}
            minWidth={250}
            maxWidth={1200}
            onClose={closeFlyout}
          >
            <EuiFlyoutHeader hasBorder aria-labelledby={flyoutHeadingId}>
              <EuiTitle>
                <h2 id={flyoutHeadingId}>Flyout title</h2>
              </EuiTitle>
            </EuiFlyoutHeader>
            <EuiFlyoutBody>
              <FunctionsPrep />
            </EuiFlyoutBody>
            <EuiFlyoutFooter>
              <EuiFlexGroup justifyContent="spaceBetween">
                <EuiFlexItem grow={false}>Flyout footer1</EuiFlexItem>
                <EuiFlexItem grow={false}>Flyout footer2</EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlyoutFooter>
          </EuiFlyoutResizable>
        </EuiPortal>
      )}
      </GrafanaThemeProvider>
    </>
  );
};

const FlyoutPrep = () => {};
