/**
 * @file Flex layout
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './Layout/FlexPluginBase';

export class FlexPlugin extends FlexPluginBase {
  static id = 'FlexPlugin';
  static scene = ['layout'];
  name = 'Flex Layout';
  pluginIcon = 'flex-container-plugin';
  description =
    'Layout containers are mainly used to design container components for complex layouts. The layout effect achieved based on CSS Flex is more controllable than Grid and HBox in terms of the position of child nodes, and is simpler and easier to use than using CSS classes';
}

registerEditorPlugin(FlexPlugin);
