/**
 * @file basic control collection
 */

import flatten from 'lodash/flatten';
import {NO_SUPPORT_STATIC_FORMITEM_CMPTS} from '../renderer/event-control/constants';
import {getEventControlConfig} from '../renderer/event-control/helper';
import {getSchemaTpl, isObject, tipedLabel} from '@/packages/amis-editor-core/src';
import type {BaseEventContext} from '@/packages/amis-editor-core/src';
import {getRendererByName} from 'amis-core';

//Default action
export const BUTTON_DEFAULT_ACTION = {
  onEvent: {
    click: {
      actions: []
    }
  }
};

export type PrimitiveType = string | number | boolean;
/**
 * Check Item
 * Array items are ValidationType or object configuration
 * Object form configuration rules match the isShow form first, then the isHidden form
 * as follows:
 */
export type ValidationOptions = Array<{
  option: string;
  isShow?: {
    // Match the conditions to display the check item
    [key: string]: PrimitiveType | Array<PrimitiveType>;
  };
  isHidden?: {
    // Matching conditions hide the check item
    [key: string]: PrimitiveType | Array<PrimitiveType>;
  };
}>;

export type FormItemControlPanel =
  | 'property'
  | 'common'
  | 'option'
  | 'status'
  | 'validation'
  | 'style'
  | 'option'
  | 'event';

/**
 * Label Tips
 * Supports passing in Schema or String. If you pass in String, the default configuration is used, as follows:
 *
 * @default
 * ```
 * className: 'ae-BaseRemark',
 * icon: 'fa fa-question-circle',
 * trigger: ['hover', 'click'],
 * placement: 'left'
 * ```
 */
export const BaseLabelMark = (schema: Record<string, any> | string) => {
  const base = {
    className: 'ae-BaseRemark',
    icon: 'fa fa-question-circle',
    trigger: ['hover', 'click'],
    placement: 'left',
    content: ''
  };

  if (!isObject(schema) || typeof schema === 'string') {
    return schema ? {...base, content: schema.toString()} : undefined;
  }

  const {className, content, ...rest} = schema;

  return content
    ? {
        ...base,
        ...rest,
        ...(className
          ? {className: `${base.className} ${rest.className}`}
          : {}),
        content
      }
    : undefined;
};

const normalizCollapsedGroup = (publicProps = {}, body: any) => {
  return body
    ? Array.isArray(body)
      ? body
          .filter(item => item)
          .map((item, index) => ({
            ...publicProps,
            key: item.key || index.toString(),
            ...item,
            body: flatten(item.body)
          }))
      : [
          {
            ...publicProps,
            key: '0',
            ...body
          }
        ]
    : [];
};

/**
 * Update/normalize form items
 *
 * @param defaultBody default configuration
 * @param body input configuration
 * @param replace whether to completely replace
 * @returns
 */
const normalizeBodySchema = (
  defaultBody: Array<Record<string, any>>,
  body: Array<Record<string, any>> | Record<string, any>,
  replace: boolean = false,
  reverse: boolean = false,
  order: Record<string, number> = {}
) => {
  const normalizedBody = body
    ? Array.isArray(body)
      ? body.concat()
      : [body]
    : [];
  const schema = flatten(
    replace
      ? normalizedBody
      : reverse
      ? [...normalizedBody, ...defaultBody]
      : [...defaultBody, ...normalizedBody]
  );

  return schema;
};

/**
 * Form Item Component Panel
 *
 * @param {Object=} panels
 * @param {string=} key
 * `property` attributes
 * `common` basics
 * `status` status
 * `validation`
 * `style` style
 * `event` events
 * @param {string=} panels.body - configure panel Schema
 * @param {boolean=} panels.replace - whether to completely replace the default Schema, the default is to append
 * @param {Array} panels.validation.validationType - the default validation type displayed
 */
