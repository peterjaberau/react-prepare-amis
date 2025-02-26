import {buildApi} from '../utils/api';
import {RendererEvent} from '../utils/renderer-event';
import omit from 'lodash/omit';
import {
  RendererAction,
  ListenerContext,
  registerAction,
  ListenerAction
} from './Action';

export interface ILinkAction extends ListenerAction {
  actionType: 'link' | 'url' | 'jump';
  args: {
    link?: string;
    url?: string;
    blank?: boolean;
    params?: {
      [key: string]: string;
    };
    [propName: string]: any;
  };
}

/**
 * Open page action
 *
 * @export
 * @class LinkAction
 * @implements {Action}
 */
export class LinkAction implements RendererAction {
  async run(
    action: ILinkAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (!event.context.env?.jumpTo) {
      throw new Error('env.jumpTo is required!');
    }

    let apiParams = {
      ...(action.args?.params ?? {}),
      ...(action.data ?? {})
    };

    if (action?.actionType === 'link' && apiParams?.targetType) {
      // link action adds a new open method targetType, buildApi does not need this parameter
      delete apiParams.targetType;
    }

    // Compatible with more complex URLs through buildApi
    let urlObj = buildApi(
      {
        url: (action.args?.url || action.args?.link) as string,
        method: 'get'
      },
      apiParams,
      {
        autoAppend: true
      }
    );

    event.context.env?.jumpTo(
      urlObj.url,
      {
        actionType: action.actionType,
        type: 'button',
        ...action.args
      },
      action.data ?? {}
    );
  }
}

registerAction('openlink', new LinkAction());
