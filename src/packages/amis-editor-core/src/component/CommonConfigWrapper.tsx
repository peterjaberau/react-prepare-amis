import {findDOMNode} from 'react-dom';
import {JSONPipeOut} from '../util';
import React from 'react';
import {NodeWrapper} from './NodeWrapper';

export class CommonConfigWrapper extends NodeWrapper {
  // When destroying, remove the added aeEditor-common-config
  componentWillUnmount() {
    const root = findDOMNode(this) as HTMLElement;

    if (!root) {
      return;
    }

    const info = this.props.$$editor;
    let dom = info.wrapperResolve ? info.wrapperResolve(root) : root;

    (Array.isArray(dom) ? dom : dom ? [dom] : []).forEach(dom => {
      dom.classList.remove('ae-Editor-common-config');
    });
  }

  markDom(id: string) {
    const root = findDOMNode(this) as HTMLElement;

    if (!root || !id) {
      return;
    }

    const info = this.props.$$editor;

    let dom = info.wrapperResolve ? info.wrapperResolve(root) : root;
    const schema = this.props.$$commonSchema;
    schema &&
      (Array.isArray(dom) ? dom : dom ? [dom] : []).forEach(dom => {
        dom.setAttribute('data-editor-id', id);
        dom.classList.add('ae-Editor-common-config');
      });
  }

  render() {
    // The store may have a circular reference, so JSONPipeOut cannot be called
    let {$$editor, $$node, $schema, store, ...rest} = this.props;
    const renderer = $$editor.renderer;

    rest = JSONPipeOut(rest, false);

    if ($$editor.filterProps) {
      rest = $$editor.filterProps.call($$editor.plugin, rest, $$node);
    }

    if ($$editor.renderRenderer) {
      return $$editor.renderRenderer.call(
        $$editor.plugin,
        {
          ...rest,
          store,
          $schema,
          $$editor,
          ...$$editor.wrapperProps,
          ref: this.refFn
        },
        $$editor
      );
    }
    const Component = renderer.component!;

    return (
      <Component
        {...rest}
        store={store}
        $schema={$schema}
        $$editor={$$editor}
        {...$$editor.wrapperProps}
        ref={this.refFn}
      />
    );
  }
}
