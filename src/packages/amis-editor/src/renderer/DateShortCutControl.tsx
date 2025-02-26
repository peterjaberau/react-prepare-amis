/**
 * @file time selector shortcut key
 */
import React from 'react';
import cx from 'classnames';
import Sortable from 'sortablejs';
import {findDOMNode} from 'react-dom';
import {FormItem, Icon} from 'amis';

import {FormControlProps, Option, optionValueCompare} from '@/packages/amis-core/src';
import {BaseEventContext, getSchemaTpl} from '@/packages/amis-editor-core/src';

import {autobind} from '@/packages/amis-editor-core/src';
import {FormulaDateType} from './FormulaControl';

const DefaultValue = [
  'yesterday',
  '7daysago',
  'thismonth',
  'prevmonth',
  'prevquarter'
];

const CertainPresetShorcut = {
  today: 'Today',
  yesterday: 'yesterday',
  thisweek: 'this week',
  prevweek: 'Last week',
  thismonth: 'this month',
  prevmonth: 'Last month',
  thisquarter: 'this quarter',
  prevquarter: 'Last quarter',
  thisyear: 'this year'
};

const ModifyPresetShorcut = {
  $hoursago: 'Last n hours',
  $daysago: 'Latest n days',
  $dayslater: 'within n days',
  $weeksago: 'Last n weeks',
  $weekslater: 'within n weeks',
  $monthsago: 'Latest n months',
  $monthslater: 'within n months',
  $quartersago: 'Last n quarters',
  $quarterslater: 'within n quarters',
  $yearsago: 'Latest n years',
  $yearslater: 'Within n years'
};

export interface DateShortCutControlProps extends FormControlProps {
  className?: string;
  /**
   * Editor context data, used to obtain other fields of the Form where the field is located
   */
  context: BaseEventContext;
  certainOptions: Array<keyof typeof CertainPresetShorcut>;
  modifyOptions: Array<keyof typeof ModifyPresetShorcut>;
}

type PresetShorCutType = string;

// Completely customize the shortcut key data format for label and time calculation method
type CustomShortCutType = {
  label: string;
  startDate: string;
  endDate: string;
};

// The preset shortcut key data value format for modifiable numbers
type ModifyOptionType = {
  key: keyof typeof ModifyPresetShorcut;
  value: string;
};

enum OptionType {
  Custom = 1,
  Certain = 2,
  Modify = 3
}

interface OptionDataType {
  data: PresetShorCutType | CustomShortCutType | ModifyOptionType;
  type?: OptionType; // Custom, specific, editable number description area
}

interface DateShortCutControlState {
  options: Array<OptionDataType>;
}

const ShortCutItemWrap = (props: {
  index: number;
  children: React.ReactNode | Array<React.ReactNode>;
  handleDelete: (index: number, e: React.SyntheticEvent<any>) => void;
}) => {
  return (
    <>
      <a className={klass + 'Item-dragBar'}>
        <Icon icon="drag-bar" className="icon" />
      </a>
      <span className={klass + 'Item-content'}>{props.children}</span>
      <span
        className={klass + 'Item-close'}
        onClick={e => props.handleDelete(props.index, e)}
      >
        <Icon icon="status-close" className="icon" />
      </span>
    </>
  );
};

const klass = 'ae-DateShortCutControl';

export class DateShortCutControl extends React.PureComponent<
  DateShortCutControlProps,
  DateShortCutControlState
