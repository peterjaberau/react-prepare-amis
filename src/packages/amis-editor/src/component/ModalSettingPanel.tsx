import {
  EditorManager,
  EditorStoreType,
  SchemaFrom,
  getSchemaTpl
} from '@/packages/amis-editor-core/src';
import {observer} from 'mobx-react';
import React from 'react';

export interface ModalSettingPanelProps {
  store: EditorStoreType;
  manager: EditorManager;
  popOverContainer: any;
}

export default observer(function ({
  store,
  manager,
  popOverContainer
}: ModalSettingPanelProps) {
  const body = React.useMemo(() => {
    return [
      getSchemaTpl('collapseGroup', [
        {
          title: 'Pop-up window to enter parameters',
          body: [
            {
              type: 'json-schema-editor',
              name: 'inputParams',
              label: false,
              mini: true,
              disabledTypes: ['array'],
              evalMode: true,
              // variables: '${variables}',
              addButtonText: 'Add parameter'
            }
          ]
        }
      ])
    ];
  }, []);
  const node = store.root.firstChild;
  const value = store.getValueOf(node.id);
  const onChange = React.useCallback((value: any, diff: any) => {
    manager.panelChangeValue(value, diff, undefined, node.id);
  }, []);
  const env = React.useMemo(
    () => ({...manager.env, session: 'left-panel-form'}),
    []
  );

  return (
    <div className="ae-Outline-panel">
      <div className="panel-header">Popup parameters</div>

      <SchemaFrom
        body={body}
        value={value}
        onChange={onChange}
        submitOnChange={true}
        env={env}
        // popOverContainer={popOverContainer}
        node={node}
        manager={manager}
        justify={true}
      />
    </div>
  );
});
