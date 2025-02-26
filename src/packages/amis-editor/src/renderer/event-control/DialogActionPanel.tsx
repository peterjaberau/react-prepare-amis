import {
  EditorManager,
  JSONGetById,
  JSONGetParentById,
  JSONGetPathById,
  JSONPipeIn,
  JSONPipeOut,
  JSONUpdate,
  addModal,
  diff,
  getVariables,
  modalsToDefinitions,
  patchDiff
} from '@/packages/amis-editor-core/src';
import React from 'react';
import {observer} from 'mobx-react';
import {JSONTraverse, JSONValueMap, RendererProps, guid} from '@/packages/amis-core/src';
import {
  Button,
  FormField,
  InputBox,
  InputJSONSchema,
  Select,
  Switch
} from '@/packages/amis-ui/src';
// @ts-ignore
import type {EditorModalBody} from '@/packages/amis-editor-core/src/lib/store/editor';

export interface DialogActionPanelProps extends RendererProps {
  manager: EditorManager;
  subscribeSchemaSubmit: (
    fn: (schema: any, value: any, id: string, diff?: any) => any,
    once?: boolean
  ) => () => void;
  subscribeActionSubmit: (fn: (value: any) => any) => () => void;
  addHook: (fn: Function, type?: 'validate' | 'init' | 'flush') => () => void;
}

export interface LocalModal {
  label: string;
  value: any;
  tip: string;
  modal: EditorModalBody;
  isNew?: boolean;
  isModified?: boolean;
  isActive?: boolean;

  // Is it referenced?
  isRefered?: boolean;
  // Is it a pop-up window embedded in the current action?
  isCurrentActionModal?: boolean;

  /**
   * Parameter configuration
   */
  data?: any;
}

