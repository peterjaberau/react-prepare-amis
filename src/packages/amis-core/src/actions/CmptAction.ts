import {RendererEvent} from '../utils/renderer-event';
import {createObject, extendObject} from '../utils/helper';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';
import {getRendererByName} from '../factory';

export interface ICmptAction extends ListenerAction {
  actionType: string;
  args: {
    resetPage?: boolean; // Reset paging when reloading
    path?: string; // Path of target variable when settingValue
    value?: string | {[key: string]: string}; // Value of target variable when settingValue
    index?: number; // When settingValue, support updating data of specified index, generally used for array type
    condition?: any; // When settingValue, support updating data of specified condition, generally used for array type
  };
}

/**
 * Component action
 *
 * @export
 * @class CmptAction
 * @implements {Action}
 */
export class CmptAction implements RendererAction {
  async run(
    action: ICmptAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    /**
     * Find the specified component based on the unique ID
     * If the trigger component does not specify an id or does not specify a response component componentId, use the trigger component response
     */
    const key = action.componentId || action.componentName;
    const dataMergeMode = action.dataMergeMode || 'merge';
    const path = action.args?.path;

    /** If args carries the path parameter, it is considered to be a global variable assignment, otherwise it is considered to be a component variable assignment */
    if (action.actionType === 'setValue' && path && typeof path === 'string') {
      if (path.startsWith('global.')) {
        const topStore = renderer.props.topStore;
        topStore?.updateGlobalVarValue(path.substring(7), action.args.value);
      }

      const beforeSetData = event?.context?.env?.beforeSetData;
      if (beforeSetData && typeof beforeSetData === 'function') {
        const res = await beforeSetData(renderer, action, event);
        if (res === false) {
          return;
        }
      }
    }

    // If key is not specified, the default is the current component
    let component = key
      ? event.context.scoped?.[
        action.componentId ? 'getComponentById' : 'getComponentByName'
        ](key)
      : renderer;
// If key is specified but the component is not found, an error is reported
    if (key && !component) {
      const msg = `Trying to execute a non-existent target component action (${key}), please check that the target component is not hidden and that the componentId or componentName is correctly specified`;
      if (action.ignoreError === false) {
        throw Error(msg);
      } else {
        console.warn(msg);
      }
    }

    if (action.actionType === 'setValue') {
      if (component?.setData) {
        return component?.setData(
          action.args?.value,
          dataMergeMode === 'override',
          action.args?.index,
          action.args?.condition
        );
      } else {
        return component?.props.onChange?.(action.args?.value);
      }
    }

    // refresh
    if (action.actionType === 'reload') {
      const result = await component?.reload?.(
        undefined,
        action.data,
        event.data,
        undefined,
        dataMergeMode === 'override',
        {
          ...action.args,
          resetPage: action.args?.resetPage ?? action.resetPage
        }
      );

      if (result && action.outputVar) {
        event.setData(
          extendObject(event.data, {
            [action.outputVar]: result
          })
        );
      }

      return result;
    }

    // Check form items
    if (
      action.actionType === 'validateFormItem' &&
      getRendererByName(component?.props?.type)?.isFormItem
    ) {
      const {dispatchEvent, data} = component?.props || {};
      try {
        const valid =
          (await component?.props.onValidate?.()) ||
          (await component?.validate?.());
        if (valid) {
          event.setData(
            createObject(event.data, {
              [action.outputVar || `${action.actionType}Result`]: {
                error: '',
                value: component?.props?.formItem?.value
              }
            })
          );
          dispatchEvent && dispatchEvent('formItemValidateSucc', data);
        } else {
          event.setData(
            createObject(event.data, {
              [action.outputVar || `${action.actionType}Result`]: {
                error: (component?.props?.formItem?.errors || []).join(','),
                value: component?.props?.formItem?.value
              }
            })
          );
          dispatchEvent && dispatchEvent('formItemValidateError', data);
        }
      } catch (e) {
        event.setData(
          createObject(event.data, {
            [action.outputVar || `${action.actionType}Result`]: {
              error: e.message || '未知错误',
              value: component?.props?.formItem?.value
            }
          })
        );
        dispatchEvent && dispatchEvent('formItemValidateError', data);
      }
      return;
    }

    // Execute component actions
    try {
      const result = await component?.doAction?.(
        action,
        event.data,
        true,
        action.args
      );

      if (['validate', 'submit'].includes(action.actionType)) {
        event.setData(
          createObject(event.data, {
            [action.outputVar || `${action.actionType}Result`]: {
              error: '',
              payload: result?.__payload ?? component?.props?.store?.data,
              responseData: result?.__response
            }
          })
        );
      }
      return result;
    } catch (e) {
      event.setData(
        createObject(event.data, {
          [action.outputVar || `${action.actionType}Result`]: {
            error: e.message,
            errors: e.name === 'ValidateError' ? e.detail : e,
            payload: component?.props?.store?.data
          }
        })
      );
    }
  }
}

registerAction('component', new CmptAction());
