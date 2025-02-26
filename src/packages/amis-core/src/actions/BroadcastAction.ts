import {createObject} from '../utils/helper';
import {
  RendererEvent,
  dispatchGlobalEventForRenderer
} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IBroadcastAction extends ListenerAction {
  actionType: 'broadcast';
  args: {
    eventName: string; // 事件名称，actionType: broadcast
  };
  eventName?: string; // 兼容历史
}

/**
 * broadcast
 *
 * @export
 * @class BroadcastAction
 * @implements {Action}
 */
export class BroadcastAction implements RendererAction {
  async run(
    action: IBroadcastAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (!action.args?.eventName && !action.eventName) {
      console.error('eventName is not defined, please define the event name');
      return;
    }

    // As a new event, the args parameter of the broadcast action needs to be appended to the event data
    event.setData(createObject(event.data, action.data ?? {}));

    const eventName = action.args?.eventName || action.eventName!;

// Directly trigger the corresponding action
    return await dispatchGlobalEventForRenderer(
      eventName,
      renderer,
      event.context.scoped,
      action.data,
      event
    );
  }
}

registerAction('broadcast', new BroadcastAction());
