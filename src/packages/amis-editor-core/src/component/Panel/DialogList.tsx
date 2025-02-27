import {ClassNamesFn} from '@/packages/amis-core/src';
import {observer} from 'mobx-react';
import React from 'react';
import {EditorStoreType} from '../../store/editor';
import {
  JSONGetById,
  modalsToDefinitions,
  reGenerateID,
  translateSchema
} from '../../util';
import {Button, Icon, ListMenu, PopOverContainer, confirm} from '@/packages/src';
import {EditorManager} from '../../manager';
import cloneDeep from 'lodash/cloneDeep';

export interface DialogListProps {
  classnames: ClassNamesFn;
  store: EditorStoreType;
  manager: EditorManager;
}

export default observer(function DialogList({
  classnames: cx,
  store,
  manager
}: DialogListProps) {
  const modals = store.modals.filter(item => !item.disabled);

  const handleAddDialog = React.useCallback(() => {
    const modal = {
      type: 'dialog',
      title: 'Unnamed pop-up window',
      definitions: modalsToDefinitions(store.modals),
      body: [
        {
          type: 'tpl',
          tpl: 'Popup content'
        }
      ]
    };

    manager.openSubEditor({
      title: 'Edit pop-up window',
      value: modal,
      onChange: ({definitions, ...modal}: any, diff: any) => {
        store.addModal(modal, definitions);
      }
    });
  }, []);

  const handleEditDialog = React.useCallback((event: React.UIEvent<any>) => {
    const index = parseInt(event.currentTarget.getAttribute('data-index')!, 10);
    const modal = store.modals[index];
    const modalId = modal.$$id!;
    manager.openSubEditor({
      title: 'Edit pop-up window',
      value: {
        type: 'dialog',
        ...(modal as any),
        definitions: modalsToDefinitions(store.modals, {}, modal)
      },
      onChange: ({definitions, ...modal}: any, diff: any) => {
        store.updateModal(modalId, modal, definitions);
      }
    });
  }, []);

  const handleDelDialog = React.useCallback(
    async (event: React.UIEvent<any>) => {
      event.stopPropagation();
      event.preventDefault();

      const index = parseInt(
        event.currentTarget
          .closest('[data-index]')!
          .getAttribute('data-index')!,
        10
      );
      const dialog = store.modals[index];
      const refsCount = store.countModalActionRefs(dialog.$$id!);

      const confirmed = await confirm(
        refsCount
          ? `The current pop-up window has been associated with ${refsCount} events. After deleting it, the configured event actions will be deleted together.`
          : '',
        `Confirm to delete the pop-up window "${
          dialog.editorSetting?.displayName || dialog.title
        }"? `
      );

      if (confirmed) {
        store.removeModal(dialog.$$id!);
      }
    },
    []
  );

  const handleCopyDialog = React.useCallback((event: React.UIEvent<any>) => {
    event.stopPropagation();
    event.preventDefault();

    const index = parseInt(
      event.currentTarget.closest('[data-index]')!.getAttribute('data-index')!,
      10
    );
    let dialog = cloneDeep(store.modals[index]);
    dialog = reGenerateID(dialog);

    store.addModal({
      ...dialog,
      title: `${dialog.title} - Copy`,
      editorSetting: {
        ...dialog.editorSetting,
        displayName: dialog.editorSetting?.displayName
          ? `${dialog.editorSetting?.displayName} - Copy`
          : ''
      }
    });
  }, []);

  return (
    <div className={cx('ae-DialogList-wrap', 'hoverShowScrollBar')}>
      <Button size="sm" level="enhance" block onClick={handleAddDialog}>
        Add pop-up window
      </Button>
      {modals.length ? (
        <ul className="ae-DialogList">
          {modals.map((modal, index) => (
            <li
              className="ae-DialogList-item"
              data-index={index}
              key={modal.$$id || index}
              onClick={handleEditDialog}
            >
              <span>
                {`${
                  modal.editorSetting?.displayName ||
                  modal.title ||
                  'Unnamed pop-up'
                }`}
              </span>
              <a onClick={handleCopyDialog} className="ae-DialogList-iconBtn">
                <Icon className="icon" icon="copy" />
              </a>
              <a onClick={handleDelDialog} className="ae-DialogList-iconBtn">
                <Icon className="icon" icon="trash" />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="ae-DialogList-placeholder">No pop-up window</div>
      )}
    </div>
  );
});
