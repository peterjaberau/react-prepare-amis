import {Button} from 'amis-ui';
import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicPanelItem,
  BasicToolbarItem,
  BuildPanelEventContext
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {diff} from 'amis-editor-core';
import type {SchemaCollection} from 'amis';

export class ActionPlugin extends BasePlugin {
  static id = 'ActionPlugin';
  panelTitle = 'Button';
  rendererName = 'action';
  name = 'Action Button';
  $schema = '/schemas/ActionSchema.json';

  panelBodyCreator = (context: BaseEventContext) => {
    const isInDialog = /(?:\/|^)dialog\/.+$/.test(context.path);
    const isInDropdown = /(?:\/|^)dropdown-button\/.+$/.test(context.path);

    let schema = [
      {
        label: 'Button behavior',
        type: 'select',
        name: 'actionType',
        pipeIn: defaultValue(''),
        options: [
          {
            label: 'Default',
            value: ''
          },
          {
            label: 'Ball box',
            value: 'dialog'
          },

          {
            label: 'Drawer',
            value: 'drawer'
          },

          {
            label: 'Send request',
            value: 'ajax'
          },

          {
            label: 'Download file',
            value: 'download'
          },

          {
            label: 'Page jump (single page mode)',
            value: 'link'
          },

          {
            label: 'Page jump',
            value: 'url'
          },

          {
            label: 'Refresh target',
            value: 'reload'
          },

          {
            label: 'Copy content',
            value: 'copy'
          },

          {
            label: 'Submit',
            value: 'submit'
          },

          {
            label: 'Reset',
            value: 'reset'
          },

          {
            label: 'Reset form and submit',
            value: 'reset-and-submit'
          },

          {
            label: 'Clear the form and submit',
            value: 'clear-and-submit'
          },

          {
            label: 'Confirm',
            value: 'confirm'
          },

          {
            label: 'Cancel',
            value: 'cancel'
          },

          {
            label: 'jump to next',
            value: 'next'
          },

          {
            label: 'jump to previous item',
            value: 'prev'
          }
        ]
      },

      {
        type: 'input-text',
        name: 'content',
        visibleOn: 'this.actionType == "copy"',
        label: 'Copy content template'
      },

      {
        type: 'select',
        name: 'copyFormat',
        options: [
          {
            label: 'Plain text',
            value: 'text/plain'
          },
          {
            label: 'Rich text',
            value: 'text/html'
          }
        ],
        visibleOn: 'this.actionType == "copy"',
        label: 'Copy format'
      },

      {
        type: 'input-text',
        name: 'target',
        visibleOn: 'this.actionType == "reload"',
        label: 'Specify refresh target',
        required: true
      },

      {
        name: 'dialog',
        pipeIn: defaultValue({
          title: 'Ball box title',
          body: 'Yes, you just clicked',
          showCloseButton: true,
          showErrorMsg: true,
          showLoading: true
        }),
        asFormItem: true,
        visibleOn: '${actionType == "dialog"}',
        children: ({value, onChange, data}: any) => (
          <Button
            size="sm"
            level="danger"
            className="m-b"
            onClick={() =>
              this.manager.openSubEditor({
                title: 'Configure the content of the pop-up box',
                value: {type: 'dialog', ...value},
                onChange: value => onChange(value)
              })
            }
            block
          >
            Configure the content of the pop-up window
          </Button>
        )
      },

      {
        name: 'drawer',
        pipeIn: defaultValue({
          title: 'Ball box title',
          body: 'Yes, you just clicked'
        }),
        asFormItem: true,
        visibleOn: '${actionType == "drawer"}',
        children: ({value, onChange, data}: any) => (
          <Button
            size="sm"
            level="danger"
            className="m-b"
            onClick={() =>
              this.manager.openSubEditor({
                title: 'Configure the content of the pop-up box',
                value: {type: 'drawer', ...value},
                onChange: value => onChange(value)
              })
            }
            block
          >
            Configure the pop-up content
          </Button>
        )
      },

      getSchemaTpl('apiControl', {
        label: 'Target API',
        visibleOn: 'this.actionType == "ajax" || this.actionType == "download"'
      }),

      {
        name: 'feedback',
        pipeIn: defaultValue({
          title: 'Ball box title',
          body: 'content'
        }),
        asFormItem: true,
        visibleOn: '${actionType == "ajax"}',
        children: ({onChange, value, data}: any) => (
          <div className="m-b">
            <Button
              size="sm"
              level={value ? 'danger' : 'info'}
              onClick={() =>
                this.manager.openSubEditor({
                  title: 'Configure feedback pop-up details',
                  value: {type: 'dialog', ...value},
                  onChange: value => onChange(value)
                })
              }
            >
              Configure the feedback pop-up content
            </Button>

            {value ? (
              <Button
                size="sm"
                level="link"
                className="m-l"
                onClick={() => onChange('')}
              >
                Clear settings
              </Button>
            ) : null}
          </div>
        )
      },

      {
        name: 'feedback.visibleOn',
        label: 'Whether to pop up expression',
        type: 'input-text',
        visibleOn: 'this.feedback',
        autoComplete: false,
        description: 'Please use JS expressions such as: `this.xxx == 1`'
      },

      {
        name: 'feedback.skipRestOnCancel',
        label:
          'Does canceling the pop-up window interrupt subsequent operations?',
        type: 'switch',
        mode: 'inline',
        className: 'block',
        visibleOn: 'this.feedback'
      },

      {
        name: 'feedback.skipRestOnConfirm',
        label: 'Popup box confirms whether to interrupt subsequent operations',
        type: 'switch',
        mode: 'inline',
        className: 'block',
        visibleOn: 'this.feedback'
      },

      {
        type: 'input-text',
        label: 'Destination address',
        name: 'link',
        visibleOn: 'this.actionType == "link"'
      },

      {
        type: 'input-text',
        label: 'Destination address',
        name: 'url',
        visibleOn: 'this.actionType == "url"',
        placeholder: 'http://'
      },

      {
        type: 'switch',
        name: 'blank',
        visibleOn: 'this.actionType == "url"',
        mode: 'inline',
        className: 'w-full',
        label: 'Open in a new window',
        value: true
      },

      isInDialog
        ? {
            visibleOn: 'this.actionType == "submit" || this.type == "submit"',
            name: 'close',
            type: 'switch',
            mode: 'inline',
            className: 'w-full',
            pipeIn: defaultValue(true),
            label: 'Whether to close the current pop-up window'
          }
        : null,

      {
        name: 'confirmText',
        type: 'textarea',
        label: 'Confirm the copy',
        description:
          'This content will pop up after clicking, and the corresponding operation will be performed after the user confirms.'
      },

      {
        type: 'input-text',
        name: 'reload',
        label: 'Refresh target component',
        visibleOn: 'this.actionType != "link" && this.actionType != "url"',
        description:
          'After the current action is completed, the specified target component is refreshed. Supports passing data such as: <code>xxx?a=\\${a}&b=\\${b}</code>, multiple targets should be separated by English commas.'
      },

      {
        type: 'input-text',
        name: 'target',
        visibleOn: 'this.actionType != "reload"',
        label: 'Specify response component',
        description:
          'Specify the action executor, which defaults to the functional component where the current component is located. If specified, it will be transferred to the target component for processing.'
      },

      {
        type: 'js-editor',
        allowFullscreen: true,
        name: 'onClick',
        label: 'Custom click event',
        description: 'Will pass two parameters event and props'
      },

      {
        type: 'input-text',
        name: 'hotKey',
        label: 'Keyboard shortcuts'
      }
    ];

    return [
      {
        type: 'container',
        className: 'p-3',
        body: schema
      }
    ] as SchemaCollection;
  };

  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    // No processing when multiple selections are made
    if (context.selections.length) {
      return;
    }
    if (context.info!.renderer.name === 'action') {
      let body: any = this.panelBodyCreator(context);

      panels.push({
        key: 'action',
        icon: 'fa fa-gavel',
        title: 'Action',
        render: this.manager.makeSchemaFormRender({
          body: body
        }),
        order: 100
      });
    } else {
      super.buildEditorPanel(context, panels);
    }
  }

  buildEditorToolbar(
    {id, schema, info}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (
      ~['action', 'button', 'submit', 'reset'].indexOf(info!.renderer.name!) &&
      schema.actionType === 'dialog'
    ) {
      toolbars.push({
        iconSvg: 'dialog',
        tooltip: 'Configure the content of the bullet box',
        placement: 'bottom',
        onClick: () => this.editDetail(id)
      });
    }
  }

  editDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);

    node &&
      value &&
      this.manager.openSubEditor({
        title: 'Configure the content of the pop-up box',
        value: {type: 'dialog', ...value.dialog},
        onChange: newValue => {
          newValue = {...value, dialog: newValue};
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }
}

registerEditorPlugin(ActionPlugin);
