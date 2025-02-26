import isPlainObject from 'lodash/isPlainObject';
import {ActionObject} from '../types';
import {promisify, str2AsyncFunction} from '../utils';
import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction,
  runActions
} from './Action';

type ScriptType =
  | string
  | ((
      renderer: any,
      doAction: (action: ActionObject, data: Record<string, any>) => void,
      event: RendererEvent<any>,
      action: ListenerAction
    ) => void); //Custom JS, actionType: custom

export interface ICustomAction extends ListenerAction {
  actionType: 'custom';
  args: {
    script: ScriptType;
  };
  script?: ScriptType; // Compatibility History
}

/**
 * Custom action, JS script
 *
 * @export
 * @class CustomAction
 * @implements {ActionObject}
 */
export class CustomAction implements RendererAction {
  async run(
    action: ICustomAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    // Execute custom orchestration script
    let scriptFunc = action.args?.script ?? action.script;

    if (typeof scriptFunc === 'string') {
      scriptFunc = str2AsyncFunction(
        scriptFunc,
        'context',
        'doAction',
        'event'
      ) as any;
    }
    const proxy = new Proxy(
      {},
      {
        get(target: {}, p: string | symbol, receiver: any): any {
          if (typeof p === 'string') {
            return event.context.scoped?.getComponentByName?.(p);
          }
        }
      }
    );
    // External users can directly call doAction to complete action calls
    // Action calls can be directly arranged through contexts, and action intervention can be performed through events
    let result = await (scriptFunc as any)?.call(
      proxy,
      renderer,
      (action: ListenerAction) => runActions(action, renderer, event),
      event,
      action
    );
    // Handle to external processing
    // if (isPlainObject(result)) {
    // event.setData({...event.data, ...result});
    // }
  }
}

registerAction('custom', new CustomAction());
