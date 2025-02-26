/**
 * @file custom code
 */

import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  BasicRendererInfo,
  RendererInfoResolveEventContext,
  PluginInterface,
  RegionConfig
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import isArray from 'lodash/isArray';
import {generateId} from '../util';

export class CustomPlugin extends BasePlugin {
  static id = 'CustomRegionPlugin';
  // Associated renderer name
  rendererName = 'custom';
  $schema = '/schemas/CustomSchema.json';

  // Component name
  name = 'Custom container';
  isBaseComponent = true;
  disabledRendererPlugin = true; // To be improved, temporarily hidden

  description = 'Implement container components through custom code';
  docLink = '/amis/zh-CN/components/custom';
  tags = ['function', 'container'];
  icon = 'fa fa-gears';
  scaffold = {
    type: 'custom',
    html: '<div>\n<h2>hello, world!</h2>\n<div id="customBox">Custom container area</div>\n</div>',
    onMount: `this.renderChild('body', props.body, document.getElementById('customBox'));`,
    body: [
      {
        type: 'tpl',
        wrapperComponent: '',
        tpl: 'Custom container area',
        id: generateId()
      }
    ]
  };

  previewSchema = {
    ...this.scaffold
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'Content area'
    }
  ];

  panelTitle = 'Custom code';
  panelBody = [
    getSchemaTpl('layout:originPosition', {value: 'left-top'}),
    getSchemaTpl('fieldSet', {
      title: 'HTML content',
      body: [
        {
          label: 'HTML content',
          name: 'html',
          type: 'editor',
          allowFullscreen: true
        }
      ]
    }),
    getSchemaTpl('fieldSet', {
      title: 'onMount',
      body: [
        {
          name: 'onMount',
          type: 'editor',
          allowFullscreen: true,
          size: 'xxl',
          label: 'onMount code',
          options: {
            lineNumbers: 'off',
            glyphMargin: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0
          }
        }
      ]
    }),
    getSchemaTpl('fieldSet', {
      title: 'onUpdate',
      body: [
        {
          name: 'onUpdate',
          type: 'editor',
          allowFullscreen: true,
          size: 'xxl',
          label: 'onUpdate code'
        }
      ]
    }),
    getSchemaTpl('fieldSet', {
      title: 'onUnmount',
      body: [
        {
          name: 'onUnmount',
          type: 'editor',
          allowFullscreen: true,
          size: 'xxl',
          label: 'onUnmount code'
        }
      ]
    })
  ];

  /**
   * Note: The container mode is started based on whether there is a body element in the schema of the current custom component, which is used to implement custom container types for custom components.
   */
  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const plugin: PluginInterface = this;
    const {renderer, schema} = context;
    if (
      schema.$$id &&
      plugin.name &&
      plugin.rendererName &&
      plugin.rendererName === renderer.name
    ) {
      let regions = plugin.regions;
      if (!regions && schema && schema.body && isArray(schema.body)) {
        regions = [
          {
            key: 'body',
            label: 'Custom container area'
          }
        ];
      }

      return {
        name: plugin.name,
        regions: regions,
        patchContainers: plugin.patchContainers,
        // wrapper: plugin.wrapper,
        vRendererConfig: plugin.vRendererConfig,
        wrapperProps: plugin.wrapperProps,
        wrapperResolve: plugin.wrapperResolve,
        filterProps: plugin.filterProps,
        $schema: plugin.$schema,
        renderRenderer: plugin.renderRenderer,
        multifactor: plugin.multifactor,
        scaffoldForm: plugin.scaffoldForm,
        disabledRendererPlugin: plugin.disabledRendererPlugin,
        isBaseComponent: plugin.isBaseComponent,
        rendererName: plugin.rendererName,
        memberImmutable: plugin.memberImmutable
      };
    }
  }
}

registerEditorPlugin(CustomPlugin);
