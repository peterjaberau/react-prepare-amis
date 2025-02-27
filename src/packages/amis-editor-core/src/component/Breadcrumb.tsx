import React from 'react';
import {reaction} from 'mobx';
import {Icon, resizeSensor} from '@/packages/src';
import {EditorStoreType} from '../store/editor';
import {EditorManager} from '../manager';
import {observer} from 'mobx-react';
import {EditorNodeType} from '../store/node';
import {autobind} from '../util';

export interface BreadcrumbProps {
  store: EditorStoreType;
  manager: EditorManager;
}

interface BreadcrumbStates {
  showLeftScrollBtn: boolean;
  showRightScrollBtn: boolean;
}

@observer
export default class Breadcrumb extends React.Component<
  BreadcrumbProps,
  BreadcrumbStates
> {
  readonly breadcrumbRef = React.createRef<HTMLDivElement>();
  readonly bcnContentRef = React.createRef<HTMLDivElement>();

  currentBreadcrumb: HTMLElement; // Record the current breadcrumb element
  unReaction: () => void;
  unSensor?: () => void;

  constructor(props: any) {
    super(props);

    this.state = {
      showLeftScrollBtn: false,
      showRightScrollBtn: false
    };

    this.unReaction = reaction(
      () => this.props.store.bcn,
      () => {
        //When the content changes, a calculation is automatically triggered
        this.refreshHandleScroll(true);
      }
    );
  }

  componentDidMount() {
    const scrollElem = this.getCurBreadcrumb();
    const breadcrumbContainer = this.getBreadcrumbContainer();

    if (!scrollElem || !breadcrumbContainer) {
      return;
    }

    this.unSensor = resizeSensor(breadcrumbContainer, () => {
      this.refreshHandleScroll();
    });
  }

  componentWillUnmount() {
    this.unReaction();
    if (this.unSensor) {
      this.unSensor();
      delete this.unSensor;
    }
  }

  @autobind
  refreshHandleScroll(resetScroll?: boolean) {
    setTimeout(() => {
      this.HandleScroll(resetScroll);
    }, 0);
  }

  @autobind
  getCurBreadcrumb() {
    return this.bcnContentRef.current;
  }

  @autobind
  getBreadcrumbContainer() {
    return this.breadcrumbRef.current;
  }

  @autobind
  getScrollLeft(): string {
    const curBreadcrumb = this.getCurBreadcrumb();
    return curBreadcrumb ? curBreadcrumb.style.left : '0';
  }

  @autobind
  toNumber(pxStr: string): number {
    let curScrollLeft = 0;
    if (!pxStr) {
      return curScrollLeft;
    }
    return Number.parseInt(pxStr);
  }

  @autobind
  HandleScroll(resetScroll?: boolean) {
    const scrollElem = this.getCurBreadcrumb();
    const scrollContainer = this.getBreadcrumbContainer();

    if (!scrollElem || !scrollContainer) {
      return;
    }

    const scrollLeft = this.toNumber(this.getScrollLeft());
    const maxScrollLeft = scrollElem.offsetWidth - scrollContainer.offsetWidth;

    if (resetScroll) {
      scrollElem.style.left = '0';
    }

    this.setState({
      showLeftScrollBtn: scrollLeft < 0,
      showRightScrollBtn: scrollLeft > -maxScrollLeft
    });
  }

  @autobind
  handleScrollToLeft() {
    // Scroll left: look at the content on the left, left + 50, scrolling content needs to move right
    const scrollElem = this.getCurBreadcrumb();

    if (!scrollElem) {
      return;
    }

    const scrollLeft = this.toNumber(this.getScrollLeft());

    if (scrollLeft >= -50 && scrollLeft < 0) {
      scrollElem.style.left = '0';
      this.refreshHandleScroll();
    } else if (scrollLeft < -50) {
      scrollElem.style.left = `${scrollLeft + 50}px`;
      this.refreshHandleScroll();
    }
  }

  @autobind
  handleScrollToRight() {
    // Scroll left: look at the content on the left, left - 50, scrolling content needs to move left
    const scrollElem = this.getCurBreadcrumb();
    const scrollContainer = this.getBreadcrumbContainer();

    if (!scrollElem || !scrollContainer) {
      return;
    }

    const scrollLeft = this.toNumber(this.getScrollLeft());
    const maxScrollLeft =
      scrollElem.offsetWidth - scrollContainer.offsetWidth + 32;

    if (scrollLeft - 50 > -maxScrollLeft) {
      scrollElem.style.left = `${scrollLeft - 50}px`;
    } else {
      scrollElem.style.left = `-${maxScrollLeft}px`;
    }
    this.refreshHandleScroll();
  }

  @autobind
  handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const dom = e.currentTarget;
    const id = dom.getAttribute('data-node-id')!;
    const region = dom.getAttribute('data-node-region')!;
    const store = this.props.store;
    const manager = this.props.manager;
    const node = store.getNodeById(id);

    if (node?.info?.editable === false) {
      return;
    }

    if (region) {
      // Clicking on the container type will automatically pop up the "Component Insertion Panel" which may interfere with user operations
      // manager.showInsertPanel(region, id);
      /** Special area allows click events */
      store.setActiveId(id, region);
    } else {
      store.setActiveId(id);
    }
  }

  @autobind
  handleMouseEnter(e: React.MouseEvent<HTMLAnchorElement>) {
    const dom = e.currentTarget;
    const id = dom.getAttribute('data-node-id')!;
    const region = dom.getAttribute('data-node-region')!;
    const store = this.props.store;

    store.setHoverId(id, region);
  }

  render() {
    const {store} = this.props;
    const {showLeftScrollBtn, showRightScrollBtn} = this.state;
    const bcn = store.bcn;

    return (
      <div className="ae-Breadcrumb" ref={this.breadcrumbRef}>
        {showLeftScrollBtn && (
          <div
            className="ae-Breadcrumb-scrollLeft-btn"
            onClick={this.handleScrollToLeft}
          >
            <Icon icon="editor-double-arrow" className="icon" />
          </div>
        )}
        <div className="ae-Breadcrumb-content" ref={this.bcnContentRef}>
          {bcn.length ? (
            <ul>
              {bcn.map((item, index) => {
                const nearby: Array<EditorNodeType> = (
                  item.parent as EditorNodeType
                )?.uniqueChildren;
                const region =
                  item.region ||
                  item.childRegions.find((i: any) => i.region)?.region;
                return (
                  <li key={index}>
                    <span
                      data-node-id={item.id}
                      data-node-region={region}
                      onClick={this.handleClick}
                      onMouseEnter={this.handleMouseEnter}
                    >
                      {item.label}
                    </span>
                    {nearby?.length > 1 ? (
                      <ul className="hoverShowScrollBar">
                        {nearby.map(child => (
                          <li key={`${child.id}-${child.region}`}>
                            <span
                              data-node-id={child.id}
                              data-node-region={child.region}
                              onClick={this.handleClick}
                              onMouseEnter={this.handleMouseEnter}
                              className={
                                child.id === item.id &&
                                child.region === item.region
                                  ? 'is-active'
                                  : ''
                              }
                            >
                              {child.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
        {showRightScrollBtn && (
          <div
            className="ae-Breadcrumb-scrollRight-btn"
            onClick={this.handleScrollToRight}
          >
            <Icon icon="editor-double-arrow" className="icon" />
          </div>
        )}
      </div>
    );
  }
}
