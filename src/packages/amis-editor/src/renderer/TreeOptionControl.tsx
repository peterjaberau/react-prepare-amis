/**
 * @file component option component's visual editing control
 */

import React from 'react';
import cx from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import Sortable from 'sortablejs';
import {
  FormItem,
  Button,
  Icon,
  InputBox,
  Modal,
  toast,
  render as amisRender
} from 'amis';

import {autobind, getI18nEnabled} from '@/packages/amis-editor-core/src';
import {getSchemaTpl, tipedLabel} from '@/packages/amis-editor-core/src';

import type {Option} from 'amis';
import type {FormControlProps} from 'amis-core';
import type {SchemaApi} from 'amis';

export type OptionControlItem = Option & {checked?: boolean; _key?: string};

export interface OptionControlProps extends FormControlProps {
  className?: string;
  showIconField?: boolean; // Is there an icon field?
}

export type SourceType = 'custom' | 'api' | 'apicenter' | 'variable';

export interface OptionControlState {
  options: Array<OptionControlItem>;
  api: SchemaApi;
  labelField: string;
  valueField: string;
  iconField: string;
  source: SourceType;
  modalVisible: boolean;
}

const defaultOption: OptionControlItem = {
  label: '',
  value: ''
};

export default class TreeOptionControl extends React.Component<
  OptionControlProps,
  OptionControlState
