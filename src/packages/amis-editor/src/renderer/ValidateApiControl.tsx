/**
 * @file form item validation configuration
 */

import React from 'react';
import {FormItem} from 'amis';

import {getSchemaTpl, tipedLabel} from 'amis-editor-core';

import type {FormControlProps} from 'amis-core';

export interface ValidationApiControlProps extends FormControlProps {}

export default class ValidationApiControl extends React.Component<ValidationApiControlProps> {
  constructor(props: ValidationApiControlProps) {
    super(props);
  }

  renderValidateApiControl() {
    const {onBulkChange, render} = this.props;
    return (
      <div className="ae-ValidationControl-item">
        {render('validate-api-control', {
          type: 'form',
          wrapWithPanel: false,
          className: 'w-full mb-2',
          bodyClassName: 'p-none',
          wrapperComponent: 'div',
          mode: 'horizontal',
          data: {
            switchStatus: this.props.data.validateApi !== undefined
          },
          preventEnterSubmit: true,
          submitOnChange: true,
          onSubmit: ({switchStatus, validateApi}: any) => {
            onBulkChange &&
              onBulkChange({
                validateApi: !switchStatus ? undefined : validateApi
              });
          },
          body: [
            getSchemaTpl('switch', {
              label: tipedLabel(
                'Interface verification',
                `Configure the verification interface to perform remote verification on form items. The configuration method is the same as the normal interface<br />
              1. The interface returns <span class="ae-ValidationControl-label-code">{status: 0}</span>, indicating that the validation has passed<br />
              2. The interface returns <span class="ae-ValidationControl-label-code">{status: 422}</span>, indicating that the validation failed<br />
              3. If you need to display an error message when verification fails, you also need to return the errors field, example<br />
              <span class="ae-ValidationControl-label-code">{status: 422, errors: 'Error message'}</span>
              `
              ),
              name: 'switchStatus'
            }),
            {
              type: 'container',
              className: 'ae-ExtendMore ae-ValidationControl-item-input',
              bodyClassName: 'w-full',
              visibleOn: 'this.switchStatus',
              data: {
                // If placed in form, the contained expression will be evaluated
                validateApi: this.props.data.validateApi
              },
              body: [
                getSchemaTpl('apiControl', {
                  name: 'validateApi',
                  renderLabel: true,
                  label: '',
                  mode: 'normal',
                  className: 'w-full'
                })
              ]
            }
          ]
        })}
      </div>
    );
  }

  render() {
    return <>{this.renderValidateApiControl()}</>;
  }
}

@FormItem({
  type: 'ae-validationApiControl',
  renderLabel: false,
  strictMode: false
})
export class ValidationApiControlRenderer extends ValidationApiControl {}
