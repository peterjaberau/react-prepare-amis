import {registerEditorPlugin} from '../manager';
import {
  BasePlugin,
  BasicRendererInfo,
  PluginInterface,
  RendererInfoResolveEventContext
} from '../plugin';

export class UnknownRendererPlugin extends BasePlugin {
  static scene = ['layout'];
  order = 9999;

  getRendererInfo({
    renderer,
    schema,
    path
  }: RendererInfoResolveEventContext): BasicRendererInfo | void {
    if (schema.$$id && renderer) {
      // Some people just don't want to be editors
      if (/(^|\/)static\-field/.test(path)) {
        return;
      } else if (
        renderer.name === 'card-item' ||
        renderer.name === 'list-item-field' ||
        renderer.name === 'card-item-field'
      ) {
        return;
      }

      // Copy some information out
      return {
        name: 'Unknown',
        $schema: '/schemas/UnkownSchema.json'
      };
    }
  }
}

registerEditorPlugin(UnknownRendererPlugin);
