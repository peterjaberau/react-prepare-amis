import React from 'react';
import {Renderer, RendererProps} from '@/packages/amis-core/src';
import type {BaseSchema, SchemaCollection} from 'amis';
import {MyEuiButton} from 'amis-ui';

export interface EuiButtonSchema extends BaseSchema {
  id?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  [key: string]: any;
  label?: string;
  type: 'eui-button';
  // content area
  body: SchemaCollection;
}

@Renderer({
  type: 'eui-button'
})
export class EuiButtonRenderer extends React.Component<RendererProps> {
  render() {
    const {body, render, ...rest} = this.props;

    return <MyEuiButton {...rest}>{render('body', body)}</MyEuiButton>;
  }
}
