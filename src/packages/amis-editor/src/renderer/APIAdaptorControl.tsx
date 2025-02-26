/**
 * @file API adapter
 */

import React from 'react';
import cx from 'classnames';
import {autobind, getSchemaTpl, setSchemaTpl} from '@/packages/amis-editor-core/src';
import {tipedLabel} from '@/packages/amis-editor-core/src';
import {FormControlProps} from '@/packages/amis-core/src';
import {FormItem, Icon, TooltipWrapper} from '@/packages/amis/src';
// @ts-ignore
import {TooltipObject} from '@/packages/amis-ui/src/components/TooltipWrapper';

interface AdaptorFuncParam {
  label: string;
  tip?: string | TooltipObject;
}

export interface APIAdaptorControlProps extends FormControlProps {
  /**
   * Adapter function parameters
   */
  params?: AdaptorFuncParam[];
  /**
   * Reuse adapter function parameter prompt
   */
  mergeParams?: (params: AdaptorFuncParam[]) => AdaptorFuncParam[];
  /**
   * description at the bottom of the code editor
   */
  editorDesc?: any;
  /**
   * Code that needs to be preset when the code editor is opened
   */
  defaultCode?: string;
  /**
   * placeHolder opened by the code editor
   */
  editorPlaceholder?: string;
  /**
   * The tip next to the right side of the switch
   */
  switchTip?: string | React.ReactNode;
  /**
   * Custom prompt parameters
   */
  tooltipProps?: TooltipObject;
}

export interface APIAdaptorControlState {
  switch: boolean;
}

export default class APIAdaptorControl extends React.Component<
  APIAdaptorControlProps,
  APIAdaptorControlState
> {
  static defaultProps: Pick<APIAdaptorControlProps, 'params'> = {
    params: []
  };

  constructor(props: APIAdaptorControlProps) {
    super(props);
    this.state = {
      switch: !!this.props.value
    };
  }

  @autobind
  onChange(value: any = '') {
    this.props.onChange?.(value);
  }

  // Generate tooltip parameters
  genTooltipProps(content: any, othersProps?: TooltipObject) {
    const {render} = this.props;
    return {
      tooltipTheme: 'light',
      trigger: 'hover',
      rootClose: true,
      placement: 'top',
      tooltipClassName: 'ae-AdaptorControl-desc-tooltip',
      ...(typeof content === 'string'
        ? {content}
        : {
            content: ' ', // Amis defect, this field must be present, otherwise it will not be displayed
            children: () =>
              React.isValidElement(content)
                ? content
                : render('content', content)
          }),
      ...(this.props.tooltipProps || {}),
      ...(othersProps || {})
    };
  }

  renderEditor() {
    if (!this.state.switch) {
      return null;
    }

    const {
      render,
      params = [],
      allowFullscreen,
      value,
      editorPlaceholder,
      editorDesc,
      mergeParams,
      mode
    } = this.props;

    return (
      <>
        {render(
          'api-adaptor-control-editor',
          {
            type: 'ae-functionEditorControl',
            name: 'functionEditorControl',
            placeholder: editorPlaceholder,
            desc: editorDesc,
            allowFullscreen,
            params,
            mode: mode || 'normal'
          },
          {
            value,
            mergeParams,
            onChange: this.onChange
          }
        )}
      </>
    );
  }

  renderSwitch() {
    const {render, defaultCode = '', switchTip, name, value} = this.props;
    return render('api-adaptor-control-switch', {
      type: 'flex',
      className: 'mb-2',
      alignItems: 'center',
      direction: 'row',
      justify: 'flex-start',
      items: [
        {
          type: 'switch',
          label: '',
          mode: 'inline',
          name: '__editorSwitch_' + name,
          key: 'switch',
          className: 'mb-1',
          value: this.state.switch,
          onChange: (checked: any) => {
            this.setState({switch: checked}, () => {
              this.onChange(!checked ? '' : value || defaultCode);
            });
          }
        },
        ...(switchTip
          ? [
              <TooltipWrapper
                key="TooltipWrapper"
                tooltip={
                  this.genTooltipProps(switchTip, {
                    placement: 'right'
                  }) as any
                }
              >
                <span className="leading-3 cursor-pointer">
                  <Icon icon="editor-help" className="icon" color="#84868c" />
                </span>
              </TooltipWrapper>
            ]
          : [])
      ]
    });
  }

  render() {
    const {className} = this.props;

    return (
      <div className={cx('ae-ApiAdaptorControl', className)}>
        {this.renderSwitch()}
        {this.renderEditor()}
      </div>
    );
  }
}
@FormItem({
  type: 'ae-apiAdaptorControl'
})
export class APIAdaptorControlRenderer extends APIAdaptorControl {}

/**
 * Render code highlight nodes
 * @param code code string
 * @param size The width and height of the rendering area. The code area is rendered asynchronously, so the calculation will be offset when the tooltip is used.
 * @returns
 */
export const genCodeSchema = (code: string, size?: string[]) => ({
  type: 'container',
  ...(!size
    ? {}
    : {
        style: {
          width: size[0],
          height: size[1]
        }
      }),
  body: {
    type: 'code',
    language: 'typescript',
    className: 'bg-white text-xs m-0',
    value: code
  }
});

// Request adapter sample code
export const requestAdaptorDefaultCode = `api.data.count = api.data.count + 1;
return api;`;

//Adapter adapter api parameter description
export const adaptorApiStruct = `{
  url: string; // Current interface address
  method: 'get' | 'post' | 'put' | 'delete';
  data?: Object; // request body
  headers?: Object; // Request headers
  ...
}`;

