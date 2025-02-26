import {JSONGetById, EditorManager} from 'amis-editor-core';
import {DataSchema} from 'amis-core';
import CmptActionSelect from '../../comp-action-select';

// Pull down to display the range of assignable attributes
export const SELECT_PROPS_CONTAINER = ['form'];

export const renderCmptActionSelect = (
  componentLabel: string,
  required: boolean,
  onChange?: (value: string, oldVal: any, data: any, form: any) => void,
  hideAutoFill?: boolean,
  manager?: EditorManager
) => {
  return [
    ...renderCmptSelect(
      componentLabel || 'Select component',
      true,
      async (value: string, oldVal: any, data: any, form: any) => {
        // Get the component context
        if (form.data.__nodeId) {
          if (form.data.actionType === 'setValue') {
            // todo: This will flash for a moment, you need to check the problem from amis
            form.setValueByName('args.value', []);
            form.setValueByName('args.__comboType', undefined);
            form.setValueByName('args.__valueInput', undefined);
            form.setValueByName('args.__containerType', undefined);

            if (SELECT_PROPS_CONTAINER.includes(form.data.__rendererName)) {
              const contextSchema: any = await form.data.getContextSchemas?.(
                form.data.__nodeId,
                true
              );

              const dataSchema = new DataSchema(contextSchema || []);
              const variables = dataSchema?.getDataPropsAsOptions() || [];
              form.setValueByName(
                '__setValueDs',
                variables.filter(item => item.value !== '$$id')
              );
            } else {
              form.setValueByName('__setValueDs', []);
            }
          }
        }
        form.setValueByName('groupType', '');
        onChange?.(value, oldVal, data, form);
      },
      hideAutoFill
    ),
    {
      type: 'input-text',
      name: '__cmptId',
      mode: 'horizontal',
      size: 'lg',
      required: true,
      label: 'component id',
      visibleOn:
        'this.componentId === "customCmptId" && this.actionType === "component"',
      onChange: async (value: string, oldVal: any, data: any, form: any) => {
        let schema = JSONGetById(manager!.store.schema, value, 'id');
        if (schema) {
          form.setValues({
            __rendererName: schema.type
          });
        } else {
          form.setValues({
            __rendererName: ''
          });
        }
      }
    },
    {
      asFormItem: true,
      label: 'Component action',
      name: 'groupType',
      mode: 'horizontal',
      required: true,
      visibleOn: 'this.actionType === "component"',
      component: CmptActionSelect,
      description: '${__cmptActionDesc}'
    }
  ];
};

export const renderCmptSelect = (
  componentLabel: string,
  required: boolean,
  onChange?: (value: string, oldVal: any, data: any, form: any) => void,
  hideAutoFill?: boolean
) => [
  {
    type: 'tree-select',
    name: 'componentId',
    label: componentLabel || 'Select component',
    showIcon: false,
    searchable: true,
    required,
    selfDisabledAffectChildren: false,
    size: 'lg',
    source: '${__cmptTreeSource}',
    mode: 'horizontal',
    autoFill: {
      __isScopeContainer: '${isScopeContainer}',
      ...(hideAutoFill
        ? {}
        : {
            __rendererLabel: '${label}',
            __rendererName: '${type}',
            __nodeId: '${id}',
            __nodeSchema: '${schema}'
          })
    },
    onChange: async (value: string, oldVal: any, data: any, form: any) => {
      onChange?.(value, oldVal, data, form);
    }
  }
];

export const renderCmptIdInput = (
  onChange?: (value: string, oldVal: any, data: any, form: any) => void
) => {
  return {
    type: 'input-text',
    name: '__cmptId',
    mode: 'horizontal',
    size: 'lg',
    required: true,
    label: 'component id',
    visibleOn: 'this.componentId === "customCmptId"',
    onChange: async (value: string, oldVal: any, data: any, form: any) => {
      onChange?.(value, oldVal, data, form);
    }
  };
};
