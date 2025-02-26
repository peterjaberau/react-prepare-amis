import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {FlexPluginBase} from './FlexPluginBase';

export default class Layout1_2_v4 extends FlexPluginBase {
  static id = 'Layout1_2_v4';
  static scene = ['layout'];

  name = 'Classic Layout';
  isBaseComponent = true;
  pluginIcon = 'layout-3-1-plugin';
  description =
    'Common layout: classic layout (layout container based on CSS Flex).';
  order = 307;
  scaffold: any = {
    type: 'flex',
    className: 'p-1',
    items: [
      {
        type: 'container',
        size: 'xs',
        body: [],
        wrapperBody: false,
        style: {
          flex: '0 0 auto',
          display: 'block'
        }
      },
      {
        type: 'flex',
        items: [
          {
            type: 'container',
            size: 'xs',
            body: [],
            wrapperBody: false,
            style: {
              flex: '0 0 auto',
              flexBasis: '250px',
              display: 'block'
            }
          },
          {
            type: 'flex',
            items: [
              {
                type: 'container',
                size: 'xs',
                body: [],
                wrapperBody: false,
                style: {
                  flex: '1 1 auto',
                  flexBasic: 'auto',
                  flexGrow: 1,
                  display: 'block'
                }
              },
              {
                type: 'container',
                size: 'xs',
                body: [],
                wrapperBody: false,
                style: {
                  flex: '1 1 auto',
                  flexBasic: 'auto',
                  flexGrow: 1,
                  display: 'block'
                }
              }
            ],
            style: {
              position: 'static',
              overflowX: 'auto',
              overflowY: 'auto',
              margin: '0',
              flex: '1 1 auto',
              flexGrow: 1,
              flexBasic: 'auto'
            },
            alignItems: 'stretch',
            direction: 'column',
            justify: 'center',
            isFixedHeight: false,
            isFixedWidth: false
          }
        ],
        style: {
          flex: '1 1 auto',
          overflowX: 'auto',
          margin: '0',
          maxWidth: 'auto',
          overflowY: 'auto',
          position: 'static',
          minWidth: 'auto',
          width: 'auto',
          maxHeight: 'auto',
          minHeight: '300px'
        },
        direction: 'row',
        justify: 'flex-start',
        alignItems: 'stretch',
        isFixedHeight: false,
        isFixedWidth: false
      }
    ],
    direction: 'column',
    justify: 'center',
    alignItems: 'stretch'
  };
}

registerEditorPlugin(Layout1_2_v4);