//Adapter adapter context parameter description
export const adaptorContextStruct = `{
  // Context data
  [key: string]: any;
}`;

export const adaptorApiStructTooltip = genCodeSchema(adaptorApiStruct, [
  '350px',
  '128px'
]);

export const adaptorContextStructTooltip = genCodeSchema(adaptorContextStruct, [
  '350px',
  '128px'
]);

//Adapter response parameter description
export const adaptorResponseStruct = `{
  data: Object; //Interface returns data,
  request: XMLHttpRequest;
  headers?: Object; // Request headers
  status: number; // Status code 200, 404, 500..
  statusText: string; // status information
  ...
}`;

export const adaptorResponseStructTooltip = genCodeSchema(
  adaptorResponseStruct,
  ['345px', '144px']
);

// Receive adapter sample code
export const adaptorDefaultCode = `// API response or custom processing needs to conform to the following format
return {
    status: 0, // 0 means the request is successful, otherwise it is treated as an error
    msg: 'Request successful',
    data: {
        text: 'world',
        items: [
            {label: '张三', value: 1}
        ]
    }
}`;

export const validateApiAdaptorDefaultCode = `// Verification successful
return {
    status: 0
};

// Verification failed
return {
  status: 422,
  errors: 'The current user already exists'
}`;

// Example of the correct return format of the receiving adapter
export const adaptorReturnStruct = `{
  "status": 0,
  "msg": "",
  "data": {
    // ...other fields
  }
}`;

// The receiving adapter returns the correct format description
export const adaptorEditorDescSchema = {
  type: 'container',
  className: 'text-xs',
  style: {
    width: '458px',
    height: '315px'
  },
  body: [
    'The data returned by the interface must conform to the following format, status, msg, and data are required fields',
    genCodeSchema(adaptorReturnStruct),
    {
      type: 'table',
      className: 'mt-1 mb-0',
      data: {
        items: [
          {
            label: 'status',
            desc: 'Return 0 means the current interface returns correctly, otherwise it is treated as an error request'
          },
          {
            label: 'msg',
            desc: 'Return interface processing information, mainly used for toast display when form submission or request fails'
          },
          {
            label: 'data',
            desc: 'Must return an object with a key-value structure'
          }
        ]
      },
      columns: [
        {
          name: 'label',
          label: 'field'
        },
        {
          name: 'desc',
          label: 'Description'
        }
      ]
    }
  ]
};

// Check if the form item receives the correct format returned by the adapter
export const validateApiAdaptorEditorDescSchema = {
  type: 'container',
  className: 'text-xs',
  body: [
    'Verification interface return format field description:',
    {
      type: 'table',
      className: 'mt-1 mb-0',
      data: {
        items: [
          {
            label: 'status',
            desc: 'Return 0 if verification is successful, 422 if verification fails'
          },
          {
            label: 'errors',
            desc: 'When the return status is 422, the verification failure information is displayed'
          }
        ]
      },
      columns: [
        {
          name: 'label',
          label: 'field'
        },
        {
          name: 'desc',
          label: 'Description'
        }
      ]
    }
  ]
};

setSchemaTpl('apiRequestAdaptor', {
  label: tipedLabel(
    'Send Adapter',
    `You can directly enter the function body of the sending adapter based on the JavaScript language. In this function body, you can process the <span style="color: #108CEE">api</span> or return new content. Finally, you need to <span style="color: #108CEE">return</span> <span style="color: #108CEE">api</span>. <br><br/>
    The variables accessible within the function body are as follows:<br/>
    1. <span style="color: #108CEE">api</span>: interface schema configuration object<br/>
    2. <span style="color: #108CEE">api.data</span>: request data<br/>
    3. <span style="color: #108CEE">api.query</span>: request query parameters<br/>
    4. <span style="color: #108CEE">api.headers</span>: request header<br/>
    5. <span style="color: #108CEE">api.url</span>: request address<br/>`
  ),
  name: 'requestAdaptor',
  type: 'ae-apiAdaptorControl',
  editorDesc: 'The modified API object must be returned.',
  editorPlaceholder: requestAdaptorDefaultCode,
  params: [
    {
      label: 'fire',
      tip: adaptorApiStructTooltip
    },
    {
      label: 'context',
      tip: adaptorContextStructTooltip
    }
  ]
});

setSchemaTpl('apiAdaptor', {
  label: tipedLabel(
    'Return adapter',
    `You can directly enter the function body of the return adapter based on JavaScript language. In the function body, you can process the <span style="color: #108CEE">payload</span> or return new content. Finally, you need the <span style="color: #108CEE">return</span> interface to return the final result. <br><br/>
    The variables accessible within the function body are as follows:<br/>
    1. <span style="color: #108CEE">payload</span>: the result returned by the interface<br/>
    2. <span style="color: #108CEE">response</span>: response object of the interface<br/>
    3. <span style="color: #108CEE">api</span>: interface schema configuration object<br/>`
  ),
  type: 'ae-apiAdaptorControl',
  name: 'adaptor',
  params: [
    {
      label: 'payload',
      tip: 'The response payload of the current request, i.e. response.data'
    },
    {
      label: 'response',
      tip: adaptorResponseStructTooltip
    },
    {
      label: 'fire',
      tip: adaptorApiStructTooltip
    }
  ],
  editorPlaceholder: adaptorDefaultCode,
  switchTip: adaptorEditorDescSchema
});

setSchemaTpl('validateApiAdaptor', {
  ...getSchemaTpl('apiAdaptor'),
  editorPlaceholder: validateApiAdaptorDefaultCode,
  switchTip: validateApiAdaptorEditorDescSchema
});
