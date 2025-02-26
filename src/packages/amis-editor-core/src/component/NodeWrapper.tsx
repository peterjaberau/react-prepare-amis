import {RendererProps, isObject} from '@/packages/amis-core/src';
import {observer} from 'mobx-react';
import {isAlive} from 'mobx-state-tree';
import React from 'react';
import {findDOMNode} from 'react-dom';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import {RendererInfo} from '../plugin';
import {EditorNodeType} from '../store/node';
import {autobind, isEmpty} from '../util';

export interface NodeWrapperProps extends RendererProps {
  $$editor: RendererInfo; // Current node information (info)
  $$node?: EditorNodeType; // Virtual DOM node information
}

@observer
export class NodeWrapper extends React.Component<NodeWrapperProps> {
  /** Properties that should be ignored when merging Mock configurations */
  omitMockProps = ['id', '$$id', 'enable', 'maxDisplayRows'];

  componentDidMount() {
    this.markDom(this.props.$$editor.id);

    // Wait a moment, because other nodes may not have been updated yet.
    const node = this.props.$$node;
    node &&
      requestAnimationFrame(() => {
        () => isAlive(node) && node.calculateHighlightBox();
      });
  }

  componentDidUpdate(prevProps: NodeWrapperProps) {
    this.markDom(this.props.$$editor.id);
  }

  ref: any;
  getWrappedInstance() {
    return this.ref;
  }

  @autobind
  refFn(ref: any) {
    this.ref = ref;
  }

  /**
   * Make some marks
   */
  markDom(id: string) {
    const root = findDOMNode(this) as HTMLElement;

    if (!root || !id) {
      return;
    }

    const info = this.props.$$editor;
    const visible =
      this.props.$$visible !== false && this.props.$$hidden !== true;
    let dom = info.wrapperResolve ? info.wrapperResolve(root) : root;
    (Array.isArray(dom) ? dom : dom ? [dom] : []).forEach(dom => {
      dom.setAttribute('data-editor-id', id);
      dom.setAttribute('name', this.props.id);
      dom.setAttribute('data-visible', visible ? '' : 'false');
      dom.setAttribute('data-hide-text', visible ? '' : '<hidden state>');

      if (info.regions) {
        dom.setAttribute('data-container', '');
      } else {
        dom.removeAttribute('data-container');
      }
    });
    info.plugin?.markDom?.(dom, this.props);
  }

  render() {
    // The store may have a circular reference, so JSONPipeOut cannot be called
    let {$$editor, $$node, store, ...rest} = this.props;
    const renderer = $$editor.renderer;

    if ($$editor.filterProps) {
      rest = $$editor.filterProps.call($$editor.plugin, rest, $$node);
    }

    const mockProps = omit(rest?.editorSetting?.mock, this.omitMockProps);

    // Automatically merge fake data
    if (isObject(mockProps) && !isEmpty(mockProps)) {
      rest = merge(rest, mockProps);
    }

    if ($$editor.renderRenderer) {
      return $$editor.renderRenderer.call(
        $$editor.plugin,
        {
          ...rest,
          store,
          ...$$node?.state,
          $$editor,
          ...$$editor.wrapperProps,
          ref: this.refFn
        },
        $$editor
      );
    }
    const Component = renderer.component!;

    const supportRef =
      Component.prototype?.isReactComponent ||
      (Component as any).$$typeof === Symbol.for('react.forward_ref');

    return (
      <Component
        {...rest}
        store={store}
        {...$$node?.state}
        $$editor={$$editor}
        {...$$editor.wrapperProps}
        ref={supportRef ? this.refFn : undefined}
      />
    );
  }
}
