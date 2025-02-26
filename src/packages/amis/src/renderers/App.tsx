import React from 'react';
import {
  AsideNav,
  Html,
  Icon,
  NotFound,
  Spinner,
  SpinnerExtraProps
} from '@/packages/amis-ui/src';
import {Layout} from '@/packages/amis-ui/src';
import {
  Renderer,
  RendererProps,
  envOverwrite,
  filter,
  replaceText
} from '@/packages/amis-core/src';
import {
  BaseSchema,
  SchemaApi,
  SchemaClassName,
  SchemaCollection
} from '../Schema';
import {IScopedContext, ScopedContext} from '@/packages/amis-core/src';
import {AppStore, IAppStore} from '@/packages/amis-core/src';
import {isApiOutdated, isEffectiveApi} from '@/packages/amis-core/src';
import {autobind} from '@/packages/amis-core/src';

export interface AppPage extends SpinnerExtraProps {
  /**
   * Menu text
   */
  label?: string;

  /**
   * Menu icon, for example: fa fa-file
   */
  icon?: string;

  /**
   * Routing rules. For example: /banner/:id. When the address starts with /, it does not inherit the path of the upper layer, otherwise it will integrate the path of the parent page.
   */
  url?: string;

  /**
   * Jump to the target address when matching url. Valid when schema and shcemaApi are not configured.
   */
  redirect?: string;

  /**
   * When the match url is converted to the page of the rendering target address. It is valid when schema and shcemaApi are not configured.
   */
  rewrite?: string;

  /**
   * Do not have multiple pages. If multiple pages appear, only the first one will be used. Use it as the default page when the route cannot be found.
   */
  isDefaultPage?: boolean;

  /**
   * Choose one of the two. If the url is configured, you must configure it. Otherwise, I don't know how to render.
   */
  schema?: any;
  schemaApi?: any;

  /**
   * A simple URL. You can set external links.
   */
  link?: string;

  /**
   * Supports multiple levels.
   */
  children?: Array<AppPage>;

  /**
   * Class name on the menu
   */
  className?: SchemaClassName;

  /**
   * Whether it is visible in the navigation, suitable for pages that need to carry parameters to be displayed, such as the editing page of a specific data.
   */
  visible?: boolean;

  /**
   * The default is automatic, that is, it will expand if you select it yourself or if a child node is selected.
   * If configured as always or true, it will always be expanded.
   * If configured to false, it will never be expanded.
   */
  // expanded?: 'auto' | 'always' | boolean;
}

/**
 * App renderer, suitable for JSSDK to do multi-page rendering.
 * Documentation: https://aisuda.bce.baidu.com/amis/zh-CN/components/app
 */
export interface AppSchema extends BaseSchema, SpinnerExtraProps {
  /**
   * Specifies the app type.
   */
  type: 'app';

  api?: SchemaApi;

  /**
   * System Name
   */
  brandName?: string;

  /**
   * Logo image URL, can be svg.
   */
  logo?: string;

  /**
   * Top area
   */
  header?: SchemaCollection;

  /**
   * The area before the sidebar menu
   */
  asideBefore?: SchemaCollection;

  /**
   * The area behind the sidebar menu
   */
  asideAfter?: SchemaCollection;

  /**
   * Page collections.
   */
  pages?: Array<AppPage> | AppPage;

  /**
   * Bottom area.
   */
  footer?: SchemaCollection;

  /**
   * CSS class name.
   */
  className?: SchemaClassName;
  /**
   * Display breadcrumb trail.
   */
  showBreadcrumb?: boolean;
  /**
   * Display full path in breadcrumbs.
   */
  showFullBreadcrumbPath?: boolean;
  /**
   * Display breadcrumb trail to home page.
   */
  showBreadcrumbHomePath?: boolean;
}

export interface AppProps
  extends RendererProps,
    Omit<AppSchema, 'type' | 'className'> {
  children?: JSX.Element | ((props?: any) => JSX.Element);
  store: IAppStore;
}

export class App extends React.Component<AppProps, object> {
  static propsList: Array<string> = [
    'brandName',
    'logo',
    'header',
    'asideBefore',
    'asideAfter',
    'pages',
    'footer'
  ];
  static defaultProps = {};
  unWatchRouteChange?: () => void;

