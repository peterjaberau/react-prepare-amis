import React from 'react';
import {EditorManager} from '../manager';
import {EditorStoreType} from '../store/editor';
import {render} from 'amis';
import {createObject, RenderOptions} from '@/packages/amis-core/src';

import {observer} from 'mobx-react';
import Editor from './Editor';
import {
  BuildPanelEventContext,
  PluginEvent,
  RendererInfoResolveEventContext
} from '../plugin';
import {autobind} from '../util';
import omit from 'lodash/omit';

export interface SubEditorProps {
  store: EditorStoreType;
  manager: EditorManager;
  theme?: string;
  amisEnv?: RenderOptions;
  readonly?: boolean;
}

@observer
export class SubEditor extends React.Component<SubEditorProps> {
  @autobind
  afterResolveEditorInfo(event: PluginEvent<RendererInfoResolveEventContext>) {
    const store = this.props.store;
    const context = event.context;
    const slot = store.subEditorContext?.slot;

    if (!slot) {
      if (
        context.data &&
        !context.schemaPath &&
        store.subEditorContext?.memberImmutable
      ) {
        context.data.memberImmutable = store.subEditorContext?.memberImmutable;
      }
      return;
    }
    const slotPath = store.subEditorSlotPath;

    if (!~context.schemaPath.indexOf(slotPath) && context.data) {
      context.data.editable = false;
      context.data.memberImmutable = !Array.isArray(
        store.subEditorContext?.value
      );

      if (!context.data.memberImmutable) {
        context.data.name = 'Container';
      }
    } else if (context.schemaPath === slotPath && context.data) {
      if (!Array.isArray(store.subEditorContext?.value)) {
        context.data.movable = false;
        context.data.removable = false;
      }

      context.data.typeMutable = store.subEditorContext?.typeMutable;
    }
  }

  @autobind
  handleBuildPanels(event: PluginEvent<BuildPanelEventContext>) {
    const store = this.props.store;
    const slot = store.subEditorContext?.slot;

    if (!slot) {
      return;
    }
    // const slotPath = store.subEditorSlotPath;
    const context = event.context;

    // When the member node is fixed, the component panel is not displayed
    if (!!context.info.memberImmutable) {
      const panels = context.data.concat();
      context.data.splice(0, context.data.length);
      const renderersPanel = panels.filter(r => r.key !== 'renderers');
      renderersPanel && context.data.push(...renderersPanel);
      //Default selected outline
      context.changeLeftPanelKey = 'outline';
    }

    /*
    // Note: There are some problems with the current logic (context.schemaPath basically does not contain slotPath), comment it out first.
    if (!~context.schemaPath.indexOf(slotPath)) {
      const panels = context.data.concat();
      context.data.splice(0, context.data.length);

      // If it is outside the slot, no panel will be given.
      if (!context.info.memberImmutable) {
        const renderersPanel = panels.find(r => r.key === 'renderers');
        renderersPanel && context.data.push(renderersPanel);
      }
    }
    */
  }

  buildSchema() {
    const {store, manager, amisEnv, readonly} = this.props;
    const subEditorContext = store.subEditorContext;
    const config = manager.config;
    let superEditorData: any = store.superEditorData;
    if (!!subEditorContext) {
      superEditorData = createObject(
        store.superEditorData,
        subEditorContext?.data
      );
    }
    const variables: any = manager.config?.variables || [];

    return {
      size: 'full',
      title: store.subEditorContext?.title,
      onClose: store.closeSubEditor,
      onConfirm: store.confirmSubEditor,
      body: store.subEditorContext
        ? {
            type: 'form',
            mode: 'normal',
            wrapWithPanel: false,
            wrapperComponent: 'div',
            onValidate: async (value: any) => {
              const result = await store.subEditorContext?.validate?.(value);
              if (result) {
                return {
                  schema: result
                };
              }
              return;
            },
            onChange: store.subEditorOnChange,
            body: [
              {
                name: 'schema',
                asFormItem: true,
                children: ({
                  value,
                  onChange
                }: {
                  value: any;
                  onChange: (value: any) => void;
                }) => (
                  <Editor
                    autoFocus
                    value={value}
                    ref={store.subEditorRef}
                    onChange={onChange}
                    data={store.subEditorContext?.data}
                    hostManager={manager}
                    hostNode={store.subEditorContext?.hostNode}
                    superEditorData={superEditorData}
                    schemaFilter={manager.config.schemaFilter}
                    theme={manager.env.theme}
                    afterResolveEditorInfo={this.afterResolveEditorInfo}
                    onBuildPanels={this.handleBuildPanels}
                    isMobile={store.isMobile}
                    isSubEditor={true}
                    ctx={store.ctx}
                    schemas={manager.config?.schemas}
                    variables={variables}
                    amisEnv={amisEnv || config.amisEnv}
                    appLocale={config.appLocale}
                    i18nEnabled={config.i18nEnabled}
                    plugins={config.plugins}
                    actionOptions={config.actionOptions}
                    showCustomRenderersPanel={
                      store.showCustomRenderersPanel ?? true
                    }
                    isHiddenProps={config.isHiddenProps}
                    $schemaUrl={config.$schemaUrl}
                    onFormulaEditorOpen={async (
                      node,
                      subEditormanager,
                      data
                    ) => {
                      const fn = manager?.config?.onFormulaEditorOpen;

                      if (fn && typeof fn === 'function') {
                        return fn(node, subEditormanager, data, {
                          node: subEditorContext?.hostNode,
                          manager: manager
                        });
                      }
                      return;
                    }}
                    getHostNodeDataSchema={async () => {
                      await manager.getContextSchemas(manager.store.activeId);
                      return manager.dataSchema;
                    }}
                    getAvaiableContextFields={node =>
                      manager.getAvailableContextFields(node)
                    }
                    readonly={readonly}
                  />
                )
              },
              readonly && {
                type: 'button',
                label: 'Return to editor',
                className: 'subEditor-container-back',
                onClick: () => store.closeSubEditor()
              }
            ].filter(Boolean)
          }
        : {
            type: 'tpl',
            tpl: 'Loading...'
          },
      actions: [
        [
          {
            children: subEditorContext ? (
              <div className="ae-DialogToolbar">
                <button
                  type="button"
                  data-tooltip="Undo"
                  data-position="top"
                  disabled={!subEditorContext.canUndo}
                  onClick={store.undoSubEditor}
                >
                  <i className="fa fa-undo" />
                </button>
                <button
                  type="button"
                  data-tooltip="Redo"
                  data-position="top"
                  disabled={!subEditorContext.canRedo}
                  onClick={store.redoSubEditor}
                >
                  <i className="fa fa-rotate-right" />
                </button>
              </div>
            ) : null
          },
          {
            type: 'submit',
            label: 'Save',
            level: 'primary'
          },
          {
            type: 'button',
            label: 'Cancel',
            actionType: 'close'
          }
        ]
      ],
      closeOnEsc: false,
      bodyClassName: 'ae-dialog subEditor-dialog'
      // lazyRender: true
    };
  }

  render() {
    const {store, theme, manager, readonly} = this.props;
    if (!store.subEditorContext) {
      return null;
    }
    return render(
      {
        type: readonly ? 'container' : 'dialog',
        className: readonly ? 'subEditor-container' : 'subEditor-dialog',
        ...this.buildSchema()
      },

      {
        show: !!store.subEditorContext,
        data: {
          schema: store.subEditorValue
        }
      },
      {
        ...omit(manager.env, 'replaceText'),
        session: 'editor-dialog',
        theme: theme
      }
    );
  }
}
