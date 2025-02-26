import {Api, ApiObject} from '../types';
import {normalizeApi, normalizeApiResponseData} from '../utils/api';
import {ServerError} from '../utils/errors';
import {createObject, isEmpty} from '../utils/helper';
import {RendererEvent} from '../utils/renderer-event';
import {evalExpressionWithConditionBuilderAsync} from '../utils/tpl';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IAjaxAction extends ListenerAction {
  action: 'ajax';
  api: Api;
  messages?: {
    success: string;
    failed: string;
  };
  options?: Record<string, any>;
  [propName: string]: any;
}

/**
 * Send request action
 *
 * @export
 * @class AjaxAction
 * @implements {Action}
 */
export class AjaxAction implements RendererAction {
  fetcherType: string;
  constructor(fetcherType: string = 'ajax') {
    this.fetcherType = fetcherType;
  }

  async run(
    action: IAjaxAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (!event.context.env?.fetcher) {
      throw new Error('env.fetcher is required!');
    }

    if (!action.api) {
      throw new Error('api is required!');
    }

    if (this.fetcherType === 'download' && action.actionType === 'download') {
      if ((action as any).api) {
        (action as any).api.responseType = 'blob';
      }
    }

    const env = event.context.env;
    const silent = action?.options?.silent || (action?.api as ApiObject).silent;
    const messages = (action?.api as ApiObject)?.messages;
    let api = normalizeApi(action.api);

    if (api.sendOn !== undefined) {
// Before sending a request, determine whether it needs to be sent
      const sendOn = await evalExpressionWithConditionBuilderAsync(
        api.sendOn,
        action.data ?? {},
        false
      );

      if (!sendOn) {
        return;
      }
    }

// If data mapping is not configured, give an empty object to avoid using the current data domain as an interface request parameter
    if ((api as any)?.data == undefined) {
      api = {
        ...api,
        data: {}
      };
    }

    try {
      const result = await env.fetcher(
        api,
        action.data ?? {},
        action?.options ?? {}
      );
      const responseData =
        !isEmpty(result.data) || result.ok
          ? normalizeApiResponseData(result.data)
          : null;

      // Record the data returned by the request
      event.setData(
        createObject(event.data, {
          ...responseData, // Compatible with historical configuration
          responseData: responseData,
          [action.outputVar || 'responseResult']: {
            ...responseData,
            responseData,
            responseStatus: result.status,
            responseMsg: result.msg
          }
        })
      );
      if (!silent) {
        if (!result.ok) {
          throw new ServerError(
            messages?.failed ?? action.messages?.failed ?? result.msg,
            result
          );
        } else {
          const msg =
            messages?.success ??
            action.messages?.success ??
            result.msg ??
            result.defaultMsg;
          msg &&
            env.notify(
              'success',
              msg,
              result.msgTimeout !== undefined
                ? {
                    closeButton: true,
                    timeout: result.msgTimeout
                  }
                : undefined
            );
        }
      }

      return result.data;
    } catch (e) {
      if (!silent) {
        if (e.type === 'ServerError') {
          const result = (e as ServerError).response;
          env.notify(
            'error',
            e.message,
            result.msgTimeout !== undefined
              ? {
                  closeButton: true,
                  timeout: result.msgTimeout
                }
              : undefined
          );
        } else {
          env.notify('error', e.message);
        }
      }

      // Does not block subsequent execution
// throw e;
    }
  }
}

registerAction('ajax', new AjaxAction());

registerAction('download', new AjaxAction('download'));
