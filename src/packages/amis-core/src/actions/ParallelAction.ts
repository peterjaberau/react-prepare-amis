import { RendererEvent } from '../utils/renderer-event';
import {
  RendererAction,
  ListenerContext,
  ILogicAction,
  LogicAction,
  registerAction,
  runActions
} from './Action';

export interface IParallelAction extends ILogicAction {
  actionType: 'parallel';
}

export class ParallelAction implements RendererAction {
  async run(
    action: IParallelAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (action.children && action.children.length) {
      const childActions = action.children.map((child: LogicAction) => {
        // Parallel actions do not interfere with each other, but no matter which one intervenes, it will take effect on subsequent actions.
        return runActions(child, renderer, event);
      });
      await Promise.all(childActions);
    }
  }
}

registerAction('parallel', new ParallelAction());
