import React from 'react';
import {modalsToDefinitions} from '@/packages/amis-editor-core/src';
import {registerActionPanel} from '../../actionsPanelManager';
import DialogActionPanel from '../../DialogActionPanel';
import {TooltipWrapper} from '@/packages/amis-ui/src';

const modalDescDetail: (info: any, context: any, props: any) => any = (
  info,
  {eventKey, actionIndex},
  props: any
) => {
  const {
    actionTree,
    actions: pluginActions,
    commonActions,
    allComponents,
    node,
    manager
  } = props;
  const store = manager.store;
  const modals = store.modals;
  const onEvent = node.schema?.onEvent;
  const action = onEvent?.[eventKey].actions?.[actionIndex];
  const actionBody =
    action?.[action?.actionType === 'drawer' ? 'drawer' : 'dialog'];
  let modalId = actionBody?.$$id;
  if (actionBody?.$ref) {
    modalId =
      modals.find((item: any) => item.$$ref === actionBody.$ref)?.$$id || '';
  }
  const modal = modalId
    ? manager.store.modals.find((item: any) => item.$$id === modalId)
    : '';
  if (modal) {
    const desc =
      modal.editorSetting?.displayName ||
      modal.title ||
      'Unnamed pop-up window';
    return (
      <>
        <div className="action-desc">
          Open
          <span className="desc-tag variable-left variable-right">
            <TooltipWrapper
              rootClose
              placement="top"
              tooltip={`${desc}, click to view pop-up window configuration`}
              tooltipClassName="ae-event-item-header-tip"
            >
              <a
                href="#"
                className="component-action-tag"
                onClick={(e: React.UIEvent<any>) => {
                  e.preventDefault();
                  e.stopPropagation();

                  const modalId = modal.$$id;
                  manager.openSubEditor({
                    title: 'Edit pop-up window',
                    value: {
                      type: 'dialog',
                      ...modal,
                      definitions: modalsToDefinitions(store.modals, {}, modal)
                    },
                    onChange: ({definitions, ...modal}: any, diff: any) => {
                      store.updateModal(modalId, modal, definitions);
                    }
                  });
                }}
              >
                {desc}
              </a>
            </TooltipWrapper>
          </span>
          &nbsp;
          {(modal as any).actionType === 'confirmDialog'
            ? 'Confirmation box'
            : modal.type === 'drawer'
            ? 'Drawer pop-up'
            : 'Popup'}
        </div>
      </>
    );
  } else if (Array.isArray(info.__actionModals)) {
    const modal = info.__actionModals.find((item: any) => item.isActive);
    if (modal) {
      // The pop-up window cannot be opened at this time. The schema has not been inserted yet. I don’t know $$id and cannot locate it.
      return (
        <>
          <div className="action-desc">
            Open
            <span className="variable-left">{modal.label}</span>
            &nbsp;
            {modal.tip}
          </div>
        </>
      );
    }
  }

  return null;
};

registerActionPanel('openDialog', {
  label: 'Open pop-up window',
  tag: 'Pop-up message',
  description:
    'Open the pop-up window, which supports complex interactive design',
  actions: [
    {
      actionType: 'dialog',
      descDetail: modalDescDetail
    },
    {
      actionType: 'drawer',
      descDetail: modalDescDetail
    },
    {
      actionType: 'confirmDialog',
      descDetail: modalDescDetail
    }
  ],
  schema: [
    {
      component: DialogActionPanel
    }
  ]
});
