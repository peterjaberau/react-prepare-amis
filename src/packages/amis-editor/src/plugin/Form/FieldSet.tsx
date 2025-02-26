import {Button} from 'amis';
import React from 'react';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';
import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {BaseEventContext, BasePlugin, RegionConfig} from '@/packages/amis-editor-core/src';
import {generateId} from '../../util';

export class FieldSetControlPlugin extends BasePlugin {
  static id = 'FieldSetControlPlugin';
  // Associated renderer name
  rendererName = 'fieldset';
  $schema = '/schemas/FieldSetControlSchema.json';

  // Component name
  name = 'fieldset';
  isBaseComponent = true;
  icon = 'fa fa-toggle-down';
  description =
    'A combination of multiple form items, configurable whether to collapse';
  searchKeywords = 'Form item collection';
  docLink = '/amis/zh-CN/components/form/fieldset';
  tags = ['form item'];
  scaffold = {
    type: 'fieldset',
    title: 'Title',
    collapsable: true,
    body: [
      {
        type: 'input-text',
        label: 'text 1',
        id: generateId(),
        name: 'text'
      },
      {
        type: 'input-text',
        label: 'text 2',
        id: generateId(),
        name: 'text'
      }
    ]
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'Subform item',
      renderMethod: 'renderBody',
      insertPosition: 'inner',
      preferTag: 'Form item'
    }
  ];

  panelTitle = 'Field Set';
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('layout:originPosition', {value: 'left-top'}),

      getSchemaTpl('title'),

      getSchemaTpl('switch', {
        name: 'collapsable',
        label: 'Is it foldable',
        pipeIn: defaultValue(false)
      }),

      getSchemaTpl('switch', {
        name: 'collapsed',
        label: 'Whether to fold by default',
        visibleOn: 'this.collapsable'
      }),

      {
        name: 'className',
        type: 'button-group-select',
        clearable: true,
        size: 'sm',
        label: 'Control style',
        className: 'w-full',
        pipeIn: defaultValue(''),
        options: [
          {
            label: 'Default',
            value: ''
          },
          {
            value: 'Collapse--xs',
            label: 'extremely small'
          },
          {
            value: 'Collapse--sm',
            label: 'small'
          },
          {
            value: 'Collapse--base',
            label: 'Normal'
          },
          {
            value: 'Collapse--md',
            label: 'big'
          },
          {
            value: 'Collapse--lg',
            label: 'Extra large'
          }
        ]
      },

      getSchemaTpl('className', {
        name: 'headingClassName',
        label: 'Title CSS class name'
      }),
      getSchemaTpl('className', {
        name: 'bodyClassName',
        label: 'Content area CSS class name'
      }),

      {
        children: (
          <Button
            level="info"
            size="sm"
            className="m-b-sm"
            block
            onClick={() => {
              // this.manager.showInsertPanel('body', context.id);
              this.manager.showRendererPanel(
                'Form item',
                'Please click Add Subform Item from the component panel on the left'
              );
            }}
          >
            Adding a Subform Item
          </Button>
        )
      },

      getSchemaTpl('subFormItemMode'),
      getSchemaTpl('subFormHorizontalMode'),
      getSchemaTpl('subFormHorizontal')
    ];
  };

  filterProps(props: any) {
    props.collapsed = false;
    return props;
  }
}

registerEditorPlugin(FieldSetControlPlugin);
