/**
 * Action configuration panel
 */

import {RendererProps, Schema} from 'amis-core';
import {RendererPluginAction} from '@/packages/amis-editor-core/src';
import React from 'react';
import cx from 'classnames';
import isFunction from 'lodash/isFunction';
import {renderCmptActionSelect} from './helper';

export default class ActionConfigPanel extends React.Component<RendererProps> {
  render() {
    const {
      data,
      onBulkChange,
      render,
      pluginActions,
      actionConfigItemsMap,
      manager
    } = this.props;
    const actionType = data.__subActions ? data.groupType : data.actionType;
    let schema: any = null;

    if (data.actionType === 'component') {
      // Get component action configuration
      const subActionSchema =
        pluginActions?.[data.__rendererName]?.find(
          (item: RendererPluginAction) => item.actionType === data.groupType
        )?.schema ??
        (actionConfigItemsMap && actionConfigItemsMap[data.groupType]?.schema);
      const baseSchema = renderCmptActionSelect(
        'Select Components',
        true,
        () => {},
        data.componentId === 'customCmptId' ? true : false,
        manager
      );
      // Append to the base configuration
      schema = [
        ...(Array.isArray(baseSchema) ? baseSchema : [baseSchema]),
        ...(Array.isArray(subActionSchema)
          ? subActionSchema
          : [subActionSchema])
      ];
    } else {
      const __originActionSchema = data.__actionSchema;
      schema = isFunction(__originActionSchema)
        ? __originActionSchema(manager, data)
        : __originActionSchema;
    }

    return schema ? (
      render('inner', schema as Schema, {
        data
      })
    ) : data.__subActions ? (
      <></>
    ) : (
      <div
        className={cx('ae-event-control-action-placeholder', {
          'no-settings': actionType
        })}
      >
        <div className="ae-event-control-action-placeholder-img" />
        <span>
          {actionType
            ? 'No configuration content'
            : 'Please select an action to perform'}
        </span>
      </div>
    );
  }
}
