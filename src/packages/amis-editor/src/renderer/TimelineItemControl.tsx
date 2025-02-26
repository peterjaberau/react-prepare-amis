/**
 * @file Visual editing control for Timeline component nodes
 */
import React from 'react';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import uniqBy from 'lodash/uniqBy';
import Sortable from 'sortablejs';
import {render as amisRender, FormItem, Icon} from '@/packages/amis/src';
import {getI18nEnabled} from '@/packages/amis-editor-core/src';
import {autobind} from '@/packages/amis-editor-core/src';
import {getSchemaTpl} from '@/packages/amis-editor-core/src';
import {isExpression} from '@/packages/amis-core/src';
import type {FormControlProps} from '@/packages/amis-core/src';
import type {SchemaApi} from '@/packages/amis/src';

type TimelineItem = {
  title: string;
  time: string;
  detail?: string;
  otherConfig?: boolean;
  detailCollapsedText?: string;
  detailExpandedText?: string;
  color?: string | 'info' | 'success' | 'warning' | 'danger';
  icon?: string;
};
export interface TimelineItemProps extends FormControlProps {
  className?: string;
}

export type SourceType = 'custom' | 'api' | 'variable';
export interface TimelineItemState {
  items: Array<Partial<TimelineItem>>;
  source: SourceType;
  api: SchemaApi;
}

export default class TimelineItemControl extends React.Component<
  TimelineItemProps,
  TimelineItemState
