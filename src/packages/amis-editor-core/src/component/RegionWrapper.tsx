import {isAlive} from 'mobx-state-tree';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {EditorManager} from '../manager';
import {RegionConfig, RendererInfo} from '../plugin';
import {needFillPlaceholder} from '../util';
import {EditorStoreType} from '../store/editor';
import {EditorNodeContext, EditorNodeType} from '../store/node';

export interface RegionWrapperProps {
  name: string;
  label: string;
  placeholder?: string | JSX.Element;
  preferTag?: string;
  wrapperResolve?: (dom: HTMLElement) => HTMLElement;
  editorStore: EditorStoreType;
  manager: EditorManager;
  rendererName?: string;
  regionConfig: RegionConfig;
  node?: EditorNodeType; // Virtual DOM node information
  $$editor?: RendererInfo; // Current node information (info)
  children?: React.ReactNode;
}

/**
 * 1. Add data-region, data-region-host and data-renderer attributes to the DOM tag
 * 2. Build the Node store node.
 */
export class RegionWrapper extends React.Component<RegionWrapperProps> {
  static contextType = EditorNodeContext;
  parentNode: EditorNodeType;
  editorNode: EditorNodeType;

  UNSAFE_componentWillMount() {
    this.parentNode = (this.context as any)!;

    /**
     * When the current parent is empty, try to get the current context by node id
     * Note: Custom components other than react container require
     */
    const {$$editor, manager} = this.props;
    if (!this.parentNode && $$editor && $$editor.id) {
      const curContext = manager.store.getNodeById($$editor.id);
      if (curContext) {
        this.parentNode = curContext;
      }
    }

    if (!this.parentNode) {
      return;
    }

    this.editorNode = this.parentNode.addChild({
      id: this.parentNode.id,
      type: this.parentNode.type,
      label: this.props.label,
      path: `${this.parentNode.path}/${this.props.name}`,
      region: this.props.name, // key value in regions
      regionInfo: this.props.regionConfig,
      preferTag: this.props.preferTag
    });
  }

  componentDidMount() {
    if (this.editorNode && isAlive(this.editorNode)) {
      this.editorNode &&
        this.markDom(
          this.editorNode.id,
          this.props.name,
          this.props.rendererName
        );
    }
  }

  componentDidUpdate(prevProps: RegionWrapperProps) {
    this.editorNode &&
      this.markDom(
        this.editorNode.id,
        this.props.name,
        this.props.rendererName
      );
  }

  componentWillUnmount() {
    if (this.editorNode && isAlive(this.editorNode) && this.parentNode) {
      this.parentNode.removeChild(this.editorNode);
    }
  }

  /**
   * Make some marks
   */
  markDom(id: string, region: string, rendererName?: string) {
    const dom = findDOMNode(this) as HTMLElement;

    if (!dom) {
      return;
    }
    const wrapperResolve = this.props.wrapperResolve;
    const wrapper = wrapperResolve ? wrapperResolve(dom) : dom.parentElement!;

    wrapper.setAttribute('data-region', region);
    wrapper.setAttribute('data-region-host', id);
    rendererName && wrapper.setAttribute('data-renderer', rendererName);
  }

  render() {
    const isLayoutItem =
      this.props.rendererName === 'wrapper' ||
      this.props.rendererName === 'container';
    let isNeedFillPlaceholder = false;
    if (needFillPlaceholder(this.props)) {
      isNeedFillPlaceholder = true;
    }
    return (
      <EditorNodeContext.Provider value={this.editorNode}>
        {this.props.children}
        <span
          className={`ae-Region-placeholder ${
            isLayoutItem ? 'layout-content' : ''
          } ${isNeedFillPlaceholder ? 'fill-placeholder' : ''}`}
        >
          {this.props.placeholder || this.props.label}
        </span>
      </EditorNodeContext.Provider>
    );
  }
}
