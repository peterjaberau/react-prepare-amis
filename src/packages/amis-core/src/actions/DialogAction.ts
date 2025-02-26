import {Schema, SchemaNode} from '../types';
import {extendObject} from '../utils';
import {RendererEvent} from '../utils/renderer-event';
import {filter} from '../utils/tpl';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IAlertAction extends ListenerAction {
  actionType: 'alert';
  dialog?: Schema;
// Compatible with history, reserved. To be consistent with other pop-ups
  args: {
    msg: string;
    [propName: string]: any;
  };
}

export interface IConfirmAction extends ListenerAction {
  actionType: 'confirm';
  args: {
    title: string;
    msg: string;
    [propName: string]: any;
  };
}

export interface IDialogAction extends ListenerAction {
  actionType: 'dialog';
// Compatible with history, reserved. It is not recommended to use args
  args: {
    dialog: SchemaNode;
  };
  dialog?: SchemaNode;

  /**
   * Wait for confirmation result
   */
  waitForAction?: boolean;

  /**
   * If waiting for the result, save the pop-up window result to this variable
   */
  outputVar?: string;
}

export interface IConfirmDialogAction extends ListenerAction {
  actionType: 'confirmDialog';
  dialog?: Schema;

  // For compatibility with history, reserved. It is not recommended to use args
  args: {
    msg: string;
    title: string;
    body?: Schema;
    closeOnEsc?: boolean;
    size?: '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    confirmText?: string;
    cancelText?: string;
    confirmBtnLevel?: string;
    cancelBtnLevel?: string;
  };
}

/**
 * Open pop-up action
 *
 * @export
 * @class DialogAction
 * @implements {Action}
 */
export class DialogAction implements RendererAction {
  async run(
    action: IDialogAction,
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
            actionType: 'dialog',
            dialog: action.dialog,
            reload: 'none',
            data: action.rawData
          },
          action.data
        )
      : renderer.props.onAction?.(
          event,
          {
            actionType: 'dialog',
            dialog: action.dialog,
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
          [action.outputVar || 'dialogResponse']: {
            confirmed,
            value
          }
        })
      );
    }
  }
}

export interface ICloseDialogAction extends ListenerAction {
  actionType: 'closeDialog';
}

/**
 * Close pop-up action
 *
 * @export
 * @class CloseDialogAction
 * @implements {Action}
 */
export class CloseDialogAction implements RendererAction {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    // todo supports waitForAction, which waits for the popup to close before executing subsequent actions
    if (action.componentId) {
      // Close the specified pop-up window
      event.context.scoped.closeById(action.componentId);
    } else {
      // Close the current pop-up window
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

/**
 * alert action
 */
export class AlertAction implements RendererAction {
  async run(
    action: IAlertAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    event.context.env.alert?.(
      filter(action.dialog?.msg, event.data) ?? action.args?.msg,
      filter(action.dialog?.title, event.data) ?? action.args?.title,
      filter(action.dialog?.className, event.data) ?? ''
    );
  }
}

/**
 * confirm action
 */
export class ConfirmAction implements RendererAction {
  async run(
    action: IConfirmDialogAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    let modal: any = action.dialog ?? action.args;

    if (modal.$ref && renderer.props.resolveDefinitions) {
      modal = {
        ...renderer.props.resolveDefinitions(modal.$ref),
        ...modal
      };
    }

    const type = modal?.type;

    if (!type) {
      const confirmed = await event.context.env.confirm?.(
        filter(modal?.msg, event.data) || action.args?.msg,
        filter(action.dialog?.title, event.data) || action.args?.title,
        {
          closeOnEsc:
            filter(action.dialog?.closeOnEsc, event.data) ||
            action.args?.closeOnEsc,
          size: filter(action.dialog?.size, event.data) || action.args?.size,
          confirmText:
            filter(action.dialog?.confirmText, event.data) ||
            action.args?.confirmText,
          cancelText:
            filter(action.dialog?.cancelText, event.data) ||
            action.args?.cancelText,
          confirmBtnLevel:
            filter(action.dialog?.confirmBtnLevel, event.data) ||
            action.args?.confirmBtnLevel,
          cancelBtnLevel:
            filter(action.dialog?.cancelBtnLevel, event.data) ||
            action.args?.cancelBtnLevel,
          className: filter(action.dialog?.className, event.data) || ''
        }
      );

      return confirmed;
    }

    // Customize pop-up content
    const confirmed = await new Promise((resolve, reject) => {
      renderer.handleAction
        ? renderer.handleAction(
            event,
            {
              actionType: 'dialog',
              dialog: modal,
              data: action.rawData,
              reload: 'none',
              callback: (result: boolean) => resolve(result)
            },
            action.data
          )
        : renderer.props.onAction?.(
            event,
            {
              actionType: 'dialog',
              dialog: modal,
              data: action.rawData,
              reload: 'none',
              callback: (result: boolean) => resolve(result)
            },
            action.data
          );
    });

    return confirmed;
  }
}

registerAction('dialog', new DialogAction());
registerAction('closeDialog', new CloseDialogAction());
registerAction('alert', new AlertAction());
registerAction('confirmDialog', new ConfirmAction());
