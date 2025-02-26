import {SchemaNode} from '../types';
import {extendObject} from '../utils';
import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IDrawerAction extends ListenerAction {
  actionType: 'drawer';
  // Compatible with history, reserved. It is not recommended to use args
  args: {
    drawer: SchemaNode;
  };
  drawer?: SchemaNode;

  /**
   * Whether to wait for confirmation result
   */
  waitForAction?: boolean;

  outputVar?: string;
}

/**
 * Open drawer action
 *
 * @export
 * @class DrawerAction
 * @implements {Action}
 */
export class DrawerAction implements RendererAction {
  async run(
    action: IDrawerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    // Prevent execution in editor preview mode
    if ((action as any).$$id !== undefined) {
      return;
    }
    let ret = renderer.handleAction
      ? renderer.handleAction(
          event,
          {
            actionType: 'drawer',
            drawer: action.drawer,
            reload: 'none',
            data: action.rawData
          },
          action.data
        )
      : renderer.props.onAction?.(
          event,
          {
            actionType: 'drawer',
            drawer: action.drawer,
            reload: 'none',
            data: action.rawData
          },
          action.data
        );

    event.pendingPromise.push(ret);
    if (action.waitForAction) {
      const {confirmed, value} = await ret;

      event.setData(
        extendObject(event.data, {
          [action.outputVar || 'drawerResponse']: {
            confirmed,
            value
          }
        })
      );
    }
  }
}

export interface ICloseDrawerAction extends ListenerAction {
  actionType: 'closeDrawer';
}

/**
 * Close drawer action
 *
 * @export
 * @class CloseDrawerAction
 * @implements {Action}
 */
export class CloseDrawerAction implements RendererAction {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (action.componentId) {
      // Close the specified drawer
      event.context.scoped.closeById(action.componentId);
    } else {
      // Close the current drawer
      renderer.props.onAction?.(
        event,
        {
          ...action,
          actionType: 'close'
        },
        action.data
      );
    }
  }
}

registerAction('drawer', new DrawerAction());
registerAction('closeDrawer', new CloseDrawerAction());
