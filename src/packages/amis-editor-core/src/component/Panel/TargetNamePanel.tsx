/**
 * Display a list of names that can be used as targets
 */
import {observer} from 'mobx-react';
import cx from 'classnames';
import React from 'react';
import {PanelProps} from '../../plugin';
import {autobind} from '../../util';

@observer
export class TargetNamePanel extends React.Component<PanelProps> {
  @autobind
  handleClick(e: React.MouseEvent<HTMLElement>) {
    const {store, manager} = this.props;
    const editorId = e.currentTarget.getAttribute('data-targetname-id');
    store.setActiveId(editorId!);
  }

  @autobind
  handleEnter(e: React.MouseEvent<HTMLElement>) {
    const {store, manager} = this.props;
    const editorId = e.currentTarget.getAttribute('data-targetname-id');
    store.setHoverId(editorId!);
  }

  render() {
    const {store, manager} = this.props;
    const targetNames = this.props.store.targetNames;

    return (
      <div className="ae-TargetName">
        <span>
          When forms, lists, and other components have names, they will appear
          here for easy selection
        </span>
        <ul className="ae-TargetName-list">
          {targetNames.map(targetName => {
            const editorId = targetName.editorId;
            return (
              <li
                className={cx('ae-TargetName-node', {
                  'is-active': store.activeId === editorId,
                  'is-hover': store.isHoved(editorId)
                })}
                data-targetname-id={editorId}
                onMouseEnter={this.handleEnter}
                onClick={this.handleClick}
                key={editorId}
              >
                <span className="label label-info pull-right">
                  {targetName.type}
                </span>
                <a>{targetName.name}</a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
