import React from 'react';
import {Button} from '@/packages/amis-ui/src';
import {getSchemaTpl} from '@/packages/amis-editor-core/src';
import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {BasePlugin, RegionConfig, BaseEventContext} from '@/packages/amis-editor-core/src';
import {formItemControl} from '../../component/BaseControl';
import {generateId} from '../../util';

export class ControlPlugin extends BasePlugin {
  static id = 'ControlPlugin';
  // Associated renderer name
  rendererName = 'control';
  $schema = '/schemas/FormControlSchema.json';

  // Component name
  name = 'Form item container';
  isBaseComponent = true;
  icon = 'fa fa-object-group';
  pluginIcon = 'form-group-plugin';
  description = 'Form item container';
  docLink = '/amis/zh-CN/components/form/group';
  tags = ['container'];
  /**
   * Hidden in the component selection panel and merged with Container
   */
  disabledRendererPlugin = true;
  scaffold = {
    type: 'control',
    label: 'Form item container',
    body: [
      {
        type: 'tpl',
        wrapperComponent: '',
        id: generateId(),
        tpl: 'a'
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

  //Container configuration
  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'element collection',
      preferTag: 'Form item'
    }
  ];

  panelTitle = 'Form item container';
  panelBodyCreator = (context: BaseEventContext) => {
    return formItemControl({
      common: {
        replace: true,
        body: [
          {
            children: (
              <Button
                className="m-b"
                onClick={() => this.manager.showRendererPanel('form item')}
                level="danger"
                tooltip="Insert a new element"
                size="sm"
                block
              >
                New elements
              </Button>
            )
          },
          getSchemaTpl('labelRemark'),
          getSchemaTpl('remark'),
          getSchemaTpl('placeholder'),
          getSchemaTpl('description')
        ]
      }
    });
  };
}

registerEditorPlugin(ControlPlugin);
