/**
 * Compatible with the renderer registration method in 1.x.
 */
import {EditorManager, registerEditorPlugin} from './manager';
import {BasePlugin} from './plugin';

/**
 * Old version method to register renderer editor.
 *
 * @deprecated
 * @param rendererName
 * @param config
 */
export function RendererEditor(
  rendererName: string,
  config: {
    name: string;
    description?: string;
    type?: string;
    previewSchema?: any;
    scaffold?: any;
  }
) {
  return function (Klass: new (manager: EditorManager) => BasicEditor) {
    registerEditorPlugin(
      class ComposedPlugin extends Klass {
        rendererName: string;
        name: string;
        description?: string;
        scaffold?: any;
        previewSchema?: any;
        panelTitle?: string;
        panelControls?: Array<any>;

        constructor(manager: EditorManager) {
          super(manager);

          this.rendererName = rendererName;
          this.name = this.tipName || config.name;
          this.description = config.description;
          this.scaffold = config.scaffold || {type: config.type};
          this.previewSchema = config.previewSchema || this.scaffold;

          if (this.settingsSchema) {
            this.panelTitle = this.settingsSchema.title;
            this.panelControls = this.settingsSchema.body;
          }
        }
      }
    );
  };
}

/**
 * To be compatible with the old registration method
 * @deprecated
 */
export class BasicEditor extends BasePlugin {
  tipName?: string;
  settingsSchema?: {
    title: string;
    body: Array<any>;
  };
}
