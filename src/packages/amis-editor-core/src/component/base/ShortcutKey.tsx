import React from 'react';
import {Modal, Icon} from '@/packages/amis-ui/src';
import cx from 'classnames';
import {autobind} from '../../util';

export interface ShortcutKeyProps {
  title?: string;
  size?: string;
  closeOnEsc?: boolean;
  closeOnOutside?: boolean;
  ShortcutKeyList?: Array<ShortcutKeyItem>;
}

interface ShortcutKeyItem {
  title: string;
  letters: Array<string>;
  tooltip?: string;
}

export interface ShortcutKeyStates {
  visible: boolean;
}

const ShortcutKeyList = [
  {
    title: 'Copy',
    letters: ['⌘', 'c'],
    tooltip: 'Copy the currently selected element'
  },
  {
    title: 'Paste',
    letters: ['⌘', 'v'],
    tooltip: 'Insert the copied element into the currently selected node'
  },
  {
    title: 'Cut',
    letters: ['⌘', 'x'],
    tooltip: 'Cut the currently selected element'
  },
  {
    title: 'Revocation',
    letters: ['⌘', 'z'],
    tooltip: 'Restore the last undone operation'
  },
  {
    title: 'Redo',
    letters: ['⌘', 'Shift', 'z'],
    tooltip: 'Restore the last undone operation'
  },
  {
    title: 'Save',
    letters: ['⌘', 's'],
    tooltip: 'Save all current operations'
  },
  {
    title: 'Preview/Edit',
    letters: ['⌘', 'p'],
    tooltip: 'Turn on/off preview mode'
  },
  {
    title: 'Delete',
    letters: ['Delete'],
    tooltip: 'Delete current node'
  },
  {
    title: 'Delete',
    letters: ['Backspace'],
    tooltip: 'Delete current node'
  },
  {
    title: 'Move up',
    letters: ['⌘', '↑'],
    tooltip: 'Move the current node up'
  },
  {
    title: 'Move down',
    letters: ['⌘', '↓'],
    tooltip: 'Move the current node down'
  }
];

export default class ShortcutKey extends React.Component<
  ShortcutKeyProps,
  ShortcutKeyStates
> {
  constructor(props: any) {
    super(props);

    this.state = {
      visible: false
    };
  }

  @autobind
  closeShortcutKeyModal() {
    this.setState({
      visible: false
    });
  }

  @autobind
  showShortcutKeyModal() {
    this.setState({
      visible: true
    });
  }

  render() {
    const {title, size, closeOnEsc, closeOnOutside} = this.props;
    const curShortcutKeyList = this.props.ShortcutKeyList || ShortcutKeyList;

    return (
      <>
        <div
          className="shortcut-icon-btn"
          editor-tooltip="Click to view currently available shortcut keys"
          tooltip-position="bottom"
        >
          <Icon icon="editor-shortcut" onClick={this.showShortcutKeyModal} />
        </div>
        <Modal
          size={size || 'xs'}
          show={this.state.visible}
          closeOnEsc={closeOnEsc ?? true}
          closeOnOutside={closeOnOutside ?? true}
          onHide={this.closeShortcutKeyModal}
          contentClassName="shortcut-list-modal"
        >
          <div className="shortcut-modal-header">
            <div className="shortcut-modal-title">
              {title || 'Currently available shortcut keys'}
            </div>
            <Icon
              icon="close"
              className="shortcut-modal-icon"
              onClick={this.closeShortcutKeyModal}
            />
          </div>
          <div className="shortcut-modal-body">
            {curShortcutKeyList && curShortcutKeyList.length > 0 && (
              <div className="shortcut-list">
                {curShortcutKeyList.map(
                  (shortcutKey: ShortcutKeyItem, index: number) => {
                    return (
                      <div className="shortcut-item" key={index}>
                        {shortcutKey.tooltip && (
                          <div
                            className="shortcut-title"
                            editor-tooltip={shortcutKey.tooltip}
                          >
                            {shortcutKey.title}
                          </div>
                        )}
                        {!shortcutKey.tooltip && (
                          <div className="shortcut-title">
                            {shortcutKey.title}
                          </div>
                        )}
                        <div className="shortcut-letters">
                          {shortcutKey.letters.map((letter: string) => {
                            return (
                              <div className="shortcut-letter" key={letter}>
                                {letter}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
            {!curShortcutKeyList ||
              (curShortcutKeyList.length === 0 && <span>No shortcut key</span>)}
          </div>
        </Modal>
      </>
    );
  }
}
