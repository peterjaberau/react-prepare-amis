import { EuiButton, EuiIcon } from '@elastic/eui';
import { PanelChrome } from "@grafana-ui/components/PanelChrome";
import { Button } from "@grafana-ui/components/Button";

export default function Index() {

  return <>
    <PanelChrome title="Hello World" collapsible={true}>
      <EuiButton iconType={'eye'}>Click me</EuiButton>
      <Button icon={<EuiIcon type={'eye'}/> } size="sm">btn grafana</Button>
      <Button icon='upload' size="sm">btn grafana</Button>

    </PanelChrome>
    </>;
}
