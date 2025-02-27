import {Html, render, TestIdBuilder, TooltipWrapper} from '@/packages/amis-ui/src';
import {observer} from 'mobx-react';
import React from 'react';
import cx from 'classnames';
import {Icon} from '../../icons/index';
import SearchRendererPanel from '../base/SearchRendererPanel';
import SearchCustomRendererPanel from '../base/SearchCustomRendererPanel';
import {autobind, noop, isHasPluginIcon} from '../../util';
import {EditorStoreType} from '../../store/editor';
import {EditorManager} from '../../manager';
import {SubRendererInfo} from '../../plugin';

type PanelProps = {
  store: EditorStoreType;
  manager: EditorManager;
  groupedRenderers: {
    [propName: string]: Array<SubRendererInfo>;
  };
  searchRendererType: string;
  className?: string;
  testIdBuilder?: TestIdBuilder;
};

type PanelStates = {
  toggleCollapseFolderStatus: boolean;
};

@observer
export default class RenderersPanel extends React.Component<
  PanelProps,
  PanelStates
> {
  state = {
    toggleCollapseFolderStatus: false // Used to trigger re-rendering of the component panel
  };

  // Used to record the folding state of the component classification panel
  curCollapseFolded: {
    [propName: string]: boolean;
  } = {};

  // Not used yet
  @autobind
  handleRegionFilterClick(e: React.MouseEvent) {
    let region = e.currentTarget.getAttribute('data-value')!;

    const {store, manager} = this.props;
    region = region === store.subRendererRegion ? '' : region;
    manager.switchToRegion(region);
  }

  @autobind
  handleDragStart(e: React.DragEvent, label: string) {
    const current = e.currentTarget;
    const id = current.getAttribute('data-id')!;
    e.dataTransfer.setData(`dnd-dom/[data-id="${id}"]`, '');
    /*
    // Add default elements during dragging
    e.dataTransfer!.effectAllowed = 'move';
    e.dataTransfer!.setDragImage(
      this.props.manager?.dnd?.createDragImage(label),
      0,
      0
    );
    */
  }

  // Component click to use
  @autobind
  handleClick(e: React.MouseEvent) {
    const id = e.currentTarget.getAttribute('data-dnd-id')!;
    this.props.manager.addElem(id);
  }

  // Change the folding state
  @autobind
  changeCollapseFoldStatus(tagKey: string, event: any) {
    this.curCollapseFolded[tagKey] = !this.curCollapseFolded[tagKey];
    this.setState({
      toggleCollapseFolderStatus: !this.state.toggleCollapseFolderStatus
    });
    event.preventDefault();
    event.stopPropagation();
  }

  renderThumb(schema: any) {
    const manager = this.props.manager;
    return schema ? (
      render(
        schema,
        {
          onAction: noop
        },
        manager.env
      )
    ) : (
      <p>No preview image</p>
    );
  }

  render() {
    const {store, searchRendererType, className, testIdBuilder} = this.props;
    const grouped = this.props.groupedRenderers || {};
    const keys = Object.keys(grouped);

    return (
      <div className={cx('ae-RendererList', className)}>
        {searchRendererType === 'renderer' && (
          <SearchRendererPanel store={store} />
        )}
        {searchRendererType === 'custom-renderer' && (
          <SearchCustomRendererPanel store={store} />
        )}
        <hr className="margin-top" />

        {/* {node.childRegions.length ? (
          <div className="ae-RegionFilter">
            area:
            {node.childRegions.map(region => (
              <div
                className={
                  store.subRendererRegion === region.region ? 'is-active' : ''
                }
                data-value={region.region}
                onClick={this.handleRegionFilterClick}
                key={region.region}
              >
                {region.label}
              </div>
            ))}
          </div>
        ) : null} */}

        {/*<div className="ae-RendererList-tip">
          Please select the following components and drag them into "{node?.label}"
        </div>*/}

        <div className="ae-RendererList-groupWrap hoverShowScrollBar">
          {keys.length ? (
            keys.map((tag, index) => {
              const items = grouped[tag];

              if (!items || !items.length) {
                return null;
              }

              return (
                <React.Fragment key={tag}>
                  <div
                    key={`${tag}-head`}
                    className={'ae-RendererList-head collapse-header'}
                    onClick={(event: any) => {
                      this.changeCollapseFoldStatus(tag, event);
                    }}
                  >
                    {tag}
                    <div
                      className={cx('expander-icon', {
                        'is-folded': !!this.curCollapseFolded[tag]
                      })}
                      title={
                        !!this.curCollapseFolded[tag]
                          ? 'Click to expand'
                          : 'Click to collapse'
                      }
                    >
                      <Icon icon="right-arrow-bold" />
                    </div>
                  </div>
                  <div
                    key={`${tag}-content`}
                    className={cx('ae-RendererList-group collapse-content', {
                      'is-folded': !!this.curCollapseFolded[tag]
                    })}
                  >
                    {items.map((item: any) => {
                      const key = `${index}_${item.id}`;
                      const usePluginIcon = isHasPluginIcon(item);
                      const tests = `editor-renderer-${item.plugin.rendererName}`;

                      return (
                        <div
                          key={key}
                          className="ae-RendererList-item"
                          draggable
                          data-id={key}
                          data-dnd-type="subrenderer"
                          data-dnd-id={item.id}
                          data-dnd-data={JSON.stringify(
                            item.scaffold || {type: item.type}
                          )}
                          onDragStart={(e: React.DragEvent) =>
                            this.handleDragStart(e, item.name)
                          }
                          {...testIdBuilder?.getChild(tests).getTestId()}
                        >
                          <div
                            className="icon-box"
                            data-dnd-id={item.id}
                            title={`Click to add「${item.name}」`}
                            onClick={this.handleClick}
                          >
                            {usePluginIcon && <Icon icon={item.pluginIcon} />}
                            {!usePluginIcon && (
                              <i
                                className={cx(
                                  'fa-fw',
                                  item.icon || 'fa fa-circle-thin'
                                )}
                              />
                            )}
                          </div>
                          <div
                            className="ae-RendererInfo"
                            data-dnd-id={item.id}
                            onClick={this.handleClick}
                          >
                            {item.name}
                          </div>
                          <TooltipWrapper
                            tooltipClassName="ae-RendererThumb"
                            trigger="hover"
                            rootClose={true}
                            placement="right"
                            tooltip={{
                              offset: [10, 0], // x-axis offset to avoid blocking the border
                              children: () => (
                                <div>
                                  <div className="ae-Renderer-title">
                                    {item.name}
                                  </div>
                                  {item.description || item.docLink ? (
                                    <div className="ae-Renderer-info">
                                      <Html
                                        html={
                                          item.description
                                            ? item.description
                                            : ''
                                        }
                                      />
                                      {item.docLink && (
                                        <a
                                          target="_blank"
                                          href={
                                            store.amisDocHost + item.docLink
                                          }
                                        >
                                          Details
                                        </a>
                                      )}
                                    </div>
                                  ) : null}
                                  <div className="ae-Renderer-preview">
                                    {this.renderThumb(item.previewSchema)}
                                  </div>
                                </div>
                              )
                            }}
                          >
                            <div className="ae-RendererIcon">
                              <Icon icon="editor-help" className="icon" />
                            </div>
                          </TooltipWrapper>
                        </div>
                      );
                    })}
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <span>
              No available components found, you can change keywords to continue
              searching.{' '}
            </span>
          )}
        </div>
      </div>
    );
  }
}
