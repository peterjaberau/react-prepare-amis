import {observer} from 'mobx-react';
import React from 'react';
import {PanelProps} from '../../plugin';
import cx from 'classnames';
import {autobind, translateSchema} from '../../util';
import {Icon, InputBox, Tab, Tabs} from '@/packages/src';
import {EditorNodeType} from '../../store/node';
import {isAlive} from 'mobx-state-tree';
import type {Schema} from '@/packages/src';
import DialogList from './DialogList';

@observer
export class OutlinePanel extends React.Component<PanelProps> {
  state = {
    curSearchElemKey: '' // Used to record the keyword currently entered by the user
  };

  dragEnterCount = 0;

  @autobind
  handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const store = this.props.store;
    const dom = e.currentTarget;
    const id = dom.getAttribute('data-node-id')!;
    const region = dom.getAttribute('data-node-region')!;
    const manager = this.props.manager;

    if (region) {
      // Clicking on the container type will automatically pop up the "Component Insertion Panel" which may interfere with user operations
      // manager.showInsertPanel(region, id);
      /** Special area allows click events */
      if (store.activeId === id && store.activeRegion === region) {
        // Click again to cancel the area selection
        store.setActiveId(id);
      } else {
        store.setActiveId(id, region);
      }
    } else {
      store.setActiveId(id);
    }
  }

  @autobind
  handleDialogNodeClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    option: Schema
  ) {
    // const store = this.props.store;
    // store.setPreviewDialogId(option.$$id);
  }

  @autobind
  handleEnter(e: React.MouseEvent) {
    const dom = e.currentTarget;
    const id = dom.getAttribute('data-node-id')!;
    const region = dom.getAttribute('data-node-region')!;
    const store = this.props.store;

    store.setHoverId(id, region);
  }

  @autobind
  handleTabChange(key: string) {
    const store = this.props.store;
    if (key && isAlive(store)) {
      store.changeOutlineTabsKey(key);
      // if (key === 'component-outline') {
      // store.setPreviewDialogId();
      // }
    }
  }

  @autobind
  handleDragStart(e: React.DragEvent) {
    const id = e.currentTarget!.getAttribute('data-node-id')!;

    if (!id) {
      return;
    }

    this.props.manager.startDrag(id, e);
  }

  timer: any;

  @autobind
  handleDragEnter(e: React.DragEvent) {
    // this.dragEnterCount++;
    const target = e.target as HTMLElement;
    const dom = target.closest(`[data-node-id][data-node-region]`);

    if (!dom) {
      return;
    }

    e.preventDefault();

    // Avoid switching too quickly
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const manager = this.props.manager;
      const id = dom.getAttribute('data-node-id')!;
      const region = dom.getAttribute('data-node-region')!; // container node in the outline tree

      id && region && manager.dnd.switchToRegion(e.nativeEvent, id, region);
    }, 100);
  }

  // @autobind
  // handleDragLeave() {
  // this.dragEnterCount--;
  // }

  @autobind
  handleDragOver(e: React.DragEvent) {
    // const target = e.target as HTMLElement;
    // const dom = target.closest(`[data-node-id][data-node-region]`);

    // if (!dom) {
    //   return;
    // }

    // const manager = this.props.manager;
    // const id = dom.getAttribute('data-node-id')!;
    // const region = dom.getAttribute('data-node-region')!; // container node in the outline tree

    // This is required, otherwise the drop event cannot be triggered
    e.preventDefault();
    // id && region && manager.dnd.switchToRegion(e.nativeEvent, id, region);
  }

  @autobind
  handleDrop(e: React.DragEvent) {
    const manager = this.props.manager;
    manager.dnd.drop(e.nativeEvent);
  }

  @autobind
  handleSearchElemKeyChange(searchVal: string) {
    this.setState({
      curSearchElemKey: searchVal
    });
  }

  @autobind
  clearSearchElemKey() {
    this.setState({
      curSearchElemKey: ''
    });
  }

  @autobind
  renderTitleByKeyword(rendererTitle: string, curSearchTitle: string) {
    if (curSearchTitle && ~rendererTitle.indexOf(curSearchTitle)) {
      const keywordStartIndex = rendererTitle.indexOf(curSearchTitle);
      const keywordEndIndex = keywordStartIndex + curSearchTitle.length;
      return (
        <span>
          {rendererTitle.substring(0, keywordStartIndex)}
          <span className="has-keywords">{curSearchTitle}</span>
          {rendererTitle.substring(keywordEndIndex)}
        </span>
      );
    } else {
      return rendererTitle;
    }
  }

  renderItem(
    option: EditorNodeType,
    index: number,
    type?: 'dialog' | 'dialogView',
    indent = 0
  ) {
    const store = this.props.store;
    const {curSearchElemKey} = this.state;

    const children = /*!store.dragging && */ (
      option.singleRegion
        ? option.uniqueChildren[0]!.uniqueChildren
        : option.uniqueChildren
    ) as Array<EditorNodeType>;

    const hasChildren = children.length;

    // if (store.dragging && !option.isRegion && !option.children.length) {
    //   return null;
    // }

    return (
      <li
        style={{'--indent': indent} as any}
        className={cx('ae-Outline-node', {
          'is-folded': option.folded,
          'is-active':
            (store.activeId === option.id && !option.region) ||
            (option.isRegion &&
              store.dropId === option.id &&
              store.dropRegion === option.region) ||
            (option.isRegion &&
              store.activeId === option.id &&
              store.activeRegion === option.region),
          'is-region': option.isRegion,
          'is-hover': !option.isRegion && store.isContextOn(option.id),
          'has-children': hasChildren
          // 'is-dragging':
          //   store.dragId === option.id && store.dragType === 'schema'
        })}
        key={index}
      >
        <a
          onClick={this.handleClick}
          onMouseEnter={this.handleEnter}
          data-node-id={option.id}
          data-node-region={option.region}
          data-node-common-config={option.schema?.$$commonSchema}
          data-node-form-config={option.schema?.$$formSchema}
          draggable={option.draggable}
          onDragStart={this.handleDragStart}
        >
          {hasChildren ? (
            <span
              onClick={option.toggleFold}
              className={cx('ae-Outline-expander ae-Outline-node-icon', {
                'is-folded': option.folded
              })}
              data-node-id={option.id}
              data-node-region={option.region}
            >
              <Icon icon="down-arrow" />
            </span>
          ) : (
            <span className={cx('ae-Outline-textIndent')}></span>
          )}
          <span className="ae-Outline-node-text">
            {option.isCommonConfig
              ? `${option.label}-[common configuration]`
              : option.isFormConfig
              ? `${option.label}-[form configuration]`
              : this.renderTitleByKeyword(
                  this.getDialogNodeLabel(option, type),
                  curSearchElemKey
                )}
          </span>
        </a>
        {hasChildren ? (
          <ul className="ae-Outline-sublist">
            {children.map((option, index) =>
              this.renderItem(option, index, type, indent + 1)
            )}
          </ul>
        ) : null}
      </li>
    );
  }

  renderDropItem(option: EditorNodeType, index: number) {
    const children = option.uniqueChildren as Array<EditorNodeType>;
    const store = this.props.store;

    const doms: any = children
      .map((option, index) => this.renderDropItem(option, index))
      .filter(item => item);

    if (!doms.length && !option.isRegion) {
      return null;
    } else if (option.isRegion) {
      return (
        <div
          className={cx('ae-Outline-dropNode', {
            'is-active':
              store.dropId === option.id && store.dropRegion === option.region
          })}
          data-node-id={option.id}
          data-node-region={option.region}
          key={`${option.id}-${index}`}
        >
          <a>
            {option.host.singleRegion
              ? option.host.label
              : `(${option.host.label})${option.label}`}
          </a>
          {doms}
        </div>
      );
    } else {
      return doms;
    }
  }

  getDialogNodeLabel(option: EditorNodeType, type?: 'dialog' | 'dialogView') {
    if (!type) {
      return option.label;
    } else {
      return this.getDialogLabel(option, true, 'dialogTitle');
    }
  }

  getDialogLabel(
    option: any,
    isNode: boolean,
    title: 'title' | 'dialogTitle' = 'title'
  ) {
    let rendererTitle = '';
    if (isNode) {
      rendererTitle = option.label;
    }
    if (option.type === 'dialog' || option.type === 'drawer') {
      if (!isNode || (isNode && !option.region)) {
        const titleStr = translateSchema(option[title]);
        if (option.type === 'drawer') {
          rendererTitle = `${
            titleStr || 'Drawer pop-up window'
          } (Drawer pop-up window)`;
        } else {
          if (option.dialogType === 'confirm') {
            rendererTitle = `${titleStr || 'Confirm Dialog'} (Confirm Dialog)`;
          } else {
            rendererTitle = `${titleStr || 'pop-up window'} (pop-up window)`;
          }
        }
      }
    }
    return rendererTitle;
  }

  renderDialogItem(option: any, index: number) {
    // const store = this.props.store;
    // const children = store.root.children;
    // const isSelectedDialog = option.$$id === store.previewDialogId;

    const dialogLabel = this.getDialogLabel(option, false);

    return (
      <li className={cx('ae-Outline-node')} key={index}>
        <a onClick={e => this.handleDialogNodeClick(e, option)}>
          <span className="ae-Outline-node-text">
            {this.renderTitleByKeyword(
              dialogLabel,
              this.state.curSearchElemKey
            )}
          </span>
        </a>
      </li>
    );
  }

  render() {
    const {curSearchElemKey} = this.state;
    const {store, manager} = this.props;
    const outlineTabsKey = store.outlineTabsKey || 'component-outline';
    const options = store.outline;

    return (
      <div className="ae-Outline-panel">
        <div className="panel-header">View structure</div>
        <Tabs
          className="ae-outline-tabs"
          linksClassName="ae-outline-tabs-header"
          contentClassName="ae-outline-tabs-content"
          tabsMode="line"
          onSelect={this.handleTabChange}
          activeKey={outlineTabsKey}
        >
          <Tab
            className={'ae-outline-tabs-panel'}
            key={'component-outline'}
            eventKey={'component-outline'}
            title={'Component Outline'}
          >
            <InputBox
              className="editor-InputSearch"
              value={curSearchElemKey}
              onChange={this.handleSearchElemKeyChange}
              placeholder={'query page element'}
              clearable={false}
            >
              {curSearchElemKey ? (
                <a onClick={this.clearSearchElemKey}>
                  <Icon icon="close" className="icon" />
                </a>
              ) : (
                <Icon icon="editor-search" className="icon" />
              )}
            </InputBox>
            <hr className="margin-top" />
            <div
              className={cx('ae-Outline', 'hoverShowScrollBar', {
                'ae-Outline--draging': store.dragging
              })}
              onDragOver={this.handleDragOver}
              onDragEnter={this.handleDragEnter}
              // onDragLeave={this.handleDragLeave}
              onDrop={this.handleDrop}
            >
              {store.dragging ? (
                <div className="ae-Outline-tip">
                  During the dragging process, press the function key to switch
                  containers, or drag into the following area to switch
                </div>
              ) : null}

              {options.length ? (
                store.dragging ? (
                  <div className="ae-Outline-drop">
                    {options.map((option, index) =>
                      this.renderDropItem(option, index)
                    )}
                  </div>
                ) : (
                  <ul className="ae-Outline-list">
                    {options.map((option, index) =>
                      this.renderItem(option, index)
                    )}
                  </ul>
                )
              ) : (
                <div>Loading, please wait...</div>
              )}
            </div>
          </Tab>
          {store.isSubEditor || store.noDialog ? null : (
            <Tab
              className={'ae-outline-tabs-panel'}
              key={'dialog-outline'}
              eventKey={'dialog-outline'}
              title={'Pop-up list'}
            >
              <DialogList manager={manager} store={store} classnames={cx} />
            </Tab>
          )}
        </Tabs>
      </div>
    );
  }
}
