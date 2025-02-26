import React from 'react';
import {RendererProps, Renderer} from '@/packages/amis-core/src';
import {FormBaseControlSchema, SchemaCollection} from '../../Schema';
import {autobind} from '@/packages/amis-core/src';
import {resolveVariable} from '@/packages/amis-core/src';
import {FormBaseControl, FormItemWrap} from '@/packages/amis-core/src';

/**
 * Control 表单项包裹
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/control
 */
export interface FormControlSchema extends FormBaseControlSchema {
  type: 'control';

  /**
   * FormItem 内容
   */
  body: SchemaCollection;
}

@Renderer({
  type: 'control'
})
export class ControlRenderer extends React.Component<RendererProps> {
  @autobind
  renderInput() {
    const {render, body, name, data} = this.props;
    return render('inner', body, {
      value: typeof name === 'string' ? resolveVariable(name, data) : undefined
    });
  }

  render() {
    const {render, label, control, ...rest} = this.props;
    return (
      <FormItemWrap
        {...(rest as any)}
        formMode={rest.mode ?? rest.formMode}
        render={render}
        sizeMutable={false}
        label={label}
        renderControl={this.renderInput}
      />
    );
  }
}
