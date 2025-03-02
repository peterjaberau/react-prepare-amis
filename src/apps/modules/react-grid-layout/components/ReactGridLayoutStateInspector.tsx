import {
  EuiButtonEmpty,
  EuiFlexGroup, EuiFlexItem,
  EuiFlyoutBody, EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiFlyoutResizable,
  EuiHeaderSectionItemButton,
  EuiIcon,
  EuiPortal, EuiTitle,
  useEuiTheme,
  EuiCodeBlock
} from "@elastic/eui";
import React, { useState } from "react";
import { useReactGridLayoutMachine } from "@/apps/modules/react-grid-layout/machines/reactGridLayoutMachineStore.ts";


const RightMenuReadGridLayoutState = () => {

  const { state, actor } = useReactGridLayoutMachine();


  const { euiTheme } = useEuiTheme()
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false)

  const gearButton = (
    <EuiHeaderSectionItemButton
      aria-expanded={isFlyoutVisible}
      onClick={() => setIsFlyoutVisible(!isFlyoutVisible)}
    >
      <EuiIcon type="eye" />
    </EuiHeaderSectionItemButton>
  )

  const flyout = (
    <EuiPortal>
      <EuiFlyoutResizable
        maxWidth={1000}
        minWidth={300}
        ownFocus={false}
        type={'overlay'}
        side={'right'}
        onClose={() => { setIsFlyoutVisible(false) }}
        size="s"
        id={'reactgridlayoutFlyoutId'}
        aria-labelledby={'reactgridlayoutFlyoutTitleId'}
      >
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id={'reactgridlayoutFlyoutTitleId'}>React Grid Layout States</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
          <div id={"inspector-iframe"} style={{ blockSize: "100%" }}>
            <EuiCodeBlock language="json" overflowHeight={"100%"} isCopyable isVirtualized>
              {JSON.stringify(state.context, null, 2)}
            </EuiCodeBlock>
          </div>

        <EuiFlyoutFooter>
        <EuiFlexGroup
            justifyContent="spaceBetween"
            alignItems="center"
          >
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty
                iconType="cross"
                onClick={() => setIsFlyoutVisible(false)}
                flush="left"
              >
                Close
              </EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutFooter>
      </EuiFlyoutResizable>
    </EuiPortal>
  )

  return (
    <>
      {gearButton}
      {isFlyoutVisible && flyout}
    </>
  )
}

export default RightMenuReadGridLayoutState;
