/**
 * @file CRUDToolbarControl
 * @desc Top toolbar control
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import {FormItem, Button, Icon, toast, Spinner, autobind} from '@/packages/amis-ui/src';
import {TooltipWrapper} from '@/packages/amis-ui/src';
import {JSONPipeIn} from '@/packages/amis-editor-core/src';
import {DSFeature, DSFeatureType, DSFeatureEnum} from '../../builder';
import {traverseSchemaDeep} from '../../builder/utils';
import {deepRemove, addSchema2Toolbar} from '../../plugin/CRUD2/utils';

import type {FormControlProps} from '@/packages/amis-ui/src';
import type {EditorNodeType} from '@/packages/amis-editor-core/src';
// @ts-ignore
import type {ColumnSchema} from '@/packages/amis/src/renderers/Table2';
import type {DSBuilderInterface} from '../../builder';

type ActionValue =
  | Extract<DSFeatureType, 'Insert' | 'BulkEdit' | 'BulkDelete'>
  | 'custom';

interface Option {
  label: string;
  value: ActionValue;
  nodeId: string;
  /** Original structure */
  pristine: Record<string, any>;
  node?: EditorNodeType;
}

export interface CRUDToolbarControlProps extends FormControlProps {
  /** CRUD node ID */
  nodeId: string;
  builder: DSBuilderInterface;
}

export interface CRUDToolbarControlState {
  options: Option[];
  loading: boolean;
}

export class CRUDToolbarControl extends React.Component<
  CRUDToolbarControlProps,
  CRUDToolbarControlState