> {
  sortables: Sortable[];
  drag?: HTMLElement | null;

  internalProps = ['checked', 'editing'];

  constructor(props: OptionControlProps) {
    super(props);
    const {source, labelField, valueField, showIconField, iconField} = {
      ...props.data
    } as any;
    this.state = {
      options: this.transformOptions(props),
      api: source,
      labelField: labelField,
      valueField: valueField,
      iconField: showIconField ? iconField : undefined,
      source: source
        ? /\$\{(.*?)\}/g.test(source)
          ? 'variable'
          : 'api'
        : 'custom',
      modalVisible: false
    };

    this.sortables = [];
  }

  transformOptions(props: OptionControlProps) {
    const {value} = props;

    if (!value || !Array.isArray(value) || !value.length) {
      return [{...defaultOption}];
    }
    return value;
  }

  /**
   * Handle the situation where value is not set
   */
  pretreatOptions(options: Array<OptionControlItem>) {
    if (!Array.isArray(options)) {
      return [];
    }
    return options.map(option => {
      if (option.children && option.children.length) {
        option.children = this.pretreatOptions(option.children);
      }
      option.value =
        option.value == null || option.value === ''
          ? option.label
          : option.value;
      return option;
    });
  }

  /**
   * Update the unified export of options field
   */
  onChange() {
    const {source, api, labelField, valueField, iconField} = this.state;
    const {onBulkChange} = this.props;
    const data: Partial<OptionControlProps> = {
      source: undefined,
      options: undefined,
      labelField: undefined,
      valueField: undefined,
      iconField: undefined
    };
    if (source === 'custom') {
      const options = this.state.options.concat();
      data.options = this.pretreatOptions(options);
    }

    if (source === 'api' || source === 'apicenter' || source === 'variable') {
      data.source = api;
      data.labelField = labelField || undefined;
      data.valueField = valueField || undefined;
      data.iconField = iconField;
    }

    onBulkChange && onBulkChange(data);
    return;
  }

  /**
   * Toggle option type
   */
  @autobind
  handleSourceChange(source: SourceType) {
    this.setState({api: '', source: source}, this.onChange);
  }

  renderHeader() {
    const {
      render,
      label,
      labelRemark,
      useMobileUI,
      env,
      popOverContainer,
      hasApiCenter
    } = this.props;
    const classPrefix = env?.theme?.classPrefix;
    const {source} = this.state;
    const optionSourceList = (
      [
        {
          label: 'Custom options',
          value: 'custom'
        },
        {
          label: 'External interface',
          value: 'api'
        },
        ...(hasApiCenter ? [{label: 'API中心', value: 'apicenter'}] : []),
        {
          label: 'context variable',
          value: 'variable'
        }
      ] as Array<{
        label: string;
        value: SourceType;
      }>
    ).map(item => ({
      ...item,
      onClick: () => this.handleSourceChange(item.value)
    }));

    return (
      <header className="ae-TreeOptionControl-header">
        <label className={cx(`${classPrefix}Form-label`)}>
          {label || ''}
          {labelRemark
            ? render('label-remark', {
                type: 'remark',
                icon: labelRemark.icon || 'warning-mark',
                tooltip: labelRemark,
                className: cx(`Form-lableRemark`, labelRemark?.className),
                useMobileUI,
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
                selected: optionSourceList.find(item => item.value === source)!
                  .label
              }
            }
          )}
        </div>
      </header>
    );
  }

  handleEditLabelOrValue(value: string, path: string, key: string) {
    const options = cloneDeep(this.state.options);
    const {path: nodePath} = this.getNodePath(path);
    set(options, `${nodePath}.${key}`, value);
    this.setState({options}, () => this.rereshBindDrag());
  }
  @autobind
  handleDelete(pathStr: string, index: number) {
    const options = cloneDeep(this.state.options);

    if (!pathStr.includes('-') && options.length === 1) {
      toast.warning('Keep at least one root node', {closeButton: true});
      return;
    }

    const path = pathStr.split('-');
    if (path.length === 1) {
      options.splice(index, 1);
    } else {
      const {parentPath} = this.getNodePath(pathStr);
      const parentNode: OptionControlItem = get(options, parentPath, {});
      parentNode?.children?.splice(index, 1);
      if (parentNode?.children?.length === 0) {
        // Remove zombie child nodes
        delete parentNode.children;
      }
      set(options, parentPath, parentNode);
    }
    this.setState({options}, () => this.rereshBindDrag());
  }
  @autobind
  getNodePath(pathStr: string) {
    let pathArr = pathStr.split('-');
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
  @autobind
  addOption(pathStr: string) {
    const options = cloneDeep(this.state.options);
    const path = pathStr.split('-');
    if (path.length === 1) {
      options.splice(+path[0] + 1, 0, {...defaultOption}); // Add to the next item
    } else {
      const index = path[path.length - 1];
      const {parentPath} = this.getNodePath(pathStr);
      const parentNode: OptionControlItem = get(options, parentPath, {});
      parentNode.children?.splice(+index + 1, 0, {...defaultOption});
      set(options, parentPath, parentNode);
    }
    this.setState({options}, () => this.rereshBindDrag());
  }
  @autobind
  addChildOption(pathStr: string) {
    if (pathStr.split('-').length >= 6) {
      toast.warning(
        'The level is too deep, it is recommended to use the [Interface Acquisition] management option',
        {
          closeButton: true
        }
      );
      return;
    }
    const options = cloneDeep(this.state.options);
    const {path} = this.getNodePath(pathStr);
    const node = get(options, path) || [];
    if (node.children) {
      node.children.push({...defaultOption});
    } else {
      node.children = [{...defaultOption}];
    }
    set(options, path, node);
    this.setState({options}, () => this.rereshBindDrag());
  }
  @autobind
  hideModal(notResetOptions?: boolean) {
    this.setState({modalVisible: false});
    if (!notResetOptions) {
      this.setState({options: this.transformOptions(this.props)});
    }
  }
  @autobind
  renderOptions(option: any, key: number, indexes: number[]): React.ReactNode {
    const {render} = this.props;
    const i18nEnabled = getI18nEnabled();
    const path = indexes.join('-');
    if (option.children && option.children.length) {
      const parent = cloneDeep(option);
      delete parent.children;
      return (
        <div
          className={cx('ae-TreeOptionControlItem-parent')}
          key={`parent${path}${key}${option.label}`}
        >
          {this.renderOptions(parent, key, indexes)}
          <div
            className={cx('ae-TreeOptionControlItem-son')}
            key={`son${path}${key}${option.label}`}
            data-level={path}
          >
            {option.children.map((option: any, key: number) => {
              return this.renderOptions(option, key, indexes.concat(key));
            })}
          </div>
        </div>
      );
    }
    return (
      <div
        className="ae-TreeOptionControlItem"
        key={`child${path}${key}${option.label}`}
        data-path={path}
      >
        <a className="ae-TreeOptionControlItem-dragBar">
          <Icon icon="drag-bar" className="icon" />
        </a>
        {i18nEnabled ? (
          amisRender({
            type: 'input-text-i18n',
            className: 'ae-TreeOptionControlItem-input-label',
            value: option.label,
            placeholder: 'option name',
            clearable: false,
            onBlur: (event: any) => {
              this.handleEditLabelOrValue(event.target.value, path, 'label');
            },
            onI18nChange: (value: string) => {
              this.handleEditLabelOrValue(value, path, 'label');
            }
          })
        ) : (
          <InputBox
            className="ae-TreeOptionControlItem-input-label"
            value={option.label}
            placeholder="option name"
            clearable={false}
            onBlur={(event: any) => {
              this.handleEditLabelOrValue(event.target.value, path, 'label');
            }}
          />
        )}
        <InputBox
          className="ae-TreeOptionControlItem-input-value"
          value={option.value}
          placeholder="option value"
          clearable={false}
          onBlur={(event: any) => {
            this.handleEditLabelOrValue(event.target.value, path, 'value');
          }}
        />
        <div className="ae-TreeOptionControlItem-btns">
          {render(
            'dropdown',
            {
              type: 'dropdown-button',
              className: 'ae-TreeOptionControlItem-dropdown fa-sm',
              btnClassName: 'px-2',
              icon: 'add',
              hideCaret: true,
              closeOnClick: true,
              trigger: 'hover',
              align: 'right',
              menuClassName: 'ae-TreeOptionControlItem-ulmenu',
              buttons: [
                {
                  type: 'button',
                  className: 'ae-OptionControlItem-action',
                  label: 'Add options',
                  onClick: () => {
                    this.addOption(path);
                  }
                },
                {
                  type: 'button',
                  className: 'ae-OptionControlItem-action',
                  label: 'Add suboption',
                  onClick: () => {
                    this.addChildOption(path);
                  }
                }
              ]
            },
            {
              popOverContainer: null // amis renders the mounted node and uses this.target
            }
          )}
          <Button
            size="sm"
            onClick={() => {
              this.handleDelete(path, key);
            }}
          >
            <Icon className="icon" icon="delete-bold-btn" />
          </Button>
        </div>
      </div>
    );
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
  rereshBindDrag() {
    if (this.drag) {
      this.destroyDragging();
      this.initDragging();
    }
  }
  initDragging() {
    const rootSortable = new Sortable(this.drag as HTMLElement, {
      group: 'TreeOptionControlGroup',
      animation: 150,
      handle: '.ae-TreeOptionControlItem-dragBar',
      ghostClass: 'ae-TreeOptionControlItem-dragging',
      onEnd: (e: any) => {
        const options = cloneDeep(this.state.options);
        const {oldIndex, newIndex} = e;
        [options[newIndex], options[oldIndex]] = [
          options[oldIndex],
          options[newIndex]
        ];
        this.setState({options}, () => this.rereshBindDrag());
      },
      onMove: (e: any) => {
        const {from, to} = e;
        // Cross-level dragging is not supported yet
        return from.dataset.level === to.dataset.level;
      }
    });
    this.sortables.push(rootSortable);
    const parents = this.drag?.querySelectorAll(
      '.ae-TreeOptionControlItem-son'
    );
    if (!parents) {
      return;
    }
    Array.from(parents).forEach((parent: HTMLElement) => {
      const sortable = new Sortable(parent, {
        group: 'TreeOptionControlGroup',
        animation: 150,
        handle: '.ae-TreeOptionControlItem-dragBar',
        ghostClass: 'ae-TreeOptionControlItem-dragging',
        // fallbackOnBody: true,
        onEnd: (e: any) => {
          const {item, oldIndex, newIndex} = e;
          const options = cloneDeep(this.state.options);
          const nodePath = item.dataset.path;
          if (!nodePath) {
            return;
          }
          const {parentPath} = this.getNodePath(nodePath);
          const children = get(options, `${parentPath}.children`) || [];
          if (children) {
            [children[oldIndex], children[newIndex]] = [
              children[newIndex],
              children[oldIndex]
            ];
            set(options, `${parentPath}.children`, children);
            this.setState({options});
          }
        },
        onMove: (e: any) => {
          const {from, to} = e;
          // Cross-level dragging is not supported yet
          return from.dataset.level === to.dataset.level;
        }
      });
      this.sortables.push(sortable);
    });
  }

  @autobind
  destroyDragging(destroyRoot?: boolean) {
    this.sortables.forEach(sortable => {
      sortable?.destroy();
    });
    this.sortables = [];
    destroyRoot && (this.drag = null);
  }
  @autobind
  renderModal() {
    const {modalVisible, options} = this.state;

    return (
      <Modal
        className="ae-TreeOptionControl-Modal"
        show={modalVisible}
        onHide={() => {
          this.hideModal();
        }}
      >
        <Modal.Header
          onClose={() => {
            this.hideModal();
          }}
        >
          Option Management
        </Modal.Header>
        <Modal.Body>
          <div className="ae-TreeOptionControl-content" ref={this.dragRef}>
            {options.map((option, key) =>
              this.renderOptions(option, key, [key])
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              this.hideModal();
            }}
          >
            Cancel
          </Button>
          <Button
            level="primary"
            onClick={() => {
              this.onChange();
              this.hideModal(true);
            }}
          >
            confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  @autobind
  handleAPIChange(source: SchemaApi) {
    this.setState({api: source}, this.onChange);
  }

  @autobind
  handleLableFieldChange(labelField: string) {
    this.setState({labelField}, this.onChange);
  }

  @autobind
  handleValueFieldChange(valueField: string, ...a: any) {
    this.setState({valueField}, this.onChange);
  }
  @autobind
  handleIconFieldChange(iconField: string) {
    this.setState({iconField}, this.onChange);
  }

  renderApiPanel() {
    const {render, showIconField = false} = this.props;
    const {source, api, labelField, valueField, iconField} = this.state;

    return render(
      'api',
      getSchemaTpl('apiControl', {
        label: 'Interface',
        name: 'source',
        className: 'ae-ExtendMore',
        visibleOn: 'this.autoComplete !== false',
        value: api,
        onChange: this.handleAPIChange,
        sourceType: source,
        footer: [
          {
            label: tipedLabel(
              'Display fields',
              'Data fields corresponding to option text, please configure multiple fields through templates'
            ),
            type: 'input-text',
            name: 'labelField',
            value: labelField,
            placeholder: 'Field corresponding to the option text',
            onChange: this.handleLableFieldChange
          },
          {
            label: 'value field',
            type: 'input-text',
            name: 'valueField',
            value: valueField,
            placeholder: 'the field corresponding to the value',
            onChange: this.handleValueFieldChange
          },
          {
            type: 'input-text',
            label: 'icon field',
            name: 'iconField',
            value: iconField,
            placeholder: 'Field corresponding to the icon',
            visible: showIconField, // This configuration exists to display the icon field
            onChange: this.handleIconFieldChange
          }
        ]
      })
    );
  }

  render() {
    const {source} = this.state;
    const {className, render} = this.props;

    return (
      <div className={cx('ae-TreeOptionControl', className)}>
        {this.renderHeader()}

        {source === 'custom' ? (
          <div className="ae-TreeOptionControl-wrapper">
            <div>
              <Button
                block={true}
                onClick={() => {
                  this.setState({
                    modalVisible: true
                  });
                }}
              >
                Option Management
              </Button>
              {this.renderModal()}
            </div>
          </div>
        ) : null}

        {source === 'api' || source === 'apicenter'
          ? this.renderApiPanel()
          : null}

        {source === 'variable'
          ? render(
              'variable',
              getSchemaTpl('sourceBindControl', {
                label: false,
                className: 'ae-ExtendMore'
              }),
              {
                onChange: this.handleAPIChange
              }
            )
          : null}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-treeOptionControl',
  renderLabel: false
})
export class TreeOptionControlRenderer extends TreeOptionControl {}