  constructor(props: AppProps) {
    super(props);

    const store = props.store;
    store.syncProps(props, undefined, ['pages']);
    store.updateActivePage(
      Object.assign({}, props.env ?? {}, {
        showFullBreadcrumbPath: props.showFullBreadcrumbPath ?? false,
        showBreadcrumbHomePath: props.showBreadcrumbHomePath ?? true
      })
    );

    if (props.env.watchRouteChange) {
      this.unWatchRouteChange = props.env.watchRouteChange(() =>
        store.updateActivePage(
          Object.assign({}, props.env ?? {}, {
            showFullBreadcrumbPath: props.showFullBreadcrumbPath ?? false,
            showBreadcrumbHomePath: props.showBreadcrumbHomePath ?? true
          })
        )
      );
    }
  }

  async componentDidMount() {
    const {data, dispatchEvent} = this.props;

    const rendererEvent = await dispatchEvent('init', data, this);

    if (rendererEvent?.prevented) {
      return;
    }

    this.reload();
  }

  async componentDidUpdate(prevProps: AppProps) {
    const props = this.props;
    const store = props.store;

    store.syncProps(props, prevProps, ['pages']);

    if (isApiOutdated(prevProps.api, props.api, prevProps.data, props.data)) {
      this.reload();
    } else if (props.location && props.location !== prevProps.location) {
      store.updateActivePage(
        Object.assign({}, props.env ?? {}, {
          showFullBreadcrumbPath: props.showFullBreadcrumbPath ?? false,
          showBreadcrumbHomePath: props.showBreadcrumbHomePath ?? true
        })
      );
    }
  }

  componentWillUnmount() {
    this.unWatchRouteChange?.();
  }

  async reload(
    subpath?: any,
    query?: any,
    ctx?: any,
    silent?: boolean,
    replace?: boolean
  ): Promise<any> {
    if (query) {
      return this.receive(query, undefined, replace);
    }

    const {
      api,
      store,
      env,
      showFullBreadcrumbPath = false,
      showBreadcrumbHomePath = true,
      local
    } = this.props;

    if (isEffectiveApi(api, store.data)) {
      const json = await store.fetchInitData(api, store.data, {});

      if (env.replaceText) {
        json.data = replaceText(
          json.data,
          env.replaceText,
          env.replaceTextIgnoreKeys
        );
      }

      if (json?.data.pages) {
        json.data = envOverwrite(json.data, locale);

        store.setPages(json.data.pages);
        store.updateActivePage(
          Object.assign({}, env ?? {}, {
            showFullBreadcrumbPath,
            showBreadcrumbHomePath
          })
        );
      }
    }

    return store.data;
  }

  async receive(values: object, subPath?: string, replace?: boolean) {
    const {store} = this.props;

    store.updateData(values, undefined, replace);
    return this.reload();
  }

  /**
   * Support page-level definitions, and give priority to page-level definitions
   * @param name
   * @returns
   */
  @autobind
  resolveDefinitions(name: string) {
    const {resolveDefinitions, store} = this.props;
    const definitions = store.schema?.definitions;

    return definitions?.[name] || resolveDefinitions(name);
  }

  @autobind
  handleNavClick(e: React.MouseEvent) {
    e.preventDefault();

    const env = this.props.env;
    const link = e.currentTarget.getAttribute('href')!;
    env.jumpTo(link, undefined, this.props.data);
  }

  renderHeader() {
    const {
      classnames: cx,
      brandName,
      header,
      render,
      store,
      logo,
      env
    } = this.props;

    if (!header && !logo && !brandName) {
      return null;
    }

    return (
      <>
        <div className={cx('Layout-brandBar')}>
          <div
            onClick={store.toggleOffScreen}
            className={cx('Layout-offScreenBtn')}
          >
            <i className="bui-icon iconfont icon-collapse"></i>
          </div>

          <div className={cx('Layout-brand')}>
            {logo && ~logo.indexOf('<svg') ? (
              <Html
                className={cx('AppLogo-html')}
                html={logo}
                filterHtml={env.filterHtml}
              />
            ) : logo ? (
              <img className={cx('AppLogo')} src={logo} />
            ) : (
              <span className="visible-folded ">
                {brandName?.substring(0, 1)}
              </span>
            )}
            <span className="hidden-folded m-l-sm">{brandName}</span>
          </div>
        </div>

        <div className={cx('Layout-headerBar')}>
          <a
            onClick={store.toggleFolded}
            type="button"
            className={cx('AppFoldBtn')}
          >
            <i
              className={`fa fa-${store.folded ? 'indent' : 'dedent'} fa-fw`}
            ></i>
          </a>
          {header ? render('header', header) : null}
        </div>
      </>
    );
  }

