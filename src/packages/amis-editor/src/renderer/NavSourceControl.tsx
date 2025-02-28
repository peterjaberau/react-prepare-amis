/**
 * @file component option component's visual editing control
 */

import React from 'react';

import cx from 'classnames';
import Sortable from 'sortablejs';
import set from 'lodash/set';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import {render as renderAmis} from '@/packages/amis-core/src';

import {FormItem, Button, InputBox, Icon, Modal, toast} from '@/packages/amis/src';
import {TooltipWrapper} from '@/packages/amis/src';

import {autobind, getSchemaTpl} from '@/packages/amis-editor-core/src';
import type {FormControlProps} from '@/packages/amis-core/src';
import type {SchemaApi} from '@/packages/amis/src';
import {getOwnValue} from '../util';

export type SourceType = 'custom' | 'api' | '';

export type NavControlItem = {
  id?: string;
  label: string;
  to?: string;
  target?: string;
  icon?: string | {id: string; name: string; svg: string};
  badge?: string;
  children?: Array<NavControlItem>;
};

export interface NavControlProps extends FormControlProps {}

export interface NavControlState {
  links: Array<NavControlItem>;
  api: SchemaApi;
  source: SourceType;
  showDialog: boolean;
  isEdit: boolean;
  modalName: string;
  modalParent: string;
  modalIcon: string;
  modalTarget: string;
  modalBadge: string;
  modalUrl: string;
  currentIndex: string;
  previousModalParent: string;
}

export class NavSourceControl extends React.Component<
  NavControlProps,
  NavControlState