> {
  drag?: HTMLElement | null;

  dom?: HTMLElement;

  /** A collection of available functions */
  collection: ActionValue[] = [
    DSFeatureEnum.Insert,
    DSFeatureEnum.BulkEdit,
    DSFeatureEnum.BulkDelete
  ];

  constructor(props: CRUDToolbarControlProps) {
    super(props);

    this.state = {
      options: [],
      loading: false
    };
  }

  componentDidMount(): void {
    this.dom = findDOMNode(this) as HTMLElement;
    const actions = this.getActionNodes(this.props);
    this.initOptions(actions);
  }

  getActionNodes(props: CRUDToolbarControlProps) {
    const {manager, nodeId, name = 'headerToolbar'} = props;
    const store = manager.store;
    const hostNode: EditorNodeType = store.getNodeById(nodeId);
    const actionNodes: EditorNodeType[] = [];
    traverseSchemaDeep(
      pick(hostNode?.schema, name),
      (key: string, value: any, host: any) => {
        if (
          key === 'behavior' &&
          [
            DSFeatureEnum.Insert,
            DSFeatureEnum.BulkEdit,
            DSFeatureEnum.BulkDelete,
            'custom'
          ].includes(value)
        ) {
          const node = store.getNodeById(host?.$$id);

          !!node && actionNodes.push(node);
        }

        return [key, value];
      }
    );

    return actionNodes;
  }

  initOptions(actions: EditorNodeType[]) {
    if (!actions || !Array.isArray(actions) || !actions.length) {
      this.setState({options: []});
      return;
    }

    const options = actions.map(node => {
      const schema = node.schema;
      const behavior = schema.behavior as ActionValue;

      return {
        label: this.getOptionLabel(schema, behavior),
        value: behavior,
        nodeId: schema.$$id,
        node: node,
        pristine: node.schema
      };
    });

    this.setState({options});
  }

  getOptionLabel(schema: any, behavior: ActionValue) {
    return behavior === 'custom' ? schema.label : DSFeature[behavior].label;
  }

  @autobind
  handleEdit(item: Option) {
    const {manager} = this.props;

    if (!item.nodeId) {
      toast.warning(
        `The corresponding action "${item.label}" in the toolbar was not found`
      );
      return;
    }

    manager.setActiveId(item.nodeId);
  }

  /** Add columns */
  @autobind
  async handleAddAction(type: ActionValue) {
    this.setState({loading: true});
    const {
      onBulkChange,
      onChange,
      data: ctx,
      nodeId,
      manager,
      builder
    } = this.props;
    const options = this.state.options.concat();
    const node = manager.store.getNodeById(nodeId);
    const CRUDSchemaID = node?.schema?.id;
    let scaffold: any;

    switch (type) {
      case 'Insert':
        scaffold = await builder.buildInsertSchema(
          {
            feat: DSFeatureEnum.Insert,
            renderer: 'crud',
            inScaffold: false,
            schema: ctx,
            scaffoldConfig: {
              insertFields: (ctx?.columns ?? [])
                .filter((item: ColumnSchema) => item.type !== 'operation')
                .map((item: ColumnSchema) => ({
                  inputType: item.type ?? 'input-text',
                  name: item.name,
                  label: item.title
                })),
              insertApi: ''
            }
          },
          CRUDSchemaID
        );
        break;
      case 'BulkEdit':
        scaffold = await builder.buildBulkEditSchema(
          {
            feat: DSFeatureEnum.BulkEdit,
            renderer: 'crud',
            inScaffold: false,
            schema: ctx,
            scaffoldConfig: {
              bulkEditFields: (ctx?.columns ?? [])
                .filter((item: ColumnSchema) => item.type !== 'operation')
                .map((item: ColumnSchema) => ({
                  inputType: item.type ?? 'input-text',
                  name: item.name,
                  label: item.title
                })),
              bulkEdit: ''
            }
          },
          CRUDSchemaID
        );
        break;
      case 'BulkDelete':
        scaffold = await builder.buildCRUDBulkDeleteSchema(
          {
            feat: DSFeatureEnum.BulkDelete,
            renderer: 'crud',
            inScaffold: false,
            schema: ctx,
            scaffoldConfig: {
              bulkDeleteApi: ''
            }
          },
          CRUDSchemaID
        );
        break;
      default:
        scaffold = {
          type: 'button',
          label: 'button',
          behavior: 'custom',
          className: 'm-r-xs',
          onEvent: {
            click: {
              actions: []
            }
          }
        };
    }

    if (!scaffold) {
      this.setState({loading: false});
      return;
    }

    const headerToolbarSchema = cloneDeep(ctx.headerToolbar);
    const actionSchema = JSONPipeIn({...scaffold});

    options.push({
      label: this.getOptionLabel(actionSchema, type),
      value: type,
      nodeId: actionSchema.$$id,
      pristine: actionSchema
    });

    this.setState({options, loading: false}, () => {
      const fakeCRUD = {headerToolbar: headerToolbarSchema};
      /** Adaptively add action buttons to the top toolbar*/
      addSchema2Toolbar(fakeCRUD, actionSchema, 'header', 'left');
      onChange?.(fakeCRUD.headerToolbar, true, true);
    });
  }

  @autobind
  async handleDelete(option: Option, index: number) {
    const {env, data: ctx, onBulkChange, onChange} = this.props;
    const options = this.state.options.concat();
    const confirmed = await env.confirm(
      `Are you sure you want to delete "${option.label}" from the toolbar? `
    );

    const headerToolbarSchema = cloneDeep(ctx.headerToolbar);

    if (confirmed) {
      const marked = deepRemove(
        headerToolbarSchema,
        item => item.behavior === option.value
      );

      if (marked) {
        options.splice(index, 1);

        this.setState({options}, () => {
          onChange?.(headerToolbarSchema, true, true);
        });
      }
    }
  }

  @autobind
  renderOption(item: Option, index: number) {
    const {classnames: cx, popOverContainer, env} = this.props;

    return (
      <li key={index} className={cx('ae-CRUDConfigControl-list-item')}>
        <TooltipWrapper
          tooltip={{
            content: item.label,
            tooltipTheme: 'dark',
            style: {fontSize: '12px'}
          }}
          container={popOverContainer || env?.getModalContainer?.()}
          trigger={['hover']}
          delay={150}
        >
          <div className={cx('ae-CRUDConfigControl-list-item-info')}>
            <span>{item.label}</span>
          </div>
        </TooltipWrapper>

        <div className={cx('ae-CRUDConfigControl-list-item-actions')}>
          <Button
            level="link"
            size="sm"
            tooltip={{
              content: 'Go to edit',
              tooltipTheme: 'dark',
              style: {fontSize: '12px'}
            }}
            onClick={() => this.handleEdit(item)}
          >
            <Icon icon="column-setting" className="icon" />
          </Button>
          <Button
            level="link"
            size="sm"
            onClick={() => this.handleDelete(item, index)}
          >
            <Icon icon="column-delete" className="icon" />
          </Button>
        </div>
      </li>
    );
  }

  renderHeader() {
    const {classnames: cx, render, env} = this.props;
    const options = this.state.options;
    const actions = this.collection.concat();

    // options.forEach(item => {
    //   if (actions.includes(item.value)) {
    //     const idx = actions.indexOf(item.value);
    //     if (~idx) {
    //       actions.splice(idx, 1);
    //     }
    //   }
    // });

    const optionValues = options.map(item => item.value);

    return (
      <header className={cx('ae-CRUDConfigControl-header')}>
        <span className={cx('Form-label')}>Toolbar</span>
        {render('crud-toolbar-control-dropdown', {
          type: 'dropdown-button',
          closeOnClick: true,
          hideCaret: true,
          level: 'link',
          align: 'right',
          trigger: ['click'],
          popOverContainer: env.getModalContainer ?? this.dom ?? document.body,
          icon: 'column-add',
          label: 'Add operation',
          className: cx('ae-CRUDConfigControl-dropdown'),
          disabledTip: {
            content: 'No operations can be added yet',
            tooltipTheme: 'dark'
          },
          buttons: actions
            .map((item: Exclude<ActionValue, 'custom'>) => ({
              type: 'button',
              label: DSFeature[item].label,
              disabled: !!~optionValues.findIndex(op => op === item),
              onClick: () => this.handleAddAction(item)
            }))
            .concat({
              type: 'button',
              label: 'Custom button',
              disabled: false,
              onClick: () => this.handleAddAction('custom')
            })
        })}
      </header>
    );
  }

  render() {
    const {classnames: cx, data: ctx} = this.props;
    const {options, loading} = this.state;

    return (
      <div className={cx('ae-CRUDConfigControl')}>
        {loading ? (
          <Spinner
            show
            tip="Operation is being generated"
            tipPlacement="bottom"
            size="sm"
            className={cx('flex')}
          />
        ) : (
          <>
            {this.renderHeader()}
            <ul className={cx('ae-CRUDConfigControl-list')}>
              {Array.isArray(options) && options.length > 0 ? (
                options.map((item, index) => {
                  return this.renderOption(item, index);
                })
              ) : (
                <p className={cx(`ae-CRUDConfigControl-placeholder`)}>
                  No data yet
                </p>
              )}
            </ul>
          </>
        )}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-crud-toolbar-control',
  renderLabel: false,
  wrap: false
})
export class CRUDToolbarControlRenderer extends CRUDToolbarControl {}