  renderAside() {
    const {store, env, asideBefore, asideAfter, render, data} = this.props;

    return (
      <>
        {asideBefore ? render('aside-before', asideBefore) : null}
        <AsideNav
          navigations={store.navigations}
          renderLink={(
            {link, active, toggleExpand, classnames: cx, depth, subHeader}: any,
            key: any
          ) => {
            let children = [];

            if (link.visible === false) {
              return null;
            }

            if (
              !subHeader &&
              link.children &&
              link.children.some((item: {visible: boolean}) => item?.visible)
            ) {
              children.push(
                <span
                  key="expand-toggle"
                  className={cx('AsideNav-itemArrow')}
                  onClick={e => toggleExpand(link, e)}
                ></span>
              );
            }

            const badge =
              typeof link.badge === 'string'
                ? filter(link.badge, data)
                : link.badge;

            badge != null &&
            children.push(
              <b
                key="badge"
                className={cx(
                  `AsideNav-itemBadge`,
                  link.badgeClassName || 'bg-info'
                )}
              >
                {badge}
              </b>
            );

            if (!subHeader && link.icon) {
              children.push(
                <Icon
                  key="icon"
                  cx={cx}
                  icon={link.icon}
                  className="AsideNav-itemIcon"
                />
              );
            } else if (store.folded && depth === 1 && !subHeader) {
              children.push(
                <i
                  key="icon"
                  className={cx(
                    `AsideNav-itemIcon`,
                    link.children ? 'fa fa-folder' : 'fa fa-info'
                  )}
                />
              );
            }

            children.push(
              <span className={cx('AsideNav-itemLabel')} key="label">
                {typeof link.label === 'string'
                  ? filter(link.label, data)
                  : link.label}
              </span>
            );

            return link.path ? (
              /^https?\:/.test(link.path) ? (
                <a target="_blank" key="link" href={link.path} rel="noopener">
                  {children}
                </a>
              ) : (
                <a
                  key="link"
                  onClick={this.handleNavClick}
                  href={link.path || (link.children && link.children[0].path)}
                >
                  {children}
                </a>
              )
            ) : (
              <a
                key="link"
                onClick={link.children ? () => toggleExpand(link) : undefined}
              >
                {children}
              </a>
            );
          }}
          isActive={(link: any) => !!env.isCurrentUrl(link?.path, link)}
        />
        {asideAfter ? render('aside-before', asideAfter) : null}
      </>
    );
  }

  renderFooter() {
    const {render, footer} = this.props;
    return footer ? render('footer', footer) : null;
  }

  render() {
    const {
      classnames: cx,
      store,
      render,
      showBreadcrumb = true,
      loadingConfig
    } = this.props;

    return (
      <Layout
        header={this.renderHeader()}
        aside={this.renderAside()}
        footer={this.renderFooter()}
        folded={store.folded}
        offScreen={store.offScreen}
        contentClassName={cx('AppContent')}
      >
        {store.activePage && store.schema ? (
          <>
            {showBreadcrumb && store.bcn.length ? (
              <ul className={cx('AppBcn')}>
                {store.bcn.map((item: any, index: number) => {
                  return (
                    <li key={index} className={cx('AppBcn-item')}>
                      {item.path ? (
                        <a href={item.path} onClick={this.handleNavClick}>
                          {item.label}
                        </a>
                      ) : index !== store.bcn.length - 1 ? (
                        <a>{item.label}</a>
                      ) : (
                        item.label
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : null}

            <div className={cx('AppBody')}>
              {render('page', store.schema, {
                key: `${store.activePage?.id}-${store.schemaKey}`,
                data: store.pageData,
                resolveDefinitions: this.resolveDefinitions
              })}
            </div>
          </>
        ) : store.pages && !store.activePage ? (
          <NotFound>
            <div className="text-center">Page does not exist</div>
          </NotFound>
        ) : null}
        <Spinner
          loadingConfig={loadingConfig}
          overlay
          show={store.loading || !store.pages}
          size="lg"
        />
      </Layout>
    );
  }
}

@Renderer({
  type: 'app',
  storeType: AppStore.name
})
export default class AppRenderer extends App {
  static contextType = ScopedContext;
  constructor(props: AppProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
    super.componentWillUnmount();
  }

  setData(values: object, replace?: boolean) {
    return this.props.store.updateData(values, undefined, replace);
  }

  getData() {
    const {store} = this.props;
    return store.data;
  }
}
