import {RendererEvent} from '../utils/renderer-event';
import {evalExpressionWithConditionBuilderAsync} from '../utils/tpl';
import {
  RendererAction,
  ListenerContext,
  registerAction,
  runActions,
  ILogicAction
} from './Action';

export interface ISwitchAction extends ILogicAction {
  actionType: 'switch';
}

/**
 * Exclusive Action
 */
export class SwitchAction implements RendererAction {
  async run(
    action: ISwitchAction,
    renderer: ListenerContext,
    event: RendererEvent<any>,
    mergeData: any
  ) {
    for (const branch of action.children || []) {
      if (!branch.expression) {
        continue;
      }

      const isPass = await evalExpressionWithConditionBuilderAsync(
        branch.expression,
        mergeData
      );

      if (isPass) {
        await runActions(branch, renderer, event);
        // Remove runAllMatch. Only exclusive matching is done here. Multiple matching can be done directly through expression.
        break;
      }
    }
  }
}

registerAction('switch', new SwitchAction());
