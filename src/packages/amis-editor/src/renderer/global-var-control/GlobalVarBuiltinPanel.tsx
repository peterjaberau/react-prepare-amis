import {registerGlobalVarPanel} from './GlobalVarManagerPanel';
import React from 'react';
import {SchemaForm} from '@/packages/amis-editor-core/src';

const basicControls: Array<any> = [
  {
    type: 'input-text',
    label: 'variable name',
    name: 'key',
    required: true,
    size: 'md',
    validations: {
      isVariableName: true
    },
    addOn: {
      type: 'text',
      label: 'global.',
      position: 'left'
    }
  },

  {
    type: 'input-text',
    label: 'Title',
    name: 'label',
    size: 'md'
  },

  {
    type: 'json-schema-editor',
    name: 'valueSchema',
    label: 'value format',
    rootTypeMutable: true,
    showRootInfo: true,
    value: 'string'
  },

  {
    type: 'input-text',
    label: 'Default value',
    name: 'defaultValue',
    size: 'md'
  },

  {
    type: 'switch',
    label: 'Client persistence',
    name: 'storageOn',
    trueValue: 'client',
    falseValue: '',
    description:
      'Whether to persist the data on the client and keep it valid after refreshing the page'
  },

  {
    type: 'button-group-select',
    label: 'Data scope',
    visibleOn: '${storageOn}',
    name: 'scope',
    options: [
      {
        label: 'Page sharing',
        value: 'page'
      },
      {
        label: 'Globally shared',
        value: 'app'
      }
    ]
  },

  {
    type: 'textarea',
    label: 'Description',
    name: 'description'
  }
];

/**
 * Register basic variable settings panel
 */
registerGlobalVarPanel('builtin', {
  title: 'Basic variables',
  description: 'System built-in global variables',
  component: (props: any) => (
    <SchemaForm
      mode="horizontal"
      horizontal={{
        left: 2
      }}
      {...props}
      ref={props.formRef}
      body={basicControls}
      submitOnChange={false}
      appendSubmitBtn={false}
    />
  )
});
