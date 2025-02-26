/**
 * @file 用来条形码
 */
import React, {Suspense} from 'react';
import {Renderer, RendererProps} from '@/packages/amis-core/src';
import {BaseSchema} from '../Schema';
import {getPropValue} from '@/packages/amis-core/src';
const BarCode = React.lazy(() => import('@/packages/amis-ui/src/components/BarCode'));

/**
 * BarCode 显示渲染器，格式说明。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/barcode
 */
export interface BarCodeSchema extends BaseSchema {
  /**
   *  指定为颜色显示控件
   */
  type: 'barcode';

  /**
   * 宽度
   */
  width?: number;

  /**
   * 高度
   */
  height?: number;

  /**
   * 显示配置
   */
  options: object;
}

export interface BarCodeProps
  extends RendererProps,
    Omit<BarCodeSchema, 'type' | 'className'> {}

export class BarCodeField extends React.Component<BarCodeProps, object> {
  render() {
    const {
      className,
      style,
      width,
      height,
      classnames: cx,
      options
    } = this.props;
    const value = getPropValue(this.props);

    return (
      <Suspense fallback={<div>...</div>}>
        <div
          data-testid="barcode"
          className={cx('BarCode', className)}
          style={style}
        >
          <BarCode value={value} options={options}></BarCode>
        </div>
      </Suspense>
    );
  }
}

@Renderer({
  type: 'barcode'
})
export class BarCodeFieldRenderer extends BarCodeField {}
