/**
 * @file for detailed configuration
 */

import React from 'react';
import cx from 'classnames';
import {Renderer, toast} from 'amis';

import {EditorManager} from '@/packages/amis-editor-core/src';
import {autobind, FormControlProps} from '@/packages/amis-core/src';

export interface GoCongigControlProps extends FormControlProps {
  label: string;
  compId: string | ((data: any) => string);
  manager: EditorManager;
}

export class GoConfigControl extends React.PureComponent<
  GoCongigControlProps,
  any
> {
  @autobind
  onClick() {
    const {data: ctx = {}, compId, manager} = this.props;
    const id = typeof compId === 'string' ? compId : compId(ctx);

    if (!id) {
      toast.error('No corresponding component found');
      return;
    }
    manager.setActiveId(id);
  }

  render() {
    const {className, label, data: ctx = {}} = this.props;

    return (
      <div className={cx('ae-GoConfig', className)} onClick={this.onClick}>
        {label}
        <div className={cx('ae-GoConfig-trigger')}>Go to edit</div>
      </div>
    );
  }
}

@Renderer({
  type: 'ae-go-config'
})
export class GoConfigControlRenderer extends GoConfigControl {}
