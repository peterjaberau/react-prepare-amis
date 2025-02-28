/**
 * @file AddColumnModal
 * @desc Add column
 */

import {useEffect, useRef} from 'react';
import omit from 'lodash/omit';
import React, {useState, useCallback} from 'react';
import {Button, Modal, themeable, ThemeProps, utils} from '@/packages/amis/src';
import {getSchemaTpl, JSONPipeIn, EditorManager} from '@/packages/amis-editor-core/src';
import {DSFeatureType, DSFeatureEnum, ModelDSBuilderKey} from '../../builder';

import type {RendererProps, BaseApiObject} from '@/packages/amis/src';
import type {CRUDColumnControlState} from './CRUDColumnControl';
// @ts-ignore
import type {ColumnSchema} from '@/packages/amis/src/renderers/Table2';
import type {DSBuilderInterface} from '../../builder';

type InitData = Exclude<CRUDColumnControlState['addModalData'], undefined>;

interface AddColumnModalProps extends ThemeProps {
  visible: boolean;
  initData: InitData;
  ctx: Record<string, any>;
  manager: EditorManager;
  builder: DSBuilderInterface;
  render: RendererProps['render'];
  onConfirm: (scaffold: Record<string, any>) => void;
  onClose: () => void;
}

/** Form data */
interface FormData extends InitData {
  name: string;
  title: string;
  feats: Extract<DSFeatureType, 'View' | 'Edit' | 'Delete'>[];
  viewApi?: string | BaseApiObject;
  editApi?: string | BaseApiObject;
  deleteApi?: string | BaseApiObject;
  __fieldItem: Record<string, any>[];
}

const AddColumnModal: React.FC<AddColumnModalProps> = props => {
  const {
    classnames: cx,
    render,
    visible,
    initData,
    ctx,
    manager,
    builder,
    onConfirm,
    onClose
  } = props;
  const componentId = ctx?.id;
  const modalRef = useRef<any>(null);
  const formRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const handleModalConfirm = useCallback(async () => {
    const form = formRef?.current?.getWrappedInstance?.();
    let schema;
    let errorStack: any;

    setLoading(true);

    if (form) {
      try {
        schema = await form.submit?.(async (values: FormData) => {
          let scaffold;

          if (values.colType === 'field') {
            const column = await builder.buildCRUDColumn?.(
              values.__fieldItem
                ? {
                    ...values.__fieldItem,
                    checked: true
                  }
                : {
                    ...values,
                    label: values.title,
                    name: values.name,
                    displayType: 'tpl'
                  },
              {
                renderer: 'crud',
                inScaffold: false,
                schema: ctx
              },
              componentId
            );
            scaffold =
              column !== false
                ? column
                : {
                    label: values.title,
                    name: values.name
                  };
          } else if (values.colType === 'operation') {
            const fields = (ctx?.columns ?? []).map((item: ColumnSchema) => ({
              displayType: item.type ?? 'input-text',
              inputType: item.type ?? 'input-text',
              name: item.name,
              label: item.title
            }));
            scaffold = await builder.buildCRUDOpColumn?.(
              {
                renderer: 'crud',
                inScaffold: false,
                feats: values.feats,
                schema: ctx,
                scaffoldConfig: {
                  viewFields: fields,
                  editFields: fields,
                  viewApi: values?.viewApi,
                  editApi: values?.editApi,
                  deleteApi: values?.deleteApi
                },
                buildSettings: {
                  useDefaultFields: true
                }
              },
              componentId
            );
          }

          return Promise.resolve(JSONPipeIn(omit(scaffold, ['key'])));
        });
      } catch (error) {
        errorStack = error.stack;
      }
    }

    setLoading(false);

    if (!errorStack) {
      onConfirm(schema);
      onClose?.();
    } else {
      /** If the form validation fails, the Dialog will not be closed automatically */
      console.error(errorStack);
    }
  }, [onConfirm]);

  useEffect(() => {}, []);

  return (
    <React.Fragment>
      <Modal
        ref={modalRef}
        size="sm"
        show={visible}
        onHide={onClose}
        closeOnEsc={false}
        contentClassName="ae-Scaffold-Modal :AMISCSSWrapper"
      >
        <Modal.Header showCloseButton onClose={onClose}>
          <Modal.Title className="ae-Scaffold-Modal-title">添加列</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {render(
            'column-control-modal',
            {
              type: 'form',
              title: '',
              mode: 'horizontal',
              horizontal: {
                justify: true,
                leftFixed: 'sm'
              },
              submitOnChange: true,
              wrapWithPanel: false,
              clearValueOnHidden: true,
              preventEnterSubmit: true,
              actions: [],
              body: [
                {
                  type: 'input-tag',
                  name: 'colType',
                  label: 'column type',
                  static: true,
                  className: 'mb-2',
                  options: [
                    {label: 'Field column', value: 'field'},
                    {label: 'Operation column', value: 'operation'}
                  ]
                },
                ...(initData?.colType === 'field'
                  ? [
                      getSchemaTpl('formItemName', {
                        name: 'name',
                        label: 'column field',
                        required: true,
                        onBindingChange: async (
                          field: Record<string, any>,
                          onBulkChange: (value: any, submit?: boolean) => void
                        ) => {
                          onBulkChange?.(
                            {
                              name: field.value,
                              title: field.label,
                              __fieldItem: field
                            },
                            true
                          );
                          return false;
                        }
                      }),
                      {
                        name: 'title',
                        label: 'column title',
                        type: 'input-text',
                        required: true
                      }
                    ]
                  : []),
                ...(initData?.colType === 'operation'
                  ? [
                      {
                        type: 'checkboxes',
                        label: 'Data operation',
                        name: 'feats',
                        joinValues: false,
                        extractValue: true,
                        multiple: true,
                        inline: false,
                        options: [
                          {label: 'View details', value: 'View'},
                          {label: 'Edit record', value: 'Edit'},
                          {label: 'Delete record', value: 'Delete'}
                        ],
                        value: [
                          DSFeatureEnum.View,
                          DSFeatureEnum.Edit,
                          DSFeatureEnum.Delete
                        ]
                      },
                      ...(builder.key !== ModelDSBuilderKey
                        ? [
                            ...builder.makeSourceSettingForm({
                              feat: 'View',
                              renderer: 'crud',
                              inScaffold: false,
                              sourceSettings: {
                                name: 'viewApi',
                                visibleOn:
                                  "data.feats && data.feats.indexOf('View') > -1"
                              }
                            }),
                            ...builder.makeSourceSettingForm({
                              feat: 'Edit',
                              renderer: 'crud',
                              inScaffold: false,
                              sourceSettings: {
                                name: 'editApi',
                                visibleOn:
                                  "data.feats && data.feats.indexOf('Edit') > -1"
                              }
                            }),
                            ...builder.makeSourceSettingForm({
                              feat: 'Delete',
                              renderer: 'crud',
                              inScaffold: false,
                              sourceSettings: {
                                name: 'deleteApi',
                                visibleOn:
                                  "data.feats && data.feats.indexOf('Delete') > -1"
                              }
                            })
                          ].filter(Boolean)
                        : [])
                    ].filter(i => !!i)
                  : [])
              ]
            },
            {
              ref: formRef,
              popOverContainer: modalRef.current,
              disabled: loading,
              data: utils.createObject(ctx, {...initData})
            }
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>取消</Button>
          <Button
            loading={loading}
            loadingClassName={cx('ae-CRUDConfigControl-modal-btn-loading')}
            level="primary"
            onClick={handleModalConfirm}
          >
            Sure
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default themeable(AddColumnModal);