> {
  sortables: Sortable[];
  drag?: HTMLElement | null;

  constructor(props: NavControlProps) {
    super(props);

    const source = getOwnValue(props.data, 'source');

    this.state = {
      links: this.transformOptions(props),
      api: source,
      source: this.transformSource(source),
      showDialog: false,
      isEdit: false,
      modalName: '',
      modalParent: '',
      modalIcon: '',
      modalTarget: '_self',
      modalBadge: '',
      modalUrl: '',
      currentIndex: '',
      previousModalParent: ''
    };

    this.sortables = [];
  }

  transformSource(source: SchemaApi) {
    if (source) {
      return 'api';
    }
    return 'custom';
  }

  transformOptions(props: NavControlProps) {
    const links = getOwnValue(props.data, 'links');
    return Array.isArray(links) ? links : [];
  }

  /**
   * Update unified export
   */
  onChange() {
    const {onBulkChange} = this.props;
    const {source} = this.state;
    const data: Partial<NavControlProps> = {
      source: undefined,
      links: undefined
    };
    if (source === 'custom') {
      const {links} = this.state;
      this.handleSetNavId(links, '');
      data.links = links;
    } else {
      const {api} = this.state;
      data.source = api;
    }
    onBulkChange && onBulkChange(data);
  }

  /**
   * Toggle option type
   */
  @autobind
  handleSourceChange(source: SourceType) {
    this.setState({api: '', source}, this.onChange);
  }

  @autobind
  dragRef(ref: any) {
    if (!this.drag && ref) {
      this.drag = ref;
      this.initDragging();
    } else if (this.drag && !ref) {
      this.destroyDragging(true);
    }
  }

  initDragging() {
    const rootSortable = new Sortable(this.drag as HTMLElement, {
      group: 'NavSourceControlGroup',
      animation: 150,
      handle: '.nav-links-item-dragBar',
      onEnd: (e: Sortable.SortableEvent) => {
        this.handleDragging(e);
      }
    });
    this.sortables.push(rootSortable);
    const parents = this.drag?.querySelectorAll('.nav-links-children');
    if (!parents) {
      return;
    }
    Array.from(parents).forEach((parent: HTMLElement) => {
      const sortable = new Sortable(parent, {
        group: 'NavSourceControlGroup',
        animation: 150,
        handle: '.nav-links-item-dragBar',
        onEnd: (e: Sortable.SortableEvent) => {
          this.handleDragging(e);
        }
      });
      this.sortables.push(sortable);
    });
  }

  @autobind
  handleDragging(e: Sortable.SortableEvent) {
    const {oldIndex, newIndex, from, to} = e;

    const nodeOldIndex = from.dataset.level
      ? `${from.dataset.level}_${oldIndex}`
      : `${oldIndex}`;
    const nodeNewIndex = to.dataset.level
      ? `${to.dataset.level}_${newIndex}`
      : `${newIndex}`;
    const links = cloneDeep(this.state.links);
    if (!nodeOldIndex || !nodeNewIndex) {
      return;
    }

    const {path: oldPath, parentPath: oldParentPath} =
      this.getNodePath(nodeOldIndex);

    const activeDraggingItem = get(links, `${oldPath}`);
    if (oldParentPath) {
      const oldParent = get(links, `${oldParentPath}.children`, []);
      typeof oldIndex === 'number' && oldParent.splice(oldIndex, 1);
      set(links, `${oldParentPath}.children`, oldParent);
    } else {
      typeof oldIndex === 'number' && links.splice(oldIndex, 1);
    }

    const {parentPath: newParentPath} = this.getNodePath(nodeNewIndex);

    if (newParentPath) {
      const newParent: Array<NavControlItem> = get(
        links,
        `${newParentPath}.children`,
        []
      );
      typeof newIndex === 'number' &&
        newParent.splice(newIndex, 0, activeDraggingItem);
      set(links, `${newParentPath}.children`, newParent);
    } else {
      typeof newIndex === 'number' &&
        links.splice(newIndex, 0, activeDraggingItem);
    }
    // Data diffing will cause bugs in the DOM structure. Multiple identical nodes will be cleared first and then reassigned.
    this.setState({source: ''}, () => {
      this.setState({links, source: 'custom'}, () => {
        this.refreshBindDrag();
        this.onChange();
      });
    });
  }

  @autobind
  getNodePath(pathStr: string) {
    let pathArr = pathStr.split('_');
    if (pathArr.length === 1) {
      return {
        path: pathArr,
        parentPath: ''
      };
    }
    const path = `[${pathArr.join('].children[')}]`;
    pathArr = pathArr.slice(0, pathArr.length - 1);
    const parentPath = `[${pathArr.join('].children[')}]`;
    return {
      path,
      parentPath
    };
  }

  refreshBindDrag() {
    if (this.drag) {
      this.destroyDragging();
      this.initDragging();
    }
  }

  @autobind
  destroyDragging(destroyRoot?: boolean) {
    this.sortables.forEach(sortable => {
      sortable?.destroy();
    });
    this.sortables = [];
    destroyRoot && (this.drag = null);
  }
  /**
   * Delete option
   */
  @autobind
  handleDelete(index: string) {
    return new Promise(resolve => {
      const links = this.state.links.concat();
      const pathArr = index.split('_');

      const parentPathArr = pathArr.slice(0, pathArr.length - 1);
      const parentPath = `[${parentPathArr.join('].children[')}]`;
      const deleteItemParent =
        parentPathArr.length > 0
          ? get(links, `${parentPath}.children`, [])
          : links;
      deleteItemParent.splice(parseInt(pathArr[pathArr.length - 1]), 1);
      this.setState({links}, () => this.onChange());
      resolve('');
    });
  }

  @autobind
  handleUpdate(index: string) {
    const {links} = this.state;
    const pathArr = index.split('_');
    const path = `[${pathArr.join('].children[')}]`;

    const updateItem = get(links, path);

    // find parent id
    const parentPathArr = pathArr.slice(0, pathArr.length - 1);
    let parentPath = `[${parentPathArr.join('].children[')}]`;
    if (parentPathArr.length > 0) {
      parentPath += 'id';
    }
    const parentId = parentPathArr.length > 0 ? get(links, parentPath) : '';
    this.setState({
      modalName: updateItem.label,
      modalBadge: updateItem.badge,
      modalIcon: updateItem.icon,
      modalParent: parentId,
      previousModalParent: parentId,
      modalTarget: updateItem.target,
      modalUrl: updateItem.to,
      showDialog: true,
      isEdit: true,
      currentIndex: index
    });
  }

  @autobind
  getChildren() {
    const {currentIndex, links} = this.state;
    if (!currentIndex) {
      return [];
    }
    const pathArr = currentIndex.split('_');
    const path = `[${pathArr.join('].children[')}]`;
    const item = get(links, path);
    if (item && item.children) {
      return item.children;
    } else {
      return [];
    }
  }

  @autobind
  async handleSubmit() {
    const {
      isEdit,
      modalBadge,
      modalIcon,
      modalName,
      modalParent,
      modalTarget,
      modalUrl,
      currentIndex,
      previousModalParent
    } = this.state;
    if (!modalName) {
      toast.error('Menu name is required');
      return;
    }
    if (isEdit && currentIndex === modalParent) {
      toast.error('Cannot drag a menu into itself');
      return;
    }
    const activeLink = {
      label: modalName,
      to: modalUrl,
      icon: modalIcon,
      target: modalTarget,
      badge: modalBadge,
      children: this.getChildren()
    };

    if (isEdit && previousModalParent === modalParent) {
      // Editing state, but the hierarchy is not changed
      const links = cloneDeep(this.state.links);
      const pathArr = currentIndex.split('_');
      const path = `[${pathArr.join('].children[')}]`;
      if (pathArr.length > 0) {
        //Multi-level
        set(links, path, activeLink);
      } else {
        // First level menu
        links[parseInt(currentIndex)] = activeLink;
      }
      this.setState({links}, () => this.onChange());
      this.closeModal();
    } else {
      const links = cloneDeep(this.state.links);
      if (modalParent) {
        const parentPathArr = modalParent.split('_');
        const parentPath = `[${parentPathArr.join('].children[')}].children`;

        let originChildren = get(links, parentPath) || [];
        originChildren.push(activeLink);

        set(links, parentPath, originChildren);
      } else {
        links.push(activeLink);
      }
      this.setState({links}, async () => {
        this.onChange();
        if (isEdit) {
          //After updating the new data level, delete the original node
          await this.handleDelete(currentIndex);
        }
      });

      this.closeModal();
    }
  }

  @autobind
  handleSetNavId(data: NavControlItem[], index: string) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const newIndex = index ? `${index}_${i}` : `${i}`;
      item.id = newIndex;
      if (item.children) {
        this.handleSetNavId(item.children, newIndex);
      }
    }
  }

  @autobind
  handleDeleteNavId(data: NavControlItem[] | NavControlItem) {
    if (Array.isArray(data)) {
      for (let item of data) {
        delete item.id;
        if (item.children) {
          this.handleDeleteNavId(item.children);
        }
      }
    } else {
      delete data.id;
      if (data.children) {
        this.handleDeleteNavId(data.children);
      }
    }
  }

  @autobind
  handleFilterTreeData(data: NavControlItem[]) {
    const {currentIndex} = this.state;
    for (let item of data) {
      if (item.id === currentIndex) {
        this.handleDeleteNavId(item);
        break;
      } else if (item.children) {
        this.handleFilterTreeData(item.children);
      }
    }
  }

  @autobind
  openModal() {
    this.setState({
      showDialog: true
    });
  }

  @autobind
  closeModal() {
    this.setState({
      showDialog: false,
      isEdit: false,
      modalParent: '',
      modalName: '',
      modalUrl: '',
      modalIcon: '',
      modalBadge: '',
      modalTarget: '_self',
      currentIndex: ''
    });
  }

  @autobind
  handleChange(options: any) {
    this.setState(options, this.onChange);
  }

  @autobind
  handleAPIChange(source: SchemaApi) {
    this.setState({api: source}, this.onChange);
  }

  renderApiPanel() {
    const {render} = this.props;
    const {source, api} = this.state;
    if (source === 'api') {
      return render(
        'nav-' + source,
        getSchemaTpl('apiControl', {
          label: 'Interface',
          name: 'source',
          mode: 'normal',
          className: 'ae-ExtendMore',
          value: api,
          onChange: this.handleAPIChange,
          sourceType: source
        })
      );
    }
    return null;
  }

  renderHeader() {
    const {render, label, labelRemark, mobileUI, env, popOverContainer} =
      this.props;
    const classPrefix = env?.theme?.classPrefix;
    const {source} = this.state;
    const optionSourceList = (
      [
        {
          label: 'Custom menu',
          value: 'custom'
        },
        {
          label: 'External interface',
          value: 'api'
        }
      ] as Array<{
        label: string;
        value: SourceType;
      }>
    ).map(item => ({
      key: item.value,
      ...item,
      onClick: () => this.handleSourceChange(item.value)
    }));

    return (
      <header className="ae-NavControl-header">
        <label className={cx(`${classPrefix}Form-label`)}>
          {label || ''}
          {labelRemark
            ? render('label-remark', {
                type: 'remark',
                icon: labelRemark.icon || 'warning-mark',
                tooltip: labelRemark,
                className: cx(`Form-lableRemark`, labelRemark?.className),
                mobileUI,
                container: popOverContainer || env.getModalContainer
              })
            : null}
        </label>
        <div>
          {render(
            'validation-control-addBtn',
            {
              type: 'dropdown-button',
              level: 'link',
              size: 'sm',
              label: '${selected}',
              align: 'right',
              closeOnClick: true,
              closeOnOutside: true,
              buttons: optionSourceList
            },
            {
              popOverContainer: null,
              data: {
                selected: optionSourceList.find(item => item.value === source)
                  ?.label
              }
            }
          )}
        </div>
      </header>
    );
  }

  renderNav(dataSource: NavControlItem[], index?: string) {
    const {render} = this.props;
    return (
      <>
        {dataSource.map((nav, i: number) => {
          return (
            <div
              className={'nav-links-parent'}
              key={nav.id || index ? `${index}_${i}` : `${i}`}
              data-path={index ? `${index}_${i}` : `${i}`}
            >
              <div className="nav-links-item">
                <a className="nav-links-item-dragBar">
                  <Icon icon="drag-bar" className="icon" />
                </a>
                {nav.icon &&
                  render(
                    `render-icon-${
                      typeof nav.icon !== 'string' ? nav.icon.id : nav.icon
                    }`,
                    {
                      type: 'icon',
                      icon: nav.icon,
                      className: 'nav-links-item-icon'
                    }
                  )}
                <TooltipWrapper tooltip={nav.label} placement="left">
                  <div className="nav-links-item-label">{nav.label}</div>
                </TooltipWrapper>

                <div className="nav-links-item-actions">
                  <TooltipWrapper tooltip="编辑" placement="left">
                    <Icon
                      icon="edit"
                      className="icon icon-edit"
                      onClick={() =>
                        this.handleUpdate(index ? `${index}_${i}` : `${i}`)
                      }
                    />
                  </TooltipWrapper>
                  <TooltipWrapper tooltip="删除" placement="left">
                    <Icon
                      icon="delete-btn"
                      className="icon icon-delete"
                      onClick={() =>
                        this.handleDelete(index ? `${index}_${i}` : `${i}`)
                      }
                    />
                  </TooltipWrapper>
                </div>
              </div>
              {nav.children && nav.children.length > 0 && (
                <div
                  className="nav-links-children"
                  data-level={index ? `${index}_${i}` : `${i}`}
                >
                  {this.renderNav(
                    nav.children,
                    index ? `${index}_${i}` : `${i}`
                  )}
                </div>
              )}
            </div>
          );
        })}
      </>
    );
  }

  renderDialog() {
    const {
      links,
      modalBadge,
      modalIcon,
      modalName,
      modalParent,
      modalUrl,
      modalTarget,
      showDialog,
      isEdit
    } = this.state;
    const treeData = cloneDeep(links);
    this.handleFilterTreeData(treeData);
    return renderAmis(
      {
        type: 'dialog',
        title: isEdit ? 'Edit menu item' : 'Add menu item',
        bodyClassName: 'ae-NavControl-dialog',
        body: {
          type: 'form',
          mode: 'horizontal',
          wrapperComponent: 'div',
          actions: [],
          body: [
            {
              type: 'input-text',
              label: 'Menu name',
              name: 'modalName',
              placeholder: 'Please enter the menu name',
              mode: 'horizontal',
              required: true,
              horizontal: {
                justify: true,
                left: 2
              },
              onChange: (value: string) => {
                this.setState({modalName: value});
              }
            },
            {
              type: 'tree-select',
              label: 'parent menu',
              name: 'modalParent',
              initiallyOpen: false,
              placeholder:
                'Please select, if not selected, the default is the first level menu',
              searchable: true,
              multiple: false,
              valueField: 'id',
              options: treeData,
              mode: 'horizontal',
              horizontal: {
                justify: true,
                left: 2
              },
              onChange: (value: string) => {
                this.setState({modalParent: value});
              }
            },
            getSchemaTpl('icon', {
              name: 'modalIcon',
              label: 'Menu icon',
              mode: 'horizontal',
              horizontal: {
                justify: true,
                left: 2
              },
              onChange: (value: string) => {
                this.setState({modalIcon: value});
              }
            }),
            {
              type: 'input-text',
              label: 'jump address',
              placeholder: 'Please enter the address',
              mode: 'horizontal',
              name: 'modalUrl',
              horizontal: {
                justify: true,
                left: 2
              },
              onChange: (value: string) => {
                this.setState({modalUrl: value});
              }
            },
            {
              type: 'radios',
              name: 'modalTarget',
              label: 'Jump method',
              inline: true,
              options: [
                {
                  label: 'Expand the current page',
                  value: '_self'
                },
                {
                  label: 'Open in a new tab',
                  value: '_blank'
                }
              ],
              mode: 'horizontal',
              horizontal: {
                justify: true,
                left: 2
              },
              onChange: (value: string) => {
                this.setState({modalTarget: value});
              }
            },
            {
              type: 'input-text',
              label: 'corner content',
              placeholder: 'If empty, no corner mark will be displayed',
              mode: 'horizontal',
              name: 'modalBadge',
              horizontal: {
                justify: true,
                left: 2
              },
              onChange: (value: string) => {
                this.setState({modalBadge: value});
              }
            }
          ]
        }
      },
      {
        data: {
          modalBadge,
          modalIcon,
          modalName,
          modalParent,
          modalUrl,
          modalTarget
        },
        show: showDialog,
        onClose: this.closeModal,
        onConfirm: this.handleSubmit
      }
    );
  }

  render() {
    const {links, source, showDialog} = this.state;
    const {className} = this.props;
    return (
      <div className={cx('ae-NavControl', className)}>
        {this.renderHeader()}

        {source === 'custom' ? (
          <div className="ae-NavControl-wrapper">
            {Array.isArray(links) && links.length ? (
              <div className="ae-NavControl-content" ref={this.dragRef}>
                {this.renderNav(links)}
              </div>
            ) : (
              <div className="ae-NavControl-placeholder">No options</div>
            )}
            <div className="ae-NavControl-footer">
              <Button level="enhance" onClick={this.openModal}>
                Add a menu
              </Button>
            </div>
          </div>
        ) : (
          this.renderApiPanel()
        )}

        {this.renderDialog()}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-navSourceControl',
  renderLabel: false
})
export class NavSourceControlRenderer extends NavSourceControl {}
