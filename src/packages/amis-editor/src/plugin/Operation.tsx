import {Button} from 'amis';
import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicSubRenderInfo,
  RegionConfig,
  RendererEventContext,
  SubRendererInfo
} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import {generateId} from '../util';

export class OperationPlugin extends BasePlugin {
  static id = 'OperationPlugin';
  // Associated renderer name
  rendererName = 'operation';
  $schema = '/schemas/OperationSchema.json';

  // Component name
  name = 'Action Bar';
  isBaseComponent = true;
  description = 'Action bar, for tables.';
  tags = ['show'];
  icon = '';
  scaffold = {
    type: 'operation',
    label: 'Operation',
    buttons: [
      {
        label: 'button',
        type: 'button',
        id: generateId()
      }
    ]
  };
  previewSchema = {
    type: 'tpl',
    tpl: 'Action Bar'
  };

  regions: Array<RegionConfig> = [
    {
      key: 'buttons',
      label: 'Button Set',
      renderMethod: 'render',
      insertPosition: 'inner',
      preferTag: 'button'
    }
  ];

  panelTitle = 'Action Bar';
  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: 'Appearance',
        body: [
          getSchemaTpl('className', {
            name: 'innerClassName'
          })
        ]
      }
    ]);
  };

  buildSubRenderers(
    context: RendererEventContext,
    renderers: Array<SubRendererInfo>
  ): BasicSubRenderInfo | Array<BasicSubRenderInfo> | void {
    if (
      context &&
      context.info &&
      context.info.renderer &&
      (context.info.renderer.name === 'table' ||
        context.info.renderer.name === 'crud')
    ) {
      return super.buildSubRenderers.apply(this, arguments);
    }
  }
}

registerEditorPlugin(OperationPlugin);
