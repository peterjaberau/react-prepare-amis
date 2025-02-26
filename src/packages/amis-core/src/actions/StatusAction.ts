import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IStatusAction extends ListenerAction {
  actionType:
    | 'static'
    | 'nonstatic'
    | 'show'
    | 'visibility'
    | 'hidden'
    | 'enabled'
    | 'disabled'
    | 'usability';
}

/**
 * Status update actions
 *
 * @export
 * @class StatusAction
 * @implements {Action}
 */
export class StatusAction implements RendererAction {
  async run(
    action: IStatusAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    /**
     * Find the specified component based on the unique ID
     * If the trigger component does not specify an id or the response component componentId, use the trigger component response
     */
    const key = action.componentId || action.componentName;

    // Visibility & status control
    if (['show', 'hidden', 'visibility'].includes(action.actionType)) {
      let visibility =
        action.actionType === 'visibility'
          ? action.args?.value
          : action.actionType === 'show';
      return renderer.props.statusStore.setVisible(key!, visibility as any);
    } else if (['static', 'nonstatic'].includes(action.actionType)) {
      return renderer.props.statusStore.setStatic(
        key!,
        action.actionType === 'static'
      );
    } else if (
      ['enabled', 'disabled', 'usability'].includes(action.actionType)
    ) {
      let usability =
        action.actionType === 'usability'
          ? !action.args?.value
          : action.actionType === 'disabled';
      return renderer.props.statusStore.setDisable(key!, usability);
    }
  }
}

registerAction('status', new StatusAction());
