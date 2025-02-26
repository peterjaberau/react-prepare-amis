import {RendererPluginAction, registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import React from 'react';
import {buildLinkActionDesc} from '../renderer/event-control';

export class QRCodePlugin extends BasePlugin {
  static id = 'QRCodePlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'qrcode';
  $schema = '/schemas/QRCodeSchema.json';

  // Component name
  name = 'QR code';
  isBaseComponent = true;
  description = 'Can be used to generate QR codes';
  docLink = '/amis/zh-CN/components/qrcode';
  tags = ['function'];
  icon = 'fa fa-qrcode';
  pluginIcon = 'qrcode-plugin';
  scaffold = {
    type: 'qrcode',
    value: 'https://amis.baidu.com'
  };
  previewSchema = {
    ...this.scaffold
  };

  actions: RendererPluginAction[] = [
    {
      actionType: 'saveAs',
      actionLabel: 'Download',
      description: 'Trigger QR code download',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            Download QR code
            {buildLinkActionDesc(props.manager, info)}
          </div>
        );
      }
    }
  ];

  panelTitle = 'QR code';
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: 'General',
        body: [
          getSchemaTpl('layout:originPosition', {value: 'left-top'}),
          {
            name: 'value',
            type: 'input-text',
            label: 'QR code value',
            pipeIn: defaultValue('https://www.baidu.com'),
            description: 'Supports using <code>\\${xxx}</code> to get variables'
          },
          {
            name: 'level',
            type: 'select',
            label: 'Complexity',
            pipeIn: defaultValue('L'),
            options: [
              {
                label: 'L',
                value: 'L'
              },
              {
                label: 'M',
                value: 'M'
              },
              {
                label: 'Q',
                value: 'Q'
              },
              {
                label: 'H',
                value: 'H'
              }
            ]
          }
        ]
      },
      {
        title: 'Appearance',
        body: [
          {
            name: 'codeSize',
            type: 'input-number',
            label: 'width and height',
            pipeIn: defaultValue(128)
          },
          {
            name: 'backgroundColor',
            type: 'input-color',
            label: 'background color',
            pipeIn: defaultValue('#fff')
          },
          {
            name: 'foregroundColor',
            type: 'input-color',
            label: 'foreground color',
            pipeIn: defaultValue('#000')
          },
          getSchemaTpl('className')
        ]
      },
      {
        title: 'Visible and Invisible',
        body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
      }
    ])
  ];
}

registerEditorPlugin(QRCodePlugin);