export const formItemControl: (
  panels: Partial<
    Record<
      FormItemControlPanel,
      {
        /**
         * Title
         */
        title?: string;

        /**
         * Configuration item content
         */
        body?: any;

        /**
         * Whether to completely replace the default configuration items
         */
        replace?: boolean;

        /**
         * Configuration items are arranged in descending order
         */
        reverse?: boolean;

        /**
         * Whether to hide the panel
         */
        hidden?: boolean;

        /**
         * Configuration item sorting priority
         */
        order?: Record<string, number>;

        /**
         * Default supported validation rules
         */
        validationType?: ValidationOptions;
      }
    >
  >,
  context?: BaseEventContext
) => Array<any> = (panels, context) => {
  const type = context?.schema?.type || '';
  const render = getRendererByName(type);
  const supportStatic =
    !!render?.isFormItem && !NO_SUPPORT_STATIC_FORMITEM_CMPTS.includes(type);
  const collapseProps = {
    type: 'collapse',
    headingClassName: 'ae-formItemControl-header ae-Collapse-header',
    bodyClassName: 'ae-formItemControl-body'
  };
  // Already configured properties
  const propsList = Object.keys(context?.schema ?? {});
  // Option panel content, only components that support Option will display this panel
  const optionBody = normalizeBodySchema(
    [],
    panels?.option?.body,
    panels?.option?.replace
  );
  // Property panel configuration
  const collapseGroupBody = panels?.property
    ? normalizCollapsedGroup(collapseProps, panels?.property)
    : [
        {
          ...collapseProps,
          header: 'Basic',
          key: 'common',
          body: normalizeBodySchema(
            [
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description')
            ],
            panels?.common?.body,
            panels?.common?.replace,
            panels?.common?.reverse
          )
        },
        ...(optionBody.length !== 0
          ? [
              {
                ...collapseProps,
                header: panels?.option?.title || 'Options',
                key: 'option',
                body: optionBody
              }
            ]
          : []),
        {
          ...collapseProps,
          header: 'status',
          key: 'status',
          body: normalizeBodySchema(
            [
              getSchemaTpl('visible'),
              getSchemaTpl('hidden'),
              getSchemaTpl('clearValueOnHidden'),
              supportStatic ? getSchemaTpl('static') : null,
              // TODO: Only some of the form items below are available. Check whether it is a form item.
              getSchemaTpl('disabled')
            ],
            panels?.status?.body,
            panels?.status?.replace,
            panels?.status?.reverse
          )
        }
        // ...(panels?.validation?.hidden
        //   ? []
        //   : [
        //       {
        //         ...collapseProps,
        //         className: 'ae-ValidationControl-Panel',
        // header: 'check',
        //         key: 'validation',
        //         body: normalizeBodySchema(
        //           [
        //             getSchemaTpl(
        //               'validationControl',
        //               panels?.validation?.validationType
        //             ),
        //             getSchemaTpl('validateOnChange'),
        //             getSchemaTpl('submitOnChange')
        //           ],
        //           panels?.validation?.body,
        //           panels?.validation?.replace,
        //           panels?.validation?.reverse
        //         )
        //       }
        //     ])
      ];
  return [
    {
      type: 'tabs',
      tabsMode: 'line',
      className: 'editor-prop-config-tabs',
      linksClassName: 'editor-prop-config-tabs-links',
      contentClassName: 'no-border editor-prop-config-tabs-cont',
      tabs: [
        {
          title: 'Attributes',
          className: 'p-none',
          body: [
            {
              type: 'collapse-group',
              expandIconPosition: 'right',
              expandIcon: {
                type: 'icon',
                icon: 'chevron-right'
              },
              className: 'ae-formItemControl',
              activeKey: collapseGroupBody.map((group, index) => group.key),
              body: collapseGroupBody
            }
          ]
        },
        {
          title: 'Appearance',
          body: normalizeBodySchema(
            [
              getSchemaTpl('formItemMode'),
              getSchemaTpl('horizontalMode'),
              getSchemaTpl('horizontal', {
                label: '',
                visibleOn:
                  'this.mode == "horizontal" && this.label !== false && this.horizontal'
              }),
              // renderer.sizeMutable !== false
              //   ? getSchemaTpl('formItemSize')
              //   : null,
              getSchemaTpl('formItemInline'),
              getSchemaTpl('className'),
              getSchemaTpl('className', {
                label: 'Label CSS class name',
                name: 'labelClassName'
              }),
              getSchemaTpl('className', {
                label: 'Control CSS class name',
                name: 'inputClassName'
              }),
              getSchemaTpl('className', {
                label: 'Description CSS class name',
                name: 'descriptionClassName',
                visibleOn: 'this.description'
              }),
              ...(!supportStatic
                ? []
                : [
                    getSchemaTpl('className', {
                      label: 'Static CSS class name',
                      name: 'staticClassName'
                    })
                  ])
            ],
            panels?.style?.body,
            panels?.style?.replace,
            panels?.style?.reverse
          )
        },
        ...(isObject(context) && !panels?.event?.hidden
          ? [
              {
                title: 'Event',
                className: 'p-none',
                body: normalizeBodySchema(
                  [
                    getSchemaTpl('eventControl', {
                      name: 'onEvent',
                      ...getEventControlConfig(
                        context!.info.plugin.manager,
                        context!
                      )
                    })
                  ],
                  panels?.event?.body,
                  panels?.event?.replace
                )
              }
            ]
          : [])
      ]
    }
  ];
};

