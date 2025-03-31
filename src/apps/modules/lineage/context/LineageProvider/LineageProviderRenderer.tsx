import { EuiSplitPanel, EuiText } from "@elastic/eui";


export const LineageProviderRenderer = (props: any) => {
  return (
    <EuiSplitPanel.Outer>
      <EuiSplitPanel.Inner grow={false} color="subdued">
        <EuiText><h4>AppContainer</h4></EuiText>
      </EuiSplitPanel.Inner>
      <EuiSplitPanel.Inner grow={true}>
        {props.children}
      </EuiSplitPanel.Inner>

    </EuiSplitPanel.Outer>

  )
}
