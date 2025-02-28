import {observer} from 'mobx-react';
import React from 'react';
import {Tab, Tabs} from '@/packages/amis/src';
import RenderersPanel from './RenderersPanel';
import {PanelProps} from '../../plugin';
import {autobind} from '../../util';

type PanelStates = {
  toggleCollapseFolderStatus: boolean;
};

@observer
export class AvailableRenderersPanel extends React.Component<
  PanelProps,
  PanelStates
> {
  @autobind
  handleSelect(key: string) {
    if (key) {
      this.props.store.changeRenderersTabsKey(key);
    }
  }

  render() {
    const {store, manager, children} = this.props;
    const renderersTabsKey = store.renderersTabsKey || 'base-renderers';
    const curTheme = store.theme;
    const customRenderersByOrder = store.customRenderersByOrder || [];
    const groupedSubRenderers = store.groupedSubRenderers || {};
    const groupedCustomRenderers = store.groupedCustomRenderers || {}; // Custom components

    return (
      <div className="ae-RendererPanel">
        <div className="panel-header">Component</div>
        <div className="ae-RendererPanel-content">
          {typeof children === 'function' ? children(this.props) : children}
          {store.showCustomRenderersPanel &&
            customRenderersByOrder.length > 0 && (
              <Tabs
                theme={curTheme}
                tabsMode={'line'} // tiled
                className="ae-RendererList-tabs"
                linksClassName="ae-RendererList-tabs-header"
                contentClassName="ae-RendererList-tabs-content"
                activeKey={renderersTabsKey}
                onSelect={this.handleSelect}
              >
                <Tab
                  key={'base-renderers'}
                  eventKey={'base-renderers'}
                  title={'System Components'}
                  className={`ae-RendererList-tabs-panel base-renderers`}
                  mountOnEnter={true}
                  unmountOnExit={false}
                >
                  <RenderersPanel
                    groupedRenderers={groupedSubRenderers}
                    store={store}
                    manager={manager}
                    searchRendererType={'renderer'}
                  />
                </Tab>
                <Tab
                  key={'custom-renderers'}
                  eventKey={'custom-renderers'}
                  title={'Custom component'}
                  className={`ae-RendererList-tabs-panel custom-renderers`}
                  mountOnEnter={true}
                  unmountOnExit={false}
                >
                  <RenderersPanel
                    groupedRenderers={groupedCustomRenderers}
                    store={store}
                    manager={manager}
                    searchRendererType={'custom-renderer'}
                  />
                </Tab>
              </Tabs>
            )}
          {(!store.showCustomRenderersPanel ||
            Object.keys(groupedCustomRenderers).length < 1) && (
            <RenderersPanel
              className={'only-base-component'}
              groupedRenderers={groupedSubRenderers}
              store={store}
              manager={manager}
              searchRendererType={'renderer'}
            />
          )}
        </div>
      </div>
    );
  }
}
