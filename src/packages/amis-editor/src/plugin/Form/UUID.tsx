import React from 'react';
import {registerEditorPlugin, getSchemaTpl} from '@/packages/amis-editor-core/src';
import {
  BasePlugin,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo
} from '@/packages/amis-editor-core/src';

export class UUIDControlPlugin extends BasePlugin {
  static id = 'UUIDControlPlugin';
  // Associated renderer name
  rendererName = 'uuid';
  $schema = '/schemas/UUIDControlSchema.json';

  // Component name
  name = 'UUID';
  isBaseComponent = true;
  icon = 'fa fa-eye-slash';
  pluginIcon = 'uuid-plugin';
  description = 'Automatically generated UUID';
  searchKeywords = 'uuid field';
  docLink = '/amis/zh-CN/components/form/uuid';
  tags = ['form item'];
  scaffold = {
    type: 'uuid',
    name: 'uuid'
  };
  previewSchema: any = {
    type: 'form',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  panelTitle = 'UUID';
  panelBody = [
    getSchemaTpl('layout:originPosition', {value: 'left-top'}),
    {
      type: 'static',
      value:
        'Automatically generated in UUID v4 format, no configuration required'
    }
  ];

  renderRenderer(props: any) {
    return this.renderPlaceholder(
      'UUID (display will be hidden)',
      props.key,
      props.style
    );
  }
}

registerEditorPlugin(UUIDControlPlugin);
