import {RendererEvent} from '../utils/renderer-event';
import {createObject} from '../utils/helper';
import {
  RendererAction,
  ListenerContext,
  LoopStatus,
  registerAction,
  runActions,
  ILogicAction
} from './Action';
import {resolveVariable} from '../utils/tpl-builtin';

export interface ILoopAction extends ILogicAction {
  actionType: 'loop';
  args: {
    loopName: string;
    [propName: string]: any;
  };
}

/**
 * Loop action
 *
 * @export
 * @class LoopAction
 * @implements {Action}
 */
export class LoopAction implements RendererAction {
  async run(
    action: ILoopAction,
    renderer: ListenerContext,
    event: RendererEvent<any>,
    mergeData: any
  ) {
    const loopName = action.args?.loopName;
    if (typeof loopName !== 'string') {
      console.error('loopName must be a string');
      return;
    }

    const loopData = resolveVariable(loopName, mergeData) || [];

    // Must be an array
    if (!loopData) {
      console.error(`Data not found ${loopName}`);
    } else if (!Array.isArray(loopData)) {
      console.error(`${loopName} data is not an array`);
    } else if (action.children?.length) {
      // Save for now
      const protoData = event.data;

      for (const data of loopData) {
        renderer.loopStatus = LoopStatus.NORMAL;
        // Append data in logic processing, event data takes priority, and must be restored after use
        event.setData(createObject(event.data, data));

        for (const subAction of action.children) {
          // @ts-ignore
          if (renderer.loopStatus === LoopStatus.CONTINUE) {
            continue;
          }
          await runActions(subAction, renderer, event);

          // @ts-ignore
          if (renderer.loopStatus === LoopStatus.BREAK || event.stoped) {
            // Restore event data
            event.setData(protoData);
            event.stopPropagation();
            break;
          }
        }

        if (event.stoped) {
          // Restore event data
          event.setData(protoData);
          break;
        }
      }

      renderer.loopStatus = LoopStatus.NORMAL;
      event.setData(protoData);
    }
  }
}

registerAction('loop', new LoopAction());
