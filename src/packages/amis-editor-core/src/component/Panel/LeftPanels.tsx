import {observer} from 'mobx-react';
import React from 'react';
import {Icon} from '@/packages/amis/src';
import cx from 'classnames';
import {EditorManager} from '../../manager';
import {EditorStoreType} from '../../store/editor';
import {Tab, Tabs} from '@/packages/amis/src';
import {autobind} from '../../util';
import {findDOMNode} from 'react-dom';
import find from 'lodash/find';
import {PanelItem} from '../../plugin';
import {DrawerPanel} from './DrawerPanel';
import {DrawerRendererPanel} from './DrawerRendererPanel';

export interface LeftPanelsProps {
  store: EditorStoreType;
  manager: EditorManager;
  theme?: string;
}

interface LeftPanelsStates {
  isFixedStatus: boolean;
}

@observer
export class LeftPanels extends React.Component<
  LeftPanelsProps,
  LeftPanelsStates
> {
  constructor(props: any) {
    super(props);

    this.state = {
      isFixedStatus: false // Default non-fixed mode
    };
  }

  @autobind
  handleHidden() {
    const {changeLeftPanelOpenStatus, leftPanelOpenStatus, changeLeftPanelKey} =
      this.props.store;
    const nextStatus = !leftPanelOpenStatus;
    changeLeftPanelOpenStatus(nextStatus);
    if (nextStatus) {
      // Expand and display the outline panel by default
      changeLeftPanelKey('outline');
    } else {
      // When folded, no tab panel is displayed
      changeLeftPanelKey('none');
    }
  }

  @autobind
  handleFixed() {
    this.setState({
      isFixedStatus: !this.state.isFixedStatus
    });
  }

  @autobind
  handleSelect(key: string) {
    const {changeLeftPanelOpenStatus, changeLeftPanelKey} = this.props.store;
    if (key) {
      // Expand first and then display the specified panel content
      changeLeftPanelOpenStatus(true);
      changeLeftPanelKey(key);
    }
  }

  @autobind
  getPopOverContainer() {
    return findDOMNode(this) as HTMLElement;
  }

  render() {
    const {store, manager, theme} = this.props;
    const {isFixedStatus} = this.state;
    const leftPanelOpenStatus = store.leftPanelOpenStatus;
    const panels = store.getLeftPanels();
    const id = store.activeId;
    const node = store.getNodeById(id);
    const panelKey = store.getLeftPanelKey();
    const insertPanel =
      store.insertId &&
      store.insertRegion &&
      find(panels, p => p.key === 'insert');

    const insertRendererPanel = find(panels, p => p.key === 'insertRenderer');

    const renderPanel = (panel: PanelItem) => {
      return panel.render ? (
        panel.render({
          id,
          info: node?.info,
          path: node?.path,
          node: node,
          value: store.value,
          onChange: manager.panelChangeValue,
          store: store,
          manager: manager,
          popOverContainer: this.getPopOverContainer
        })
      ) : panel.component ? (
        <panel.component
          node={node}
          key={panel.key}
          id={id}
          info={node?.info}
          path={node?.path}
          value={store.value}
          onChange={manager.panelChangeValue}
          store={store}
          manager={manager}
          popOverContainer={this.getPopOverContainer}
        />
      ) : null;
    };

    return (
      <>
        {panels.length > 0 && (
          <div
            className={cx(
              'editor-left-panel width-draggable',
              leftPanelOpenStatus ? '' : 'hidden-status',
              isFixedStatus ? 'fixed-status' : ''
            )}
          >
            <div
              className={`editor-panel-btn`}
              editor-tooltip={
                isFixedStatus
                  ? 'Turn off suspension mode'
                  : 'Turn on suspension mode'
              }
              tooltip-position="right"
            >
              <Icon
                icon={isFixedStatus ? 'editor-fixed' : 'editor-no-fixed'}
                className="panel-btn"
                onClick={this.handleFixed}
              />
            </div>
            <Tabs
              className="editorPanel-tabs"
              linksClassName="editorPanel-tabs-header"
              contentClassName="editorPanel-tabs-content"
              theme={theme}
              activeKey={panelKey}
              onSelect={this.handleSelect}
              tabsMode="sidebar"
              sidePosition="left"
            >
              {panels.map(panel => {
                return panel.key !== 'insert' &&
                  panel.key !== 'insertRenderer' ? (
                  <Tab
                    key={panel.key}
                    eventKey={panel.key}
                    title={
                      panel.title ?? (
                        <span
                          className="editor-tab-icon editor-tab-s-icon"
                          editor-tooltip={panel.tooltip}
                        >
                          {panel.icon}
                        </span>
                      )
                    }
                    // icon={panel.icon}
                    className={`editorPanel-tabs-pane ae-Editor-${panel.key}Pane`}
                    mountOnEnter={true}
                    unmountOnExit={false}
                  >
                    {renderPanel(panel)}
                  </Tab>
                ) : null;
              })}
            </Tabs>
            <div
              className={cx(
                'left-panel-arrow',
                leftPanelOpenStatus ? '' : 'hidden-status'
              )}
              onClick={this.handleHidden}
            ></div>
          </div>
        )}
        {isFixedStatus && (
          <div className="editor-left-panel-fixed-placeholder"></div>
        )}
        <DrawerPanel
          store={store}
          manager={manager}
          node={node}
          panelItem={insertPanel}
          theme={theme}
        />
        {/* Insert component panel (reuse existing component panel) */}
        <DrawerRendererPanel
          store={store}
          manager={manager}
          node={node}
          panelItem={insertRendererPanel}
          theme={theme}
        />
      </>
    );
  }
}
