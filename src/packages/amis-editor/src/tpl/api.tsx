import {
  setSchemaTpl,
  getSchemaTpl,
  tipedLabel,
  BaseEventContext
} from 'amis-editor-core';
import React from 'react';
import {buildApi, Html} from 'amis';
import get from 'lodash/get';

setSchemaTpl('source', (patch: any = {}) => {
  return getSchemaTpl('apiControl', {
    name: 'source',
    label: 'Get options interface',
    description:
      'You can get dynamic options through the interface and pull all at once.',
    sampleBuilder: () =>
      JSON.stringify(
        {
          status: 0,
          msg: '',
          data: {
            options: [
              {
                label: 'Option A',
                value: 'a'
              },

              {
                label: 'Option B',
                value: 'b'
              }
            ]
          }
        },
        null,
        2
      ),
    ...patch
  });
});

setSchemaTpl('apiString', {
  name: 'api',
  type: 'input-text',
  placeholder: 'http://'
});

setSchemaTpl(
  'initFetch',
  (overrides: {visibleOn?: string; name?: string} = {}) => {
    const visibleOn = get(overrides, 'visibleOn', 'this.initApi');
    const fieldName = get(overrides, 'name', 'initFetch');
    const label = get(overrides, 'label', 'Whether to load initially');

    return {
      type: 'group',
      label: tipedLabel(
        label,
        'After configuring the initialization interface, the component will initially pull the interface data, which can be modified through the following configuration.'
      ),
      visibleOn,
      direction: 'vertical',
      body: [
        {
          name: fieldName,
          type: 'radios',
          inline: true,
          value: false,
          // pipeIn: (value:any) => typeof value === 'boolean' ? value : '1'
          options: [
            {label: 'yes', value: true},
            {label: 'no', value: false},
            {label: 'expression', value: ''}
          ]
        },

        getSchemaTpl('valueFormula', {
          label: '',
          name: `${fieldName}On`,
          autoComplete: false,
          visibleOn: `typeof this.${fieldName} !== "boolean"`,
          placeholder:
            'For example: this.id means initial loading when there is an id value',
          className: 'm-t-n-sm'
        })
        // {
        //   name: `${fieldName}On`,
        //   autoComplete: false,
        //   visibleOn: `typeof this.${fieldName} !== "boolean"`,
        //   type: 'input-text',
        // placeholder: 'For example: this.id means initial loading when there is an id value',
        //   className: 'm-t-n-sm'
        // }
      ]
    };
  }
);

setSchemaTpl('proxy', {
  type: 'switch',
  label: 'Backend proxy',
  name: 'proxy',
  mode: 'horizontal',
  horizontal: {
    justify: true,
    left: 8
  },
  inputClassName: 'is-inline'
});

setSchemaTpl('apiControl', (patch: any = {}) => {
  const {name, label, value, description, sampleBuilder, apiDesc, ...rest} =
    patch;

  return {
    type: 'ae-apiControl',
    label,
    name: name || 'api',
    description,
    labelRemark: sampleBuilder
      ? {
          label: false,
          title: 'Interface return example',
          icon: 'fas fa-code',
          className: 'm-l-xs ae-ApiSample-icon',
          tooltipClassName: 'ae-ApiSample-tooltip',
          children: (data: any) => (
            <Html
              className="ae-ApiSample"
              inline={false}
              html={`
                  <pre><code>${sampleBuilder(data)}</code></pre>
                  `}
            />
          ),
          trigger: 'click',
          rootClose: true,
          placement: 'left'
        }
      : undefined,
    ...rest
  };
});

setSchemaTpl(
  'interval',
  (config?: {
    switchMoreConfig?: any;
    formItems?: any[];
    intervalConfig?: any;
  }) => ({
    type: 'ae-switch-more',
    label: 'Timed refresh',
    name: 'interval',
    formType: 'extend',
    bulk: true,
    mode: 'normal',
    form: {
      body: [
        getSchemaTpl('withUnit', {
          label: 'Refresh interval',
          name: 'interval',
          control: {
            type: 'input-number',
            name: 'interval',
            value: 1000
          },
          unit: 'milliseconds',
          ...((config && config.intervalConfig) || {})
        }),
        ...((config && config.formItems) || [])
      ]
    },
    ...((config && config.switchMoreConfig) || {})
  })
);

setSchemaTpl('silentPolling', () =>
  getSchemaTpl('switch', {
    label: tipedLabel(
      'Silent refresh',
      'Set whether to display loading when automatically refreshing'
    ),
    name: 'silentPolling',
    visibleOn: '!!this.interval'
  })
);

setSchemaTpl('stopAutoRefreshWhen', (extra: any = {}) =>
  getSchemaTpl('valueFormula', {
    name: 'stopAutoRefreshWhen',
    label: tipedLabel(
      'Stop timed refresh',
      'Once the timed refresh is set, it will continue to refresh unless an expression is given. When the condition is met, the refresh will stop.'
    ),
    visibleOn: '!!this.interval',
    ...extra
  })
);

/**
 * Interface controls
 */
setSchemaTpl('actionApiControl', (patch: any = {}) => {
  const {name, label, value, description, sampleBuilder, ...rest} = patch;

  return {
    type: 'ae-actionApiControl',
    label,
    name,
    description,
    mode: 'normal',
    labelRemark: sampleBuilder
      ? {
          icon: '',
          label: 'Example',
          title: 'Interface return example',
          tooltipClassName: 'ae-ApiSample-tooltip',
          children: (data: any) => (
            <Html
              className="ae-ApiSample"
              inline={false}
              html={`
                    <pre><code>${sampleBuilder(data)}</code></pre>
                    `}
            />
          ),
          trigger: 'click',
          className: 'm-l-xs',
          rootClose: true,
          placement: 'left'
        }
      : undefined,
    ...rest
  };
});

const enum LoadingOption {
  HIDDEN,
  MERGE,
  GLOBAL
}

setSchemaTpl(
  'loadingConfig',
  (patch: any, {context}: {context: BaseEventContext}) => {
    let globalSelector = '';
    let parent = context.node.parent;

    while (parent && !globalSelector) {
      const parentNodeType = parent.type;

      if (parentNodeType === 'dialog' || parentNodeType === 'drawer') {
        globalSelector = '[role=dialog-body]';
      } else if (parentNodeType === 'page') {
        globalSelector = '[role=page-body]';
      }

      parent = parent.parent;
    }

    return {
      name: 'loadingConfig',
      type: 'select',
      label: 'Load settings',
      options: [
        {
          label: 'Merge to upper loading',
          value: LoadingOption.MERGE
        },
        {
          label: 'Do not display loading',
          value: LoadingOption.HIDDEN
        },
        {
          label: 'Use page global loading',
          value: LoadingOption.GLOBAL
        }
      ],
      ...patch,
      pipeOut: (value: LoadingOption) => {
        switch (value) {
          case LoadingOption.HIDDEN:
            return {
              show: false
            };
          case LoadingOption.GLOBAL:
            return {
              show: true,
              root: globalSelector
            };
          case LoadingOption.MERGE:
            return {
              show: true
            };
          default:
            return {};
        }
      },
      pipeIn: (value: any = {}) => {
        if (value.root) {
          return LoadingOption.GLOBAL;
        }
        if (value.show === false) {
          return LoadingOption.HIDDEN;
        }
        return LoadingOption.MERGE;
      }
    };
  }
);
