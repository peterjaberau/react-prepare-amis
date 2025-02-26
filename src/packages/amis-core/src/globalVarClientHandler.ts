import {
  registerGlobalVariableHandler,
  GlobalVariableItemFull,
  GlobalVarContext,
  GlobalVariableItem
} from './globalVar';

function loadClientData(key: string, variables: Array<GlobalVariableItem>) {
  const str = localStorage.getItem(key);
  let data: any = {};

  try {
    data = JSON.parse(str || '{}');
  } catch (e) {
    console.error(`parse localstorage "${key} error"`, e);
  }

  let filterData: any = {};
  variables.forEach(item => {
    if (data.hasOwnProperty(item.key)) {
      filterData[item.key] = data[item.key];
    }
  });

  return filterData;
}

function saveClientData(
  key: string,
  values: any,
  variables: Array<GlobalVariableItem>
) {
  const str = localStorage.getItem(key);
  let data: any = {};

  try {
    data = JSON.parse(str || '{}');
  } catch (e) {
    console.error(`parse localstorage "${key} error"`, e);
  }
  Object.assign(data, values);
  localStorage.setItem(key, JSON.stringify(data));
}

function bulkClientGetter({variables}: GlobalVarContext) {
  return loadClientData('amis-client-vars', variables);
}

function bulkClientSetter(values: any, context: GlobalVarContext) {
  return saveClientData('amis-client-vars', values, context.variables);
}

function pageBulkClientGetter(context: GlobalVarContext) {
  const variables = context.variables;
  const key = `amis-client-vars-${context.pageId || location.pathname}`;
  return loadClientData(key, variables);
}

function pageBulkClientSetter(values: any, context: GlobalVarContext) {
  const key = `amis-client-vars-${context.pageId || location.pathname}`;
  return saveClientData(key, values, context.variables);
}

/**
 * Register a global variable handler to handle variables whose storageOn is client
 *
 * And according to the scope of the variable, it is determined whether it is page or global
 *
 * Store data in localStorage
 */
registerGlobalVariableHandler(function (
  variable,
  context
): GlobalVariableItemFull | void {
  if (variable.storageOn === 'client') {
    return {
      ...variable,
      bulkGetter:
        variable.scope === 'page' ? pageBulkClientGetter : bulkClientGetter,
      bulkSets:
        variable.scope === 'page' ? pageBulkClientSetter : bulkClientSetter
    };
  }
});
