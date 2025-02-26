import React from 'react';
import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {BasePlugin, getSchemaTpl} from '@/packages/amis-editor-core/src';

export class HiddenControlPlugin extends BasePlugin {
  static id = 'HiddenControlPlugin';
  // Associated renderer name
  rendererName = 'hidden';
  $schema = '/schemas/HiddenControlSchema.json';

  // Component name
  name = 'Hidden field';
  isBaseComponent = true;
  icon = 'fa fa-eye-slash';
  pluginIcon = 'hidden-plugin';
  description = 'Hidden form item';
  searchKeywords = 'Hidden field';
  docLink = '/amis/zh-CN/components/form/hidden';
  tags = ['form item'];
  scaffold = {
    type: 'hidden',
    name: 'var1'
  };
  previewSchema: any = {
    type: 'tpl',
    tpl: 'Hidden field'
  };

  panelTitle = 'Hidden Field';
  panelBody = [
    getSchemaTpl('layout:originPosition', {value: 'left-top'}),
    {
      type: 'input-text',
      name: 'value',
      label: 'Default value'
    }
  ];

  renderRenderer(props: any) {
    return this.renderPlaceholder(
      'Functional component (hidden field)',
      props.key,
      props.style
    );
  }
}

registerEditorPlugin(HiddenControlPlugin);
