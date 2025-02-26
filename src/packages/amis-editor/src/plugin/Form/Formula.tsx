import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';
import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {BasePlugin} from '@/packages/amis-editor-core/src';

export class FormulaControlPlugin extends BasePlugin {
  static id = 'FormulaControlPlugin';
  // Associated renderer name
  rendererName = 'formula';
  $schema = '/schemas/FormulaControlSchema.json';

  // Component name
  name = 'official';
  isBaseComponent = true;
  disabledRendererPlugin = true;
  icon = 'fa fa-calculator';
  pluginIcon = 'formula-plugin';
  description =
    'Calculate the specified variable value through the formula and apply the result to the specified variable';
  docLink = '/amis/zh-CN/components/form/formula';
  tags = ['form item'];
  scaffold = {
    type: 'formula',
    name: 'formula'
  };
  previewSchema: any = {
    type: 'tpl',
    tpl: 'Calculation formula'
  };

  panelTitle = 'Official';
  panelBody = [
    getSchemaTpl('layout:originPosition', {value: 'left-top'}),
    {
      label: 'field name',
      name: 'name',
      type: 'input-text',
      description:
        'The formula calculation result will be applied to the variable corresponding to this field name.'
    },
    {
      type: 'input-text',
      name: 'value',
      label: 'Default value'
    },
    {
      type: 'input-text',
      name: 'formula',
      label: 'official',
      description:
        'Supports JS expressions, such as: <code>data.var_a + 2</code>, that is, when the form item <code>var_a</code> changes, the current form item will be automatically set to the value of <code>var_a + 2</code>. If set to a string, quotes are required'
    },
    {
      type: 'input-text',
      name: 'condition',
      label: 'Action conditions',
      description:
        'Supports expressions such as <code>\\${xxx}</code> or <code>data.xxx == "a"</code> to configure the action condition. When the action condition is met, the calculation result will be set to the target variable.'
    },
    getSchemaTpl('switch', {
      name: 'initSet',
      label: 'Whether initial application',
      description:
        'Whether to run the formula result during initialization and set it to the target variable.',
      pipeIn: defaultValue(true)
    }),
    getSchemaTpl('switch', {
      name: 'autoSet',
      label: 'Automatically apply',
      description:
        'Whether to automatically calculate the formula result and automatically set it to the target variable when there is a change. <br />After closing, the calculation can also be triggered by a button. ',
      pipeIn: defaultValue(true)
    })
  ];

  renderRenderer(props: any) {
    return this.renderPlaceholder(
      'Functional component (formula)',
      props.key,
      props.style
    );
  }
}

registerEditorPlugin(FormulaControlPlugin);
