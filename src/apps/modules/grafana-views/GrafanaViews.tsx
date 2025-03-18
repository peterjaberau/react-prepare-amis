import { dataEvents } from "@/machines/rootMachineUtils.ts";
import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiFlyoutResizable,
  EuiTitle,
  EuiPortal,
  EuiFlexGrid,
} from "@elastic/eui";
import { useState } from "react";
import { ThemeProvider as GrafanaThemeProvider } from "./ThemeProvide";
import {
  EuiResizableContainer,
  EuiText,
  EuiCode,
  EuiPanel,
} from "@elastic/eui";
import { CustomResizeLogic } from "./views/CustomResizeLogic";
import { useRootMachine } from "@/machines/rootMachineStore.ts";

const flyoutHeadingId = "flyout-grafana-view";
export const GrafanaViews = () => {
  const { layout: rootLayout, actor: rootActor } = useRootMachine();

  return (
    <>
      <GrafanaThemeProvider>
        <EuiFlexGroup>
          <EuiButton
            onClick={() => rootActor.send(dataEvents.flyoutRight.isVisible)}
          >
            {rootLayout.flyoutRight.extraProps.isVisible
              ? "Close flyout Right"
              : "show flyout Right"}
          </EuiButton>
          <EuiButton
            onClick={() => rootActor.send(dataEvents.flyoutBottom.isVisible)}
          >
            {rootLayout.flyoutBottom.extraProps.isVisible
              ? "Close flyout bottom"
              : "Open flyout bottom"}
          </EuiButton>
        </EuiFlexGroup>
        <EuiFlexGroup direction="row">
          <EuiFlexItem>
            <EuiResizableContainer style={{ height: "200px" }}>
              {(EuiResizablePanel, EuiResizableButton) => (
                <>
                  <EuiResizablePanel initialSize={20} color="subdued">
                    <EuiText size="s">
                      <p>
                        flyoutBottom.iVisible
                        <EuiCode>
                          {JSON.stringify(
                            rootLayout.flyoutBottom.extraProps.isVisible,
                          )}
                        </EuiCode>
                      </p>

                      <p>
                        flyoutRight.iVisible
                        <EuiCode>
                          {JSON.stringify(
                            rootLayout.flyoutRight.extraProps.isVisible,
                          )}
                        </EuiCode>
                      </p>
                    </EuiText>
                  </EuiResizablePanel>

                  <EuiResizableButton />

                  <EuiResizablePanel
                    initialSize={40}
                    color="plain"
                    hasShadow
                    borderRadius="m"
                    wrapperPadding="m"
                    minSize="20%"
                    tabIndex={0}
                  >
                    <EuiText size="s">
                      <p>
                        This <strong>EuiResizablePanel</strong> resets most of
                        the <strong>EuiPanel</strong> props back to default with{" "}
                        <EuiCode>
                          {'color="plain" hasShadow borderRadius="m"'}
                        </EuiCode>
                        .
                      </p>
                      <p>
                        It also adds padding to the wrapping div with{" "}
                        <EuiCode>{'wrapperPadding="m"'}</EuiCode> to maintain
                        the scroll <strong>inside</strong> the panel.
                      </p>
                    </EuiText>
                  </EuiResizablePanel>

                  <EuiResizableButton />

                  <EuiResizablePanel
                    initialSize={40}
                    minSize={"20%"}
                    color="subdued"
                    scrollable={false}
                  >
                    <EuiPanel>
                      <EuiText size="s">
                        <p>
                          This <strong>EuiResizablePanel</strong> also changes
                          the background color but adds an internal{" "}
                          <strong>EuiPanel</strong> that will not stretch and
                          will scroll within the{" "}
                          <strong>EuiResizablePanel</strong>.
                        </p>
                      </EuiText>
                    </EuiPanel>
                  </EuiResizablePanel>
                </>
              )}
            </EuiResizableContainer>
          </EuiFlexItem>
        </EuiFlexGroup>

        {rootLayout.flyoutRight.extraProps.isVisible && (
          <EuiPortal>
            <EuiFlyoutResizable
              draggable={true}
              type={"overlay"}
              ownFocus={false}
              minWidth={250}
              maxWidth={1200}
              onClose={() => rootActor.send(dataEvents.flyoutRight.onClose)}
            >
              <EuiFlyoutHeader hasBorder aria-labelledby={flyoutHeadingId}>
                <EuiTitle>
                  <h2 id={flyoutHeadingId}>Flyout title</h2>
                </EuiTitle>
              </EuiFlyoutHeader>
              <EuiFlyoutBody>flayout body</EuiFlyoutBody>
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