/**
 * Information prompt component template
 */
export function remarkTpl(config: {
  name: 'remark' | 'labelRemark';
  label: string;
  labelRemark?: string;
  i18nEnabled?: boolean;
}) {
  return {
    type: 'ae-switch-more',
    formType: 'dialog',
    className: 'ae-switch-more-flex',
    label: config.labelRemark
      ? tipedLabel(config.label, config.labelRemark)
      : config.label,
    bulk: false,
    name: config.name,
    defaultData: {
      icon: 'fa fa-question-circle',
      trigger: ['hover'],
      className: 'Remark--warning',
      placement: 'top'
    },
    form: {
      size: 'md',
      className: 'mb-8',
      mode: 'horizontal',
      horizontal: {
        left: 4,
        right: 8,
        justify: true
      },
      body: {
        type: 'grid',
        className: 'pt-4 right-panel-pop :AMISCSSWrapper',
        gap: 'lg',
        columns: [
          {
            md: '6',
            body: [
              {
                name: 'title',
                type: !config.i18nEnabled ? 'input-text' : 'input-text-i18n',
                label: 'prompt title',
                placeholder: 'Please enter the prompt title'
              },
              {
                name: 'content',
                type: !config.i18nEnabled ? 'textarea' : 'textarea-i18n',
                label: 'Content'
              }
            ]
          },
          {
            md: '6',
            body: [
              {
                name: 'placement',
                type: 'button-group-select',
                size: 'md',
                label: 'Popup location',
                options: [
                  {
                    label: 'up',
                    value: 'top'
                  },
                  {
                    label: 'Next',
                    value: 'bottom'
                  },
                  {
                    label: 'Left',
                    value: 'left'
                  },

                  {
                    label: 'Right',
                    value: 'right'
                  }
                ]
              },
              getSchemaTpl('icon'),
              {
                name: 'className',
                label: tipedLabel(
                  'CSS class name',
                  'What are the auxiliary CSS class names? Please go to <a href="https://baidu.gitee.io/amis/zh-CN/style/index" target="_blank">Style Description</a>, in addition you can add custom class names, and then add custom styles in the system configuration.'
                ),
                type: 'input-text'
              },
              {
                name: 'trigger',
                type: 'select',
                label: tipedLabel(
                  'Trigger mode',
                  'The default value of the floating layer trigger mode is mouse hover'
                ),
                multiple: true,
                pipeIn: (value: any) =>
                  Array.isArray(value) ? value.join(',') : [],
                pipeOut: (value: any) =>
                  value && value.length ? value.split(',') : ['hover'],
                options: [
                  {
                    label: 'Mouse hover',
                    value: 'hover'
                  },
                  {
                    label: 'click',
                    value: 'click'
                  }
                ]
              },
              {
                name: 'rootClose',
                visibleOn: '~this.trigger.indexOf("click")',
                label: 'Click blank to close',
                type: 'switch',
                mode: 'row',
                inputClassName: 'inline-flex justify-between flex-row-reverse'
              }
            ]
          }
        ]
      }
    }
  };
}
