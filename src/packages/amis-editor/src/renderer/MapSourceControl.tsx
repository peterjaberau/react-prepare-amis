/**
 * @file mapping mapping source configuration
 */

import React from 'react';
import cx from 'classnames';
import {FormItem} from 'amis';
import {autobind, getSchemaTpl, tipedLabel} from 'amis-editor-core';
import {FormControlProps, isObject} from 'amis-core';
import type {SchemaApi} from 'amis';
import debounce from 'lodash/debounce';

enum MapType {
  CUSTOM = 'custom',
  API = 'api',
  VARIABLE = 'variable'
}

export interface MapSourceControlProps extends FormControlProps {
  className?: string;
}

export interface MapSourceControlState {
  map: Object | Array<Object>;
  source: SchemaApi;
  labelField?: string;
  valueField?: string;
  mapType: MapType;
}

export default class MapSourceControl extends React.Component<
  MapSourceControlProps,
  MapSourceControlState
> {
  $comp: string; // Record the path, no longer synchronize the internal from the external, only synchronize the external from the internal

  constructor(props: MapSourceControlProps) {
    super(props);

    let mapType: MapType = MapType.CUSTOM;
    if (props.data.hasOwnProperty('source') && props.data.source) {
      mapType = /\$\{(.*?)\}/g.test(props.data.source)
        ? MapType.VARIABLE
        : MapType.API;
    }

    this.state = {
      map: props.data.map,
      source: props.data.source,
      labelField: props.data.labelField,
      valueField: props.data.valueField,
      mapType
    };
  }

  componentDidUpdate(
    prevProps: Readonly<MapSourceControlProps>,
    prevState: Readonly<MapSourceControlState>,
    snapshot?: any
  ): void {
    const isArrayOld = Array.isArray(prevProps.data?.map);
    const isArrayNew = Array.isArray(this.props.data?.map);
    // map type changed
    if (isArrayOld !== isArrayNew) {
      this.setState({
        map: this.props.data?.map
      });
    }
  }

  /**
   * Update the unified export of map fields
   */
  onChange() {
    let {mapType, source, map, labelField, valueField} = this.state;
    const {onBulkChange} = this.props;

    labelField = labelField === '' ? undefined : labelField;
    valueField = valueField === '' ? undefined : valueField;

    if (mapType === MapType.CUSTOM) {
      onBulkChange &&
        onBulkChange({
          map,
          source: undefined,
          labelField,
          valueField
        });
      return;
    }

    if ([MapType.API, MapType.VARIABLE].includes(mapType)) {
      onBulkChange &&
        onBulkChange({
          source,
          map: undefined,
          labelField,
          valueField
        });
      return;
    }
  }

  /**
   * Toggle option type
   */
  @autobind
  handleMapTypeChange(mapType: MapType) {
    this.setState(
      {
        mapType,
        labelField: undefined,
        valueField: undefined
      },
      this.onChange
    );
  }

  renderHeader() {
    const {render, label, labelRemark, useMobileUI, env, popOverContainer} =
      this.props;
    const classPrefix = env?.theme?.classPrefix;
    const {mapType} = this.state;
    const optionSourceList = (
      [
        {
          label: 'Custom options',
          value: MapType.CUSTOM
        },
        {
          label: 'External interface',
          value: MapType.API
        },
        {
          label: 'context variable',
          value: MapType.VARIABLE
        }
      ] as Array<{
        label: string;
        value: MapType;
      }>
    ).map(item => ({
      ...item,
      onClick: () => this.handleMapTypeChange(item.value)
    }));

    return (
      <header className="ae-OptionControl-header">
        <label
          className={cx(`${classPrefix}Form-label`)}
          style={{marginBottom: 0}}
        >
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
                selected: optionSourceList.find(item => item.value === mapType)!
                  .label
              }
            }
          )}
        </div>
      </header>
    );
  }

  @autobind
  handleMapChange(map: any) {
    this.setState({map}, this.onChange);
  }

  @autobind
  handleAPIChange(source: SchemaApi) {
    this.setState({source}, this.onChange);
  }

  @autobind
  handleLabelFieldChange(labelField: string) {
    this.setState({labelField}, this.onChange);
  }

  @autobind
  handleValueFieldChange(valueField: string) {
    this.setState({valueField}, this.onChange);
  }

  renderOtherFields() {
    return [
      {
        label: tipedLabel(
          'Value Matching Field',
          'When the mapping table is an array object and the object has multiple keys, the field used to match the value, the default is value'
        ),
        type: 'input-text',
        name: 'valueField',
        placeholder: 'matching field, default is value',
        onChange: this.handleValueFieldChange
      },
      {
        label: tipedLabel(
          'Display fields',
          'When the mapping table is an array object, it is used as the displayed field. To display multiple fields, please use a custom display template. The default is label'
        ),
        type: 'input-text',
        name: 'labelField',
        placeholder: 'display field, default is label',
        onChange: this.handleLabelFieldChange,
        visibleOn: '${!itemSchema}'
      }
    ];
  }

  renderApiPanel() {
    const {render} = this.props;
    const {mapType, source, labelField, valueField} = this.state;
    if (mapType === MapType.CUSTOM) {
      return null;
    }

    return render(
      'api',
      getSchemaTpl('apiControl', {
        label: 'Interface',
        name: 'source',
        mode: 'normal',
        className: 'ae-ExtendMore',
        visibleOn: 'this.autoComplete !== false',
        value: source,
        onChange: this.handleAPIChange,
        sourceType: mapType,
        footer: this.renderOtherFields()
      })
    );
  }

  renderObjectMap() {
    const {render} = this.props;
    return render(
      'objectMap',
      getSchemaTpl('combo-container', {
        label: '',
        type: 'combo',
        mode: 'normal',
        scaffold: {
          key: 'key-{index}',
          value: 'value-{index}'
        },
        required: true,
        name: 'map',
        descriptionClassName: 'help-block text-xs m-b-none',
        description:
          '<p>When the value hits the left key, display the content on the right<br />When it does not hit, display the content with the key <code>*</code> by default</div><br />(Please make sure the key value is unique)',
        multiple: true,
        pipeIn: (value: any) => {
          if (!isObject(value)) {
            return [
              {
                key: 'key0',
                value: 'value1'
              }
            ];
          }

          let arr: Array<any> = [];

          Object.keys(value).forEach(key => {
            arr.push({
              key: key || '',
              value:
                typeof value[key] === 'string'
                  ? value[key]
                  : JSON.stringify(value[key])
            });
          });
          return arr;
        },
        pipeOut: (value: any) => {
          if (!Array.isArray(value)) {
            return value;
          }
          let obj: any = {};

          value.forEach((item: any, idx: number) => {
            let key: string = item.key || '';
            let value: any = item.value;
            if (key === 'key-{index}' && value === 'value-{index}') {
              key = key.replace('-{index}', `${idx}`);
              value = value.replace('-{index}', `${idx}`);
            }
            try {
              value = JSON.parse(value);
            } catch (e) {}

            obj[key] = value;
          });

          return obj;
        },
        onChange: (value: any) => {
          this.handleMapChange(value || {'*': 'wildcard value'});
        },
        items: [
          {
            placeholder: 'Key',
            type: 'input-text',
            unique: true,
            name: 'key',
            required: true,
            columnClassName: 'w-xs'
          },

          {
            placeholder: 'content',
            type: 'input-text',
            name: 'value'
          }
        ]
      })
    );
  }

  handleMapItemChange(index: number, item: any) {
    const {map = []} = this.state;
    const newMap = (map as object[]).slice();
    try {
      item = JSON.parse(item);
    } catch (e) {}
    newMap.splice(index, 1, item);
    this.handleMapChange(newMap);
  }

  renderArrayMap() {
    const {render} = this.props;
    return (
      <div className="ae-ExtendMore">
        {render('arrayMap', [
          {
            type: 'json-editor',
            name: 'map',
            label: false,
            placeholder: 'Please keep the array member structure the same',
            onChange: (value: any, ...args: any[]) => {
              try {
                const map = JSON.parse(value);
                this.debounceMapChange(map);
              } catch (e) {
                console.error();
              }
            }
          },
          ...this.renderOtherFields()
        ])}
      </div>
    );
  }

  debounceMapChange = debounce(this.handleMapChange, 250);

  renderMap() {
    const {map} = this.state;
    if (map && Array.isArray(map)) {
      return this.renderArrayMap();
    }
    return this.renderObjectMap();
  }

  render() {
    const {mapType} = this.state;
    const {className, render} = this.props;

    return (
      <div className={cx('ae-OptionControl', className)}>
        {this.renderHeader()}
        {mapType === MapType.CUSTOM ? this.renderMap() : null}
        {mapType === MapType.API ? this.renderApiPanel() : null}
        {mapType === MapType.VARIABLE
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
  type: 'ae-mapSourceControl',
  renderLabel: false
})
export class MapSourceControlRenderer extends MapSourceControl {}