function DialogActionPanel({
  classnames: cx,
  render,
  data,
  manager,
  onChange,
  onBulkChange,
  node,
  addHook,
  subscribeSchemaSubmit,
  appLocale,
  appCorpusData
}: DialogActionPanelProps) {
  const eventKey = data.eventKey;

  if (!eventKey) {
    return <div>Context data error</div>;
  }
  const actionIndex = data.actionIndex;

  const store = manager.store;
  const [modals, setModals] = React.useState<Array<LocalModal>>([]);
  const currentModal = modals.find(item => item.isActive);

  // Subscribe to schema change events triggered by the panel
  // Execute before writing to the store, you can modify the schema
  React.useEffect(() => {
    subscribeSchemaSubmit((schema: any, nodeSchema: any, id: string) => {
      const rawActions = JSONGetById(schema, id)?.onEvent[eventKey]?.actions;
      if (!rawActions || !Array.isArray(rawActions)) {
        return;
      }

      const actionSchema =
        rawActions[
          typeof actionIndex === 'undefined'
            ? rawActions.length - 1
            : actionIndex
        ];
      const modals: Array<LocalModal> = actionSchema?.__actionModals;
      if (!Array.isArray(modals)) {
        // Not triggered by editing confirmation, return directly
        return schema;
      }

      const currentModal = modals.find(item => item.isActive)!;

      schema = {...schema, definitions: {...schema.definitions}};
      // Other pop-ups may have been edited, and if the selected pop-up window is shared
      // Will be marked as isModified
      modals
        .filter(
          item => item.isModified && item !== currentModal && item.modal.$$ref
        )
        .forEach(({modal, isRefered}) => {
          const {$$originId: originId, ...def} = modal as any;
          if (originId) {
            const parent = JSONGetParentById(schema, originId);
            if (id === originId) {
              return;
            } else if (!parent) {
              // If not found, throw it back and let the upper layer handle it
              def.$$originId = originId;
            } else if (isRefered === false) {
              const modalType = def.type === 'drawer' ? 'drawer' : 'dialog';

              // This is done to avoid modifying the original $$id
              const origin = parent[modalType] || {};
              const changes = diff(
                origin,
                modal,
                (path, key) => key === '$$id'
              );
              if (changes) {
                const newModal = patchDiff(origin, changes);
                delete newModal.$$originId;
                delete newModal.$$ref;
                schema = JSONUpdate(
                  schema,
                  parent.$$id,
                  {
                    ...parent,
                    __actionModals: undefined,
                    args: undefined,
                    dialog: undefined,
                    drawer: undefined,
                    actionType: def.actionType ?? modalType,
                    [modalType]: newModal
                  },
                  true
                );
              }

              // Don't write the following definitions
              return;
            } else {
              const modalType = def.type === 'drawer' ? 'drawer' : 'dialog';
              schema = JSONUpdate(
                schema,
                parent.$$id,
                {
                  ...parent,
                  __actionModals: undefined,
                  args: undefined,
                  dialog: undefined,
                  drawer: undefined,
                  actionType: def.actionType ?? modalType,
                  [modalType]: JSONPipeIn({
                    $ref: modal.$$ref!
                  })
                },
                true
              );
            }
          }
          schema.definitions[modal.$$ref!] = JSONPipeIn(def);
        });

      // Process the currently selected pop-up window
      let newActionSchema: any = null;
      const modalType =
        currentModal.modal.type === 'drawer' ? 'drawer' : 'dialog';
      let originActionId = null;
      let newRefName = '';

      if (currentModal.isCurrentActionModal) {
        // The selected window is the pop-up window embedded in the current action
        // Simply update the current action
        newActionSchema = {
          ...actionSchema,
          __actionModals: undefined,
          args: undefined,
          dialog: undefined,
          drawer: undefined,
          actionType: currentModal.modal.actionType ?? modalType,
          data: currentModal.data,
          [modalType]: {
            ...currentModal.modal,
            data: undefined
          }
        };
      } else if (currentModal.modal.$$ref) {
        // The selected pop-up window is the reference
        newActionSchema = {
          ...actionSchema,
          __actionModals: undefined,
          args: undefined,
          dialog: undefined,
          drawer: undefined,
          actionType: currentModal.modal.actionType ?? modalType,
          data: currentModal.data,
          [modalType]: {
            $ref: currentModal.modal.$$ref
          }
        };

        const originInd = (currentModal.modal as any).$$originId;
        // Maybe the pop-up content has been updated

        schema.definitions[currentModal.modal.$$ref] = JSONPipeIn({
          ...currentModal.modal,
          $$originId: undefined,
          $$ref: undefined
        });

        if (originInd) {
          const parent = JSONGetParentById(schema, originInd);
          if (parent && parent.actionType) {
            originActionId = parent.$$id;
            newRefName = currentModal.modal.$$ref;
          } else {
            // If it is not found, it is probably a pop-up window in the main page
            // We still have to pass the originId to the upper layer for processing
            schema.definitions[currentModal.modal.$$ref].$$originId = originInd;
            newActionSchema[modalType].$$originId = originInd;
          }
        }
      } else {
        // The selected pop-up window is embedded in another task
        // Need to convert the target pop-up window into a definition
        // Then reference this definition
        let refKey: string = '';
        [schema, refKey] = addModal(schema, currentModal.modal);
        // Need to record the original pop-up window ID to facilitate upper-level processing and merging
        schema.definitions[refKey].$$originId = currentModal.modal.$$id;
        newActionSchema = {
          ...actionSchema,
          __actionModals: undefined,
          args: undefined,
          dialog: undefined,
          drawer: undefined,
          actionType: currentModal.modal.actionType ?? modalType,
          data: currentModal.data,
          [modalType]: JSONPipeIn({
            $ref: refKey
          })
        };

        originActionId = currentModal.value;
        newRefName = refKey;
      }

      schema = JSONUpdate(
        schema,
        actionSchema.$$id,
        JSONPipeIn(newActionSchema),
        true
      );

      // It is a pop-up window, and may have a reference to itself in the definition
      if (['dialog', 'drawer', 'confirmDialog'].includes(schema.type)) {
        const id = schema.$$originId || schema.$$id;
        Object.keys(schema.definitions).forEach(key => {
          const definition = schema.definitions[key];
          const exits = JSONGetById(definition, id);
          if (exits) {
            schema.definitions[key] = JSONUpdate(
              schema.definitions[key],
              id,
              {
                ...schema,
                definitions: undefined
              },
              true
            );
          }
        });
      }

      // If there is another pop-up window pointing to itself, then update it as well
      const currentModalId = currentModal.modal.$$id;
      let refIds: string[] = [];
      JSONTraverse(currentModal.modal, (value: any, key: string, host: any) => {
        if (key === '$ref' && host.$$originId === currentModalId) {
          refIds.push(host.$$id);
        }
      });
      if (refIds.length) {
        let refKey = '';
        [schema, refKey] = addModal(schema, currentModal.modal);
        schema = JSONUpdate(schema, actionSchema.$$id, {
          [modalType]: JSONPipeIn({
            $ref: refKey
          })
        });
        refIds.forEach(refId => {
          schema = JSONUpdate(schema, refId, {
            $ref: refKey,
            $$originId: undefined
          });
        });
      }

      // The original action should also be updated
      if (originActionId && newRefName) {
        schema = JSONUpdate(
          schema,
          currentModal.value,
          JSONPipeIn({
            $ref: newRefName
          }),
          true
        );
      }
      return schema;
    }, true);
  }, []);

  const [errors, setErrors] = React.useState<{
    dialog?: string;
    data?: string;
  }>({});
  React.useEffect(() => {
    const unHook = addHook((data: any): any => {
      const modals = data.__actionModals;
      if (!modals || !Array.isArray(modals)) {
        throw new Error('Program exception');
      }

      const currentModal = modals.find((item: any) => item.isActive);
      if (!currentModal) {
        setErrors({
          ...errors,
          dialog: 'Please select a pop-up window'
        });

        return false;
      }

      const required = currentModal.modal.inputParams?.required;
      if (Array.isArray(required) && required.length) {
        if (!currentModal.data) {
          setErrors({
            ...errors,
            data: 'Parameter cannot be empty'
          });

          return false;
        } else if (required.some(key => !currentModal.data[key])) {
          setErrors({
            ...errors,
            data: 'There is a required parameter in the parameter that has not been assigned a value'
          });

          return false;
        }
      }

      // TODO Check whether the parameter assignment meets the parameter requirements of the pop-up window
    }, 'validate');
    return () => unHook();
  }, []);

  // Initialize the pop-up list
  React.useEffect(() => {
    const actionSchema =
      typeof actionIndex === 'undefined'
        ? {}
        : node.schema?.onEvent[eventKey]?.actions?.[actionIndex];
    const dialogBody =
      actionSchema[
        actionSchema.actionType === 'drawer' ? 'drawer' : 'dialog'
      ] || actionSchema.args;

    const schema = store.schema;
    const modals: Array<LocalModal | any> = store.modals.map(modal => {
      const isCurrentActionModal = modal.$$id === dialogBody?.$$id;

      return {
        label: `${
          modal.editorSetting?.displayName ||
          modal.title ||
          'Unnamed pop-up window'
        }${
          isCurrentActionModal
            ? '<Current action embedded pop-up window>'
            : modal.$$ref
            ? ''
            : '<embedded popup>'
        }`,
        tip:
          (modal as any).actionType === 'confirmDialog'
            ? 'Confirmation box'
            : modal.type === 'drawer'
            ? 'Drawer pop-up'
            : 'Popup',
        value: modal.$$id,
        capital: modal,
        isCurrentActionModal,
        data: modal.data,
        // The currently edited pop-up window is not allowed to pop up again
        disabled: modal.$$ref
          ? modal.$$ref === schema.$$ref
          : modal.$$id === schema.$$id
      };
    });

    let dialogId = dialogBody?.$$id || '';
    const ref = dialogBody?.$ref;
    if (ref) {
      dialogId = modals.find(item => item.modal.$$ref === ref)?.value || '';
    }

    // Initialization problem
    const newData: any = {
      // The purpose is to mention the current layer, not on the prototype chain
      // The values ​​to be set in the current panel must be initialized, otherwise they may be lost
      waitForAction: data.waitForAction,
      outputVar: data.outputVar
    };
    // if (!dialogId) {
    //   dialogId = guid();
    //   const placeholder = {
    // $$id: dialogId,
    //     type: 'dialog',
    // title: 'Unnamed pop-up window',
    //     body: [
    //       {
    //         type: 'tpl',
    // tpl: 'Popup content'
    //       }
    //     ]
    //   };
    //   modals.push({
    // label: 'Unnamed pop-up window <embedded pop-up window of current action>',
    // tip: 'Popup',
    //     value: dialogId,
    //     isCurrentActionModal: true,
    //     modal: placeholder
    //   });
    //   newData['dialog'] = placeholder;
    // }

    const arr = modals.map(item => ({
      ...item,
      isActive: dialogId === item.value,
      data:
        dialogId === item.value
          ? JSONPipeOut(actionSchema.data ?? item.data)
          : JSONPipeOut(item.data)
    }));
    setModals(arr);
    newData.__actionModals = arr;
    onBulkChange(newData);
  }, []);

  // Handle pop-up window switching
  const handleDialogChange = React.useCallback(
    (option: any) => {
      const arr = modals.map(item => ({
        ...item,
        isActive: item.value === option.value
      }));
      onBulkChange({
        __actionModals: arr
      });
      setModals(arr);
      setErrors({
        ...errors,
        dialog: '',
        data: ''
      });
    },
    [modals]
  );

  // After opening the bullet window, because a new pop-up window may be created in the bullet window, it will be in the definitions
  // So we need to merge
  const mergeDefinitions = React.useCallback(
    (members: Array<LocalModal>, definitions: any, modal: any) => {
      const refs: Array<string> = [];
      JSONTraverse(modal, (value, key) => {
        if (key === '$ref') {
          refs.push(value);
        }
      });

      let arr = members;
      Object.keys(definitions).forEach(key => {
        // If you want to modify, make a copy to avoid polluting the original data
        if (arr === members) {
          arr = members.concat();
        }

        const {$$originId, ...definition} = definitions[key];

        // The current pop-up window does not need to be merged
        if (
          $$originId === modal.$$id ||
          (definition.$$ref && definition.$$ref === modal.$$ref)
        ) {
          return;
        }

        const idx = arr.findIndex(item =>
          $$originId
            ? (item.modal.$$originId || item.modal.$$id) === $$originId
            : item.modal.$$ref === key
        );
        const label = `${
          definition.editorSetting?.displayName ||
          definition.title ||
          'Unnamed pop-up'
        }`;
        const tip: any =
          (definition as any).actionType === 'confirmDialog'
            ? 'Confirmation box'
            : definition.type === 'drawer'
            ? 'Drawer pop-up'
            : 'Popup';

        if (~idx) {
          arr.splice(idx, 1, {
            ...arr[idx],
            label: label,
            tip: tip,
            modal: {...definition, $$ref: key, $$originId},
            isModified: true,
            isRefered: refs.includes(key)
          });
        } else if (refs.includes(key)) {
          if ($$originId) {
            throw new Error('Definition merge exception');
          }
          arr.push({
            label,
            tip,
            value: definition.$$id,
            modal: JSONPipeIn({
              ...definition,
              $$ref: key
            }),
            isModified: true
          });
        }
      });

      return arr;
    },
    []
  );

  // Handle new pop-up window
  const handleDialogAdd = React.useCallback(
    (
      idx?: number | Array<number>,
      value?: any,
      skipForm?: boolean,
      closePopOver?: () => void
    ) => {
      const modal = {
        $$id: guid(),
        type: 'dialog',
        title: 'Unnamed pop-up window',
        body: [
          {
            type: 'tpl',
            tpl: 'Popup content'
          }
        ],
        definitions: modalsToDefinitions(modals.map(item => item.modal))
      };
      const modalId = modal.$$id;
      manager.openSubEditor({
        title: 'New pop-up window',
        value: modal,
        onChange: ({definitions, ...modal}: any, diff: any) => {
          // You cannot change $$id. If there is an internal reference, it will not be found.
          modal = JSONPipeIn({...modal, $$id: modalId});
          let arr = modals.concat();
          if (!arr.some(item => item.isNew)) {
            arr.push({
              label: `${
                modal.editorSetting?.displayName ||
                modal.title ||
                'Unnamed pop-up window'
              }`,
              tip:
                (modal as any).actionType === 'confirmDialog'
                  ? 'Confirmation box'
                  : modal.type === 'drawer'
                  ? 'Drawer pop-up'
                  : 'Popup',
              isNew: true,
              isCurrentActionModal: true,
              value: modal.$$id,
              modal: modal
            });

            arr = mergeDefinitions(arr, definitions, modal);

            arr = arr.map(item => ({
              ...item,
              isActive: item.value === modal.$$id
            }));
          }
          setModals(arr);
          onBulkChange({__actionModals: arr});
        }
      });
      closePopOver?.();
    },
    [modals]
  );

  // Handle the edit popup
  const handleDialogEdit = React.useCallback(() => {
    const currentModal = modals.find(item => item.isActive);
    if (!currentModal) {
      return;
    }
    manager.openSubEditor({
      title: 'Edit pop-up window',
      value: {
        type: 'dialog',
        title: 'Popup title',
        body: [
          {
            type: 'tpl',
            tpl: 'Popup content'
          }
        ],
        ...(currentModal.modal as any),
        definitions: modalsToDefinitions(
          modals.map(item => item.modal),
          {},
          currentModal.modal
        )
      },
      onChange: ({definitions, ...modal}: any, diff: any) => {
        // Do not modify $$id when editing
        modal = JSONPipeIn({...modal, $$id: currentModal.modal.$$id});
        let arr = modals.map(item =>
          item.value === currentModal.value
            ? {
                ...item,
                modal: modal,
                isModified: true,
                label: `${
                  modal.editorSetting?.displayName ||
                  modal.title ||
                  'Unnamed pop-up'
                }${
                  item.isCurrentActionModal
                    ? '<Current action embedded pop-up window>'
                    : ''
                }`,
                tip:
                  (modal as any).actionType === 'confirmDialog'
                    ? 'Confirmation box'
                    : modal.type === 'drawer'
                    ? 'Drawer pop-up'
                    : 'Pop-up'
              }
            : item
        );
        arr = mergeDefinitions(arr, definitions, modal);
        setModals(arr);
        onBulkChange({__actionModals: arr});
      }
    });
  }, [modals]);

  const handleDataSwitchChange = React.useCallback(
    (value: any) => {
      handleDataChange(value ? {} : undefined);
    },
    [modals]
  );

  const handleDataChange = React.useCallback(
    (value: any) => {
      let arr = modals.map(modal =>
        modal.isActive
          ? {
              ...modal,
              data: value
            }
          : modal
      );
      setModals(arr);
      onBulkChange({__actionModals: arr});
      setErrors({
        ...errors,
        data: ''
      });
    },
    [modals]
  );
  const handleWaitForActionChange = React.useCallback((value: any) => {
    onBulkChange({waitForAction: !!value});
  }, []);

  const handleOutputVarChange = React.useCallback((value: string) => {
    onBulkChange({outputVar: value});
  }, []);

  const hasRequired =
    Array.isArray(currentModal?.modal.inputParams?.required) &&
    currentModal!.modal.inputParams.required.length;
  React.useEffect(() => {
    if (hasRequired && !currentModal?.data) {
      handleDataChange({});
    }
  }, [hasRequired]);

  // Render pop-up window drop-down options
  const renderMenu = React.useCallback((option: any, stats: any) => {
    return (
      <div className="flex w-full justify-between">
        <span>{option.label}</span>
        <span className="text-muted">{option.tip}</span>
      </div>
    );
  }, []);

  const formula: any = React.useMemo(() => {
    return {
      variables: () =>
        getVariables({
          props: {node, manager},
          appLocale,
          appCorpusData
        })
    };
  }, [node, manager]);

  return (
    <div className={cx('ae-DialogActionPanel')}>
      <FormField
        label="Select pop-up window"
        mode="horizontal"
        isRequired
        hasError={!!errors.dialog}
        errors={errors.dialog}
      >
        <div
          className={cx(
            'Form-control Form-control--withSize Form-control--sizeLg'
          )}
        >
          <Select
            createBtnLabel="Create a new pop-up window"
            value={currentModal?.value || ''}
            onChange={handleDialogChange}
            options={modals}
            creatable={!modals.some(item => item.isNew)}
            clearable={false}
            onAdd={handleDialogAdd}
            renderMenu={renderMenu}
          />

          {currentModal &&
          modals.some(
            modal =>
              modal.isCurrentActionModal &&
              !modal.isNew &&
              currentModal !== modal
          ) ? (
            <div className={cx('Alert Alert--warning mt-3')}>
              After switching the pop-up window, the original embedded pop-up
              window will be deleted
            </div>
          ) : null}

          {currentModal ? (
            <div className="m-t-sm">
              <Button size="sm" level="enhance" onClick={handleDialogEdit}>
                Edit selected popup
              </Button>
            </div>
          ) : null}
        </div>
      </FormField>
      {currentModal ? (
        <FormField
          label="Parameter assignment"
          mode="horizontal"
          hasError={!!errors.data}
          errors={errors.data}
          description={
            !currentModal.data
              ? 'Parameter assignment in the pop-up window will take precedence over the configuration here. If the configuration is closed or there is no configuration value, the context data will be transparently transmitted.'
              : ''
          }
        >
          <div
            className={cx(
              'Form-control Form-control--withSize Form-control--sizeLg'
            )}
          >
            <Switch
              className="mt-2 m-b-xs"
              value={!!currentModal.data}
              onChange={handleDataSwitchChange}
              disabled={hasRequired}
            />

            {currentModal.data ? (
              <InputJSONSchema
                className="m-t-sm"
                value={currentModal.data}
                onChange={handleDataChange}
                schema={JSONPipeOut(currentModal.modal.inputParams)}
                addButtonText="Add parameter"
                formula={formula}
              />
            ) : null}
          </div>
        </FormField>
      ) : null}

      <FormField
        label="Waiting for pop-up window"
        mode="horizontal"
        description={
          'The next action will be executed after the current pop-up window action is completed'
        }
      >
        <div
          className={cx(
            'Form-control Form-control--withSize Form-control--sizeLg'
          )}
        >
          <Switch
            className="mt-2 m-b-xs"
            value={!!data.waitForAction}
            onChange={handleWaitForActionChange}
          />
        </div>
      </FormField>

      {data.waitForAction ? (
        <FormField
          label="Response result"
          mode="horizontal"
          description={
            'Configuration of the output parameter variable name after the pop-up action ends'
          }
        >
          <div
            className={cx(
              'Form-control Form-control--withSize Form-control--sizeLg'
            )}
          >
            <InputBox
              onChange={handleOutputVarChange}
              value={data.outputVar || ''}
              placeholder="Please enter the variable name to store the response result"
            />
          </div>
        </FormField>
      ) : null}
    </div>
  );
}

export default observer(DialogActionPanel);
