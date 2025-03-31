import { EuiPanel } from "@elastic/eui";


export const CustomControlsRenderer = (props: any) => {
  return (
    <EuiPanel>
      custom controls
      {props.children}
    </EuiPanel>

  )
}
