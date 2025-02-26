import {autobind, Renderer, RendererProps} from '@/packages/amis-core/src';
import {Slider} from '@/packages/amis-ui/src';
import React from 'react';
import {BaseSchema} from '../Schema';

export interface SliderSchema extends BaseSchema {
  type: 'slider';
  // Main content
  body: BaseSchema;

  //Left content
  left?: BaseSchema;

  // Right side content
  right?: BaseSchema;

  // The body width ratio under PC, the default is 60%
  bodyWidth?: string;
}

interface SliderProps extends RendererProps, Omit<SliderSchema, 'className'> {}

@Renderer({
  type: 'slider'
})
export class SliderRenderer extends React.Component<SliderProps> {
  state: {
    leftShow: boolean;
    rightShow: boolean;
  } = {
    leftShow: false,
    rightShow: false
  };
  @autobind
  handleLeftShow() {
    this.props.dispatchEvent('leftShow', this.props.data);
  }

  @autobind
  handleRightShow() {
    this.props.dispatchEvent('rightShow', this.props.data);
  }

  @autobind
  handleLeftHide() {
    this.props.dispatchEvent('leftHide', this.props.data);
  }

  @autobind
  handleRightHide() {
    this.props.dispatchEvent('rightHide', this.props.data);
  }

  showLeft() {
    this.setState({
      leftShow: true
    });
  }
  hideLeft() {
    this.setState({
      leftShow: false
    });
  }

  showRight() {
    this.setState({
      rightShow: true
    });
  }

  hideRight() {
    this.setState({
      rightShow: false
    });
  }

  render() {
    const {render, body, left, right, env, ...rest} = this.props;
    const {leftShow, rightShow} = this.state;
    return (
      <Slider
        body={render('body', body, {...rest.data})}
        left={left && render('left', left, {...rest.data})}
        right={right && render('right', right, {...rest.data})}
        showLeft={leftShow}
        showRight={rightShow}
        onLeftShow={this.handleLeftShow}
        onRightShow={this.handleRightShow}
        onLeftHide={this.handleLeftHide}
        onRightHide={this.handleRightHide}
        {...rest}
      />
    );
  }
}
