import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IPageGoAction extends ListenerAction {
  actionType: 'goBack' | 'refresh' | 'goPage';
  args: {
    delta?: number;
    [propName: string]: any;
  };
}

/**
 * Return to the previous page
 *
 * @export
 * @class PageGoBackAction
 * @implements {Action}
 */
export class PageGoBackAction implements RendererAction {
  async run(
    action: IPageGoAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    window.history.back();
  }
}

/**
 * Go to the specified page
 *
 * @export
 * @class PageGoAction
 * @implements {Action}
 */
export class PageGoAction implements RendererAction {
  async run(
    action: IPageGoAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    window.history.go(action.args?.delta || 0);
  }
}

/**
 * Browser refresh
 *
 * @export
 * @class PageRefreshAction * @implements {Action} */

export class PageRefreshAction implements RendererAction {
  async run(
    action: IPageGoAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    window.location.reload();
  }
}

registerAction('goBack', new PageGoBackAction());
registerAction('refresh', new PageRefreshAction());
registerAction('goPage', new PageGoAction());