> {
  sortable?: Sortable;
  drag?: HTMLElement | null;
  target: HTMLElement | null;

  constructor(props: TimelineItemProps) {
    super(props);
    const {source} = props.data || {};
    this.state = {
      items: props.value,
      api: source,
      source: source ? (isExpression(source) ? 'variable' : 'api') : 'custom'
    };
  }
  /**
   * Toggle option type
   */
  @autobind
  handleSourceChange(source: SourceType) {
    //Cancel invalid switching
    if (source === this.state.source) {
      return;
    }
    this.setState({source, api: '', items: []}, this.onChange);
  }

  @autobind
  handleAPIChange(source: SchemaApi) {
    this.setState({api: source}, this.onChange);
  }
  onChange() {
    const {source, items, api} = this.state;
    const {onBulkChange} = this.props;
    const data: Partial<TimelineItemProps> = {
      source: undefined,
      items: undefined
    };
    if (source === 'custom') {
      data.items = items.map(item => ({...item}));
    }
    if (source === 'api' || source === 'variable') {
      data.items = [];
      data.source = api;
    }
    onBulkChange && onBulkChange(data);
    return;
  }

  @autobind
  toggleEdit(values: TimelineItem, index: number) {
    const items = this.state.items.concat();
    items[index] = values;

    this.setState({items}, this.onChange);
  }

  toggleCopy(index: number) {
    const {items} = this.state;
    const res = items.concat(items[index]);
    this.setState({items: res}, this.onChange);
  }

  toggleDelete(index: number) {
    const items = this.state.items.concat();
    items.splice(index, 1);
    this.setState({items}, this.onChange);
  }

  handleEditLabel(index: number, value: string, attr: 'time' | 'title') {
    const items = this.state.items.concat();

    items.splice(index, 1, {...items[index], [attr]: value});
    this.setState({items}, () => this.onChange());
  }

  @autobind
  handleBatchAdd(values: {batchItems: string}, action: any) {
    const items = this.state.items.concat();

    const addedOptions: Array<Partial<TimelineItem>> = values.batchItems
      .split('\n')
      .map(option => {
        const item = option.trim();
        if (~item.indexOf(' ')) {
          let [time, title] = item.split(' ');
          return {time: time.trim(), title: title.trim()};
        }
        return {label: item, value: item};
      });
    const newOptions = uniqBy([...items, ...addedOptions], 'time');

    this.setState({items: newOptions}, () => this.onChange());
  }

  @autobind
  handleAdd(values: TimelineItem) {
    var {items} = this.state;

    const itemsTemp = items.concat({...values});
    this.setState({items: itemsTemp}, this.onChange);
  }

  buildAddOrEditSchema(props?: Partial<TimelineItem>) {
    const i18nEnabled = getI18nEnabled();
    return [
      {
        type: i18nEnabled ? 'input-text-i18n' : 'input-text',
        name: 'time',
        required: true,
        placeholder: 'Please enter the time',
        label: 'time',
        value: props?.['time']
      },
      {
        type: i18nEnabled ? 'input-text-i18n' : 'input-text',
        name: 'title',
        required: true,
        placeholder: 'Please enter a title',
        label: 'Title',
        value: props?.['title']
      },
      {
        type: 'input-color',
        name: 'color',
        value: props?.['color'],
        placeholder: 'Please enter',
        label: 'color'
      },
      getSchemaTpl('icon', {
        value: props?.['icon'],
        placeholder: 'Please enter',
        clearable: true,
        description: '',
        className: 'fix-icon-picker-overflow',
        pipeIn: (value: any) => value?.icon,
        pipeOut: (value: any) => {
          if (value) {
            return {
              type: 'icon',
              vendor: '',
              icon: value
            };
          }
          return undefined;
        }
      })
    ];
  }

  buildBatchAddSchema() {
    return {
      type: 'action',
      actionType: 'dialog',
      label: 'Batch add',
      dialog: {
        title: 'Batch add options',
        headerClassName: 'font-bold',
        closeOnEsc: true,
        closeOnOutside: false,
        showCloseButton: true,
        body: [
          {
            type: 'alert',
            level: 'warning',
            body: [
              {
                type: 'tpl',
                tpl: 'Each option is listed in a separate line, and all items with unique values ​​are added as new options;<br/>Each data is listed in a separate line, and the time and title are separated by spaces, for example: "Submit application on 2024-01-01"'
              }
            ],
            showIcon: true,
            className: 'mb-2.5'
          },
          {
            type: 'form',
            wrapWithPanel: false,
            mode: 'normal',
            wrapperComponent: 'div',
            resetAfterSubmit: true,
            autoFocus: true,
            preventEnterSubmit: true,
            horizontal: {
              left: 0,
              right: 12
            },
            body: [
              {
                name: 'batchItems',
                type: 'textarea',
                label: '',
                placeholder: 'Please enter the option content',
                trimContents: true,
                minRows: 10,
                maxRows: 50,
                required: true
              }
            ]
          }
        ]
      }
    };
  }

  buildAddSchema() {
    return {
      type: 'action',
      actionType: 'dialog',
      label: 'Add an item',
      active: true,
      dialog: {
        title: 'Node Configuration',
        headerClassName: 'font-bold',
        closeOnEsc: true,
        closeOnOutside: false,
        showCloseButton: true,
        body: [
          {
            type: 'form',
            wrapWithPanel: false,
            wrapperComponent: 'div',
            resetAfterSubmit: true,
            autoFocus: true,
            preventEnterSubmit: true,
            horizontal: {
              justify: true,
              left: 3,
              right: 9
            },
            body: this.buildAddOrEditSchema()
          }
        ]
      }
    };
  }

  @autobind
  dragRef(ref: any) {
    if (!this.drag && ref) {
      this.initDragging();
    } else if (this.drag && !ref) {
      this.destroyDragging();
    }

    this.drag = ref;
  }

  initDragging() {
    const dom = findDOMNode(this) as HTMLElement;

    this.sortable = new Sortable(
      dom.querySelector('.ae-TimelineItemControl-content') as HTMLElement,
      {
        group: 'TimelineItemControlGroup',
        animation: 150,
        handle: '.ae-TimelineItemControlItem-dragBar',
        ghostClass: 'ae-TimelineItemControlItem--dragging',
        onEnd: (e: any) => {
          // No movement
          if (e.newIndex === e.oldIndex) {
            return;
          }

          // Switch back
          const parent = e.to as HTMLElement;
          if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(
              e.item,
              parent.childNodes[
                e.oldIndex > e.newIndex ? e.oldIndex + 1 : e.oldIndex
              ]
            );
          } else {
            parent.appendChild(e.item);
          }

          const items = this.state.items.concat();

          items[e.oldIndex] = items.splice(e.newIndex, 1, items[e.oldIndex])[0];

          this.setState({items}, () => this.onChange());
        }
      }
    );
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  renderHeader() {
    const {render, label, labelRemark, useMobileUI, env, popOverContainer} =
      this.props;

    const classPrefix = env?.theme?.classPrefix;
    const {source} = this.state;
    const optionSourceList = (
      [
        {
          label: 'Custom options',
          value: 'custom'
        },
        {
          label: 'Interface acquisition',
          value: 'api'
        },
        {
          label: 'context variable',
          value: 'variable'
        }
      ] as Array<{
        label: string;
        value: 'custom' | 'api' | 'variable';
      }>
    ).map(item => ({
      ...item,
      onClick: () => this.handleSourceChange(item.value)
    }));

    return (
      <header className="ae-TimelineItemControl-header">
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

  renderOption(props: TimelineItem & {index: number}) {
    const {time, title, index} = props;
    const delDisabled = !(this.state.items.length > 2);
    const i18nEnabled = getI18nEnabled();
    return (
      <li className="ae-TimelineItemControlItem" key={index}>
        <div className="ae-TimelineItemControlItem-Main">
          <a className="ae-TimelineItemControlItem-dragBar">
            <Icon icon="drag-bar" className="icon" />
          </a>
          {/* <InputBox
            className="ae-TimelineItemControlItem-input"
            value={time}
            placeholder="Please enter the display time"
            clearable={false}
            onChange={(value: string) =>
              this.handleEditLabel(index, value, 'time')
            }
          /> */}
          {amisRender({
            type: i18nEnabled ? 'input-text-i18n' : 'input-text',
            className: 'ae-TimelineItemControlItem-input',
            value: time,
            placeholder: 'Please enter the display time',
            clearable: false,
            onChange: (value: string) =>
              this.handleEditLabel(index, value, 'time')
          })}
          {/* {amisRender(
            {
              type: "input-date",
              name: "time",
              value: time,
              className: "ae-TimelineItemControlItem-inputDate",
              label: ""
            }
          )} */}

          {amisRender(
            {
              type: 'dropdown-button',
              className: 'ae-TimelineItemControlItem-dropdown',
              btnClassName: 'px-2',
              icon: 'fa fa-ellipsis-h',
              hideCaret: true,
              closeOnClick: true,
              align: 'right',
              menuClassName: 'ae-TimelineItemControlItem-ulmenu',
              buttons: [
                {
                  type: 'action',
                  className: 'ae-TimelineItemControlItem-action',
                  label: 'Edit',
                  actionType: 'dialog',
                  dialog: {
                    title: 'Node Configuration',
                    headerClassName: 'font-bold',
                    closeOnEsc: true,
                    closeOnOutside: false,
                    showCloseButton: true,
                    body: [
                      {
                        type: 'form',
                        wrapWithPanel: false,
                        wrapperComponent: 'div',
                        resetAfterSubmit: true,
                        autoFocus: true,
                        preventEnterSubmit: true,
                        horizontal: {
                          justify: true,
                          left: 3,
                          right: 9
                        },
                        body: this.buildAddOrEditSchema(props),
                        onSubmit: (e: any) => this.toggleEdit(e, index)
                      }
                    ]
                  }
                },
                {
                  type: 'button',
                  className: 'ae-TimelineItemControlItem-action',
                  label: 'Copy',
                  onClick: () => this.toggleCopy(index)
                },
                {
                  type: 'button',
                  className: 'ae-TimelineItemControlItem-action',
                  label: 'Delete',
                  disabled: delDisabled,
                  onClick: () => this.toggleDelete(index)
                }
              ]
            },
            {
              popOverContainer: null // amis renders the mounted node and uses this.target
            }
          )}
        </div>
        <div className="ae-TimelineItemControlItem-Main">
          {/* <InputBox
            className="ae-TimelineItemControlItem-input-title"
            value={title}
            clearable={false}
            placeholder="Please enter a title"
            onChange={(value: string) =>
              this.handleEditLabel(index, value, 'title')
            }
          /> */}
          {amisRender({
            type: i18nEnabled ? 'input-text-i18n' : 'input-text',
            className: 'ae-TimelineItemControlItem-input-title',
            value: title,
            clearable: false,
            placeholder: 'Please enter a title',
            onChange: (value: string) =>
              this.handleEditLabel(index, value, 'title')
          })}
        </div>
      </li>
    );
  }

  renderApiPanel() {
    const {render} = this.props;
    const {source, api} = this.state;
    return render(
      'api',
      getSchemaTpl('apiControl', {
        label: 'Interface',
        name: 'source',
        className: 'ae-ExtendMore',
        visibleOn: 'this.autoComplete !== false',
        value: api,
        onChange: this.handleAPIChange,
        sourceType: source
      })
    );
  }

  render() {
    const {source, items} = this.state;
    const {render, className} = this.props;
    return (
      <div className={cx('ae-TimelineItemControl', className)}>
        {this.renderHeader()}

        {source === 'custom' ? (
          <div className="ae-TimelineItemControl-wrapper">
            {Array.isArray(items) && items.length ? (
              <ul className="ae-TimelineItemControl-content" ref={this.dragRef}>
                {items.map((item: TimelineItem, index: number) =>
                  this.renderOption({...item, index})
                )}
              </ul>
            ) : (
              <div className="ae-TimelineItemControl-placeholder">
                No options
              </div>
            )}

            <div className="ae-TimelineItemControl-footer">
              {amisRender(this.buildAddSchema(), {
                onSubmit: this.handleAdd
              })}
              {amisRender(this.buildBatchAddSchema(), {
                onSubmit: this.handleBatchAdd
              })}
            </div>
          </div>
        ) : null}
        {source === 'api' ? this.renderApiPanel() : null}
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

@FormItem({type: 'ae-timelineItemControl', renderLabel: false})
export class TimelineItemControlRenderer extends React.Component<TimelineItemProps> {
  render() {
    return <TimelineItemControl {...this.props} />;
  }
}