> {
  sortable?: Sortable;
  drag?: HTMLElement | null;
  target: HTMLElement | null;
  certainDropDownOptions: Array<Option>;
  modifyDropDownOptions: Array<Option>;

  static defaultProps: Partial<DateShortCutControlProps> = {
    label: 'Shortcut keys'
  };

  constructor(props: DateShortCutControlProps) {
    super(props);

    // Initialize the drop-down options
    const {certainOptions, modifyOptions, data} = props;
    this.certainDropDownOptions = certainOptions.map(key => ({
      label: CertainPresetShorcut[key],
      value: key
    }));
    this.modifyDropDownOptions = modifyOptions.map(key => ({
      label: ModifyPresetShorcut[key],
      value: key
    }));

    // Initialize the shortcut keys for the original component configuration
    /** The ranges attribute is deprecated after amis 3.1.0, and is compatible here*/
    let initData = data?.ranges ?? data?.shortcuts ?? DefaultValue;
    initData = Array.isArray(initData) ? initData : initData.split(',');

    this.state = {
      options: initData
        .map((item: PresetShorCutType | CustomShortCutType) => {
          if (!item) {
            return null;
          }

          // Fully customizable shortcut keys
          if (
            typeof item != 'string' &&
            item.label &&
            item.startDate &&
            item.endDate
          ) {
            return {
              type: OptionType.Custom,
              data: item
            };
          }

          // Custom shortcut keys with flexible configuration numbers provided in amis
          const arr = (item as string).match(/^([a-zA-Z]*)(\d+)([a-zA-Z]*)$/);
          if (arr) {
            return {
              data: {
                value: arr[2],
                key: `${arr[1]}$${arr[3]}`
              },
              type: OptionType.Modify
            };
          }

          // Fixed value shortcut key
          return {
            data: item,
            type: OptionType.Certain
          };
        })
        .filter(Boolean)
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

  /*
   * Scroll to the bottom
   */
  scrollToBottom() {
    this.drag &&
      this.drag?.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
  }

  /**
   * Initialize drag
   */
  initDragging() {
    const dom = findDOMNode(this) as HTMLElement;
    this.sortable = new Sortable(
      dom.querySelector(`.${klass}-content`) as HTMLElement,
      {
        group: 'OptionControlGroup',
        animation: 150,
        handle: `.${klass}Item-dragBar`,
        ghostClass: `${klass}Item-dragging`,
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

          const options = this.state.options.concat();
          // options[e.oldIndex] = options.splice(
          // e.newIndex,
          //   1,
          //   options[e.oldIndex]
          // )[0];
          options.splice(e.newIndex, 0, options.splice(e.oldIndex, 1)[0]);
          this.setState({options}, () => this.onChangeOptions());
        }
      }
    );
  }

  /**
   * Destroy the drag
   */
  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  /**
   * Generate shortcut key configuration
   */
  renderOption(option: OptionDataType, index: number) {
    const {render, data: schema} = this.props;

    if (option.type === OptionType.Certain) {
      return (
        <span className={klass + 'Item-content-label'}>
          {
            CertainPresetShorcut[
              option.data as keyof typeof CertainPresetShorcut
            ]
          }
        </span>
      );
    }

    if (option.type === OptionType.Custom) {
      const data = option?.data as CustomShortCutType;
      return render(
        'inner',
        {
          type: 'form',
          wrapWithPanel: false,
          body: [
            {
              type: 'input-text',
              mode: 'normal',
              placeholder: 'Shortcut key name',
              name: 'label'
            },
            getSchemaTpl('valueFormula', {
              name: 'startDate',
              header: 'expression or relative value',
              DateTimeType: FormulaDateType.IsDate,
              rendererSchema: {
                ...schema,
                type: 'input-date'
              },
              placeholder: 'Start time',
              needDeleteProps: [
                'ranges',
                'shortcuts',
                'maxDate',
                'id',
                'minDuration'
              ],
              label: false
            }),
            getSchemaTpl('valueFormula', {
              name: 'endDate',
              header: 'expression or relative value',
              DateTimeType: FormulaDateType.IsDate,
              rendererSchema: {
                ...schema,
                type: 'input-date'
              },
              placeholder: 'end time',
              needDeleteProps: [
                'ranges',
                'shortcuts',
                'maxDate',
                'id',
                'minDuration'
              ],
              label: false
            })
          ],
          onChange: (value: CustomShortCutType) => {
            this.handleOptionChange(value, index);
          }
        },
        {
          data
        }
      );
    }

    const key = (option.data as ModifyOptionType)
      .key as keyof typeof ModifyPresetShorcut;

    const label = ModifyPresetShorcut[key]?.split('n') || [];

    return render(
      'inner',
      {
        type: 'form',
        wrapWithPanel: false,
        body: [
          {
            name: 'value',
            type: 'input-text',
            prefix: label[0] || undefined,
            suffix: label[1] || undefined,
            mode: 'normal',
            placeholder: 'n'
          }
        ],
        onChange: (value: ModifyOptionType) =>
          this.handleOptionChange(value, index)
      },
      {
        data: option.data
      }
    );
  }

  /**
   * Generate content body
   */
  renderContent() {
    const {options} = this.state;

    return (
      <div className={klass + '-wrapper'}>
        {options && options.length ? (
          <ul className={klass + '-content'} ref={this.dragRef}>
            {options.map((option, index) => (
              <li className={klass + 'Item'} key={index}>
                <ShortCutItemWrap
                  index={index}
                  handleDelete={this.handleDelete}
                >
                  {this.renderOption(option, index)}
                </ShortCutItemWrap>
              </li>
            ))}
          </ul>
        ) : (
          <div className={klass + '-content ' + klass + '-empty'}>
            Not configured
          </div>
        )}
      </div>
    );
  }

  /**
   * Custom span changes
   */
  handleOptionChange(
    data: string | CustomShortCutType | ModifyOptionType,
    index: number
  ) {
    const options = [...this.state.options];
    options[index].data = data;
    this.setState({options}, () => this.onChangeOptions());
  }

  /**
   * option added
   */
  addItem(item: Option, type: OptionType) {
    this.setState(
      {
        options: this.state.options.concat({
          type,
          data:
            type === OptionType.Certain
              ? item.value
              : type === OptionType.Modify
              ? {key: item.value, value: undefined}
              : {label: undefined, startDate: undefined, endDate: undefined}
        })
      },
      () => {
        this.onChangeOptions();
        this.scrollToBottom();
      }
    );
  }

  /**
   * Delete option
   */
  @autobind
  handleDelete(index: number, e: React.UIEvent<any>) {
    const options = this.state.options.concat();
    options.splice(index, 1);
    this.setState({options}, () => this.onChangeOptions());
  }

  /**
   * Update the unified export of options field
   */
  onChangeOptions() {
    const {options} = this.state;
    const {onBulkChange, name} = this.props;
    const newRanges: Array<string | CustomShortCutType> = [];

    options.forEach(item => {
      if (item.type === OptionType.Certain) {
        newRanges.push(item.data as string);
      }

      if (item.type === OptionType.Modify) {
        let data = item.data as ModifyOptionType;
        let value = data.value;
        /^\d+$/.test(value) && newRanges.push(data.key.replace('$', value));
      }

      if (item.type === OptionType.Custom) {
        let data = item.data as CustomShortCutType;
        data.label &&
          data.startDate &&
          data.endDate &&
          newRanges.push({...data});
      }
    });

    /** The ranges attribute is deprecated after amis 3.1.0*/
    onBulkChange &&
      onBulkChange({[name ?? 'shortcuts']: newRanges, ranges: undefined});
  }

  render() {
    const {className, label, render} = this.props;
    return (
      <div className={cx(klass, className)}>
        <header className={klass + '-header'}>
          <label>{label}</label>
        </header>
        {this.renderContent()}
        <div className={klass + '-footer'}>
          <div className={klass + '-footer-btn'}>
            {render(
              'inner',
              {
                type: 'dropdown-button',
                label: 'Common span',
                closeOnClick: true,
                closeOnOutside: true,
                level: 'enhance',
                buttons: this.certainDropDownOptions.map((item: any) => ({
                  ...item,
                  type: 'button',
                  onAction: (e: React.MouseEvent, action: any) =>
                    this.addItem(item, OptionType.Certain)
                }))
              },
              {
                popOverContainer: null
              }
            )}
          </div>
          <div className={klass + '-footer-btn'}>
            {render(
              'inner',
              {
                type: 'dropdown-button',
                label: 'Custom span',
                closeOnClick: true,
                closeOnOutside: true,
                buttons: this.modifyDropDownOptions
                  .map((item: any) => ({
                    ...item,
                    type: 'button',
                    onAction: (e: React.MouseEvent, action: any) =>
                      this.addItem(item, OptionType.Modify)
                  }))
                  .concat([
                    {
                      type: 'button',
                      label: 'Other',
                      onAction: (e: React.MouseEvent, action: any) =>
                        this.addItem(
                          {
                            value: {
                              label: undefined,
                              startDate: undefined,
                              endData: undefined
                            }
                          },
                          OptionType.Custom
                        )
                    }
                  ])
              },
              {
                popOverContainer: null
              }
            )}
          </div>
        </div>
      </div>
    );
  }
}

@FormItem({
  type: klass,
  renderLabel: false
})
export class DateShortCutControlRender extends DateShortCutControl {}
