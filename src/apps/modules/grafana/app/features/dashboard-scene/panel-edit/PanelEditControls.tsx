import { InlineSwitch } from '@grafana-ui/index';

import { PanelEditor } from './PanelEditor';

export interface Props {
  panelEditor: PanelEditor;
}

export function PanelEditControls({ panelEditor }: Props) {
  const { tableView, dataPane } = panelEditor.useState();

  return (
    <>
      {dataPane && (
        <InlineSwitch
          label="Table view"
          showLabel={true}
          id="table-view"
          value={tableView ? true : false}
          onClick={panelEditor.onToggleTableView}
          aria-label="toggle-table-view"
          data-testid={selectors.components.PanelEditor.toggleTableView}
        />
      )}
    </>
  );
}
