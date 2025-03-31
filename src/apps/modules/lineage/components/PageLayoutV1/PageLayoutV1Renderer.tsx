import { EuiSplitPanel, EuiText } from "@elastic/eui";


export const PageLayoutV1Renderer = (props: any) => {
  return (
    <EuiSplitPanel.Outer>
      <EuiSplitPanel.Inner grow={false} color="subdued">
        <EuiText><h4>PageLayoutV1</h4></EuiText>
      </EuiSplitPanel.Inner>
      <EuiSplitPanel.Inner grow={true}>
        {props.children}
      </EuiSplitPanel.Inner>

    </EuiSplitPanel.Outer>

  )
}
