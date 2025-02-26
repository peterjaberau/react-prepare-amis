import {BuildPanelEventContext, BasePlugin, BasicPanelItem} from '../plugin';

/**
 * Added name panel to facilitate locating nodes based on component names
 */
export class NamePlugin extends BasePlugin {
  static scene = ['layout'];
  order = -9999;

  buildEditorPanel(
    {info, selections}: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    // panels.push({
    //   position: 'left',
    //   key: 'name-list',
    //   icon: 'fa fa-list',
    // title: 'name',
    //   component: TargetNamePanel,
    //   order: 4000
    // });
  }
}
// PM side: The name tab is a bit strange, so remove it temporarily
// registerEditorPlugin(NamePlugin);
