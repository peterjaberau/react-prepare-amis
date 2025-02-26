/**
 * @file superscript control
 */

import React from 'react';
import {FormItem} from 'amis';
import {tipedLabel} from '@/packages/amis-editor-core/src';
import type {FormControlProps} from '@/packages/amis-core/src';
import set from 'lodash/set';
import get from 'lodash/get';

export interface BadgeControlProps extends FormControlProps {}

interface BadgeControlState {}

export default class NavDefaultActiveControl extends React.Component<
  BadgeControlProps,
  BadgeControlState
> {
  activeKey: string;
  constructor(props: BadgeControlProps) {
    super(props);
  }

  deleteActive(data: any) {
    for (let item of data) {
      if (item.active) {
        delete item.active;
      }
      if (item.children) {
        this.deleteActive(item.children);
      }
    }
  }

  findActiveKey(data: any, index?: string) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.active) {
        this.activeKey = index ? `${index}_${i}` : `${i}`;
        return;
      }
      if (item.children && item.children.length) {
        this.findActiveKey(item.children, `${i}`);
      }
    }
  }

  render() {
    const {render, data, onBulkChange} = this.props;
    this.findActiveKey(data.links);
    return render('', {
      type: 'tree-select',
      name: 'treeSelect',
      label: tipedLabel(
        'Default selected menu',
        'Prioritize matching based on the URL in the current browser address bar. If no match is found, the menu item you configured will be selected.'
      ),
      valueField: 'id',
      options: data.links,
      mode: 'horizontal',
      value: this.activeKey,
      horizontal: {
        justify: true,
        left: 4
      },
      onChange: (value: string) => {
        let pathArr = (value && value.split('_')) || [];
        let links = data.links;
        this.deleteActive(links);

        const path = `[${pathArr.join('].children[')}]`;
        if (get(links, path + '.label')) {
          set(links, path + '.active', true);
        }
        onBulkChange && onBulkChange({links});
      }
    });
  }
}

@FormItem({type: 'ae-nav-default-active', renderLabel: false})
export class NavDefaultActive extends NavDefaultActiveControl {}
