import React from 'react';
import ReactDOM from 'react-dom';
import memoize from 'lodash/memoize';
import isString from 'lodash/isString';
import {Renderer, RendererProps} from '@/packages/amis-core/src';
import {BaseSchema} from '../Schema';
import {FormControlProps} from '@/packages/amis-core/src';
import isEqual from 'lodash/isEqual';

/**
 * Custom components
 */
export interface CustomSchema extends BaseSchema {
  /**
   * Implement a renderer with custom functions, mainly used in JS SDK and visual editor.
   *
   * Documentation: https://baidu.gitee.io/amis/components/custom
   */
  type: 'custom';
  onMount?: Function | string;
  onUpdate?: Function | string;
  onUnmount?: Function | string;
  inline?: boolean;
  id?: string;
  html?: string;
}

export interface CustomProps extends FormControlProps, CustomSchema {
  className?: string;
  value?: any;
  wrapperComponent?: any;
  inline?: boolean;
}

// Add resolver and specify the union string of all parameters as key. Because the last parameter is the function body
// Cache to avoid large-scale execution of custom components in crud
const getFunction = memoize(
  (...args) => {
    return new Function(...args);
  },
  (...args) => JSON.stringify(args)
);

export class Custom extends React.Component<CustomProps, object> {
  static defaultProps: Partial<CustomProps> = {
    inline: false
  };

  dom: any;
  onUpdate: Function = () => {};
  onMount: Function = () => {};
  onUnmount: Function = () => {};

  childElemArr: HTMLElement[] = []; // Used to record the Dom node of the child element for destruction

  constructor(props: CustomProps) {
    super(props);
    this.dom = React.createRef();
    this.initOnMount(props);
    this.initOnUpdate(props);
    this.initOnUnmount(props);
    this.renderChild = this.renderChild.bind(this);
    this.recordChildElem = this.recordChildElem.bind(this);
    this.unmountChildElem = this.unmountChildElem.bind(this);
  }

  initOnMount(props: CustomProps) {
    if (props.onMount) {
      if (typeof props.onMount === 'string') {
        this.onMount = getFunction(
          'dom',
          'value',
          'onChange',
          'props',
          props.onMount
        );
      } else {
        this.onMount = props.onMount;
      }
    }
  }

  initOnUpdate(props: CustomProps) {
    if (props.onUpdate) {
      if (typeof props.onUpdate === 'string') {
        this.onUpdate = getFunction(
          'dom',
          'data',
          'prevData',
          'props',
          props.onUpdate
        );
      } else {
        this.onUpdate = props.onUpdate;
      }
    }
  }

  initOnUnmount(props: CustomProps) {
    if (props.onUnmount) {
      if (typeof props.onUnmount === 'string') {
        this.onUnmount = getFunction('props', props.onUnmount);
      } else {
        this.onUnmount = props.onUnmount;
      }
    }
  }

  componentDidUpdate(prevProps: CustomProps) {
    if (!isEqual(this.props.onUpdate, prevProps.onUpdate)) {
      this.initOnUpdate(this.props);
    }
    if (
      !isEqual(this.props.onUpdate, prevProps.onUpdate) ||
      !isEqual(this.props.data, prevProps.data)
    ) {
      this.onUpdate(this.dom, this.props.data, prevProps.data, this.props);
    }
    if (!isEqual(this.props.onMount, prevProps.onMount)) {
      this.initOnMount(this.props);
    }
    if (!isEqual(this.props.onUnmount, prevProps.onUnmount)) {
      this.initOnUnmount(this.props);
    }
  }

  componentDidMount() {
    const {value, onChange} = this.props;
    this.onMount(this.dom.current, value, onChange, this.props);
  }

  componentWillUnmount() {
    this.onUnmount(this.props);
    // Automatically destroy all child nodes
    this.unmountChildElem();
  }

  //Record the DOM node of the child element
  recordChildElem(insertElem: HTMLElement) {
    if (insertElem && !this.childElemArr.some(item => item === insertElem)) {
      this.childElemArr.push(insertElem);
    }
  }

  //Destroy the DOM nodes of all child elements
  unmountChildElem() {
    if (this.childElemArr && this.childElemArr.length > 0) {
      this.childElemArr.forEach(childElemItem =>
        ReactDOM.unmountComponentAtNode(childElemItem)
      );
    }
  }

  /**
   * Render child elements
   * Note: The child elements generated by props.render of the existing custom component are react virtual DOM objects and need to be rendered using ReactDOM.render. They cannot be directly inserted into the current DOM.
   **/
  renderChild(
    schemaPosition: string,
    childSchema: any,
    insertElemDom: HTMLElement | string
  ) {
    const {render} = this.props;
    let childEleCont = null;
    let curInsertElemDom: any = null;
    if (isString(insertElemDom)) {
      const _curInsertElem = document.getElementById(insertElemDom);
      if (_curInsertElem) {
        curInsertElemDom = _curInsertElem as HTMLElement;
      }
    } else {
      curInsertElemDom = insertElemDom;
    }
    if (childSchema && curInsertElemDom) {
      const childHTMLElem = render(schemaPosition, childSchema);
      childEleCont = ReactDOM.render(childHTMLElem, curInsertElemDom, () => {
        this.recordChildElem(curInsertElemDom);
      });
    }
    return childEleCont;
  }

  render() {
    const {
      className,
      style,
      html,
      id,
      wrapperComponent,
      inline,
      translate: __,
      classnames: cx
    } = this.props;
    const Component = wrapperComponent || inline ? 'span' : 'div';
    return (
      <Component
        ref={this.dom}
        className={cx(className)}
        style={style}
        id={id}
        dangerouslySetInnerHTML={{__html: html ? html : ''}}
      ></Component>
    );
  }
}

@Renderer({
  type: 'custom'
})
export class CustomRenderer extends Custom {}
