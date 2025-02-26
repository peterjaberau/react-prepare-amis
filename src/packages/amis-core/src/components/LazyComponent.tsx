/**
 * @file LazyComponent
 * @description
 * @author fex
 */

import React from 'react';
import {InView} from 'react-intersection-observer';
import {themeable, ThemeProps} from '../theme';

export interface LazyComponentProps extends ThemeProps {
  component?: React.ElementType;
  getComponent?: () => Promise<React.ElementType>;
  placeholder?: React.ReactNode;
  unMountOnHidden?: boolean;
  childProps?: object;
  defaultVisible?: boolean;
  className?: string;
  [propName: string]: any;
}

export interface LazyComponentState {
  visible: boolean;
  component?: React.ElementType;
}

export class LazyComponent extends React.Component<
  LazyComponentProps,
  LazyComponentState
> {
  static defaultProps = {
    placeholder: <span>Loading...</span>,
    unMountOnHidden: false,
    partialVisibility: true
  };

  mounted: boolean = false;
  constructor(props: LazyComponentProps) {
    super(props);

    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.mounted = true;

    this.state = {
      visible: props.defaultVisible ?? false,
      component: props.component as React.ElementType
    };
  }

  componentDidMount() {
// There is something wrong with jest, first manually make it always visible
    if (typeof jest !== 'undefined' || this.state.visible) {
      this.handleVisibleChange(true);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleVisibleChange(visible: boolean, entry?: any) {
    this.setState({
      visible: visible
    });

    if (!visible || this.state.component || !this.props.getComponent) {
      return;
    }

    this.props
      .getComponent()
      .then(
        component =>
          this.mounted &&
          typeof component === 'function' &&
          this.setState({
            component: component
          })
      )
      .catch(
        reason =>
          this.mounted &&
          this.setState({
            component: () => (
              <div className="alert alert-danger">{String(reason)}</div>
            )
          })
      );
  }

  render(): React.ReactNode {
    const {
      placeholder,
      unMountOnHidden,
      childProps,
      partialVisibility,
      children,
      className,
      ...rest
    } = this.props;
    const cx = this.props.classnames;

    const {visible, component: Component} = this.state;

    // Need to monitor from visible to invisible.
    if (unMountOnHidden) {
      return (
        <InView
          onChange={this.handleVisibleChange}
          threshold={partialVisibility ? 0 : 1}
        >
          {({ref}) => {
            return (
              <div
                ref={ref}
                className={`visibility-sensor ${visible ? 'in' : ''}`}
              >
                {Component && visible ? (
                  <Component {...rest} {...childProps} />
                ) : children && visible ? (
                  children
                ) : (
                  placeholder
                )}
              </div>
            );
          }}
        </InView>
      );
    }

    if (!visible) {
      return (
        <InView
          onChange={this.handleVisibleChange}
          threshold={partialVisibility ? 0 : 1}
        >
          {({ref}) => (
            <div ref={ref} className="visibility-sensor">
              {placeholder}
            </div>
          )}
        </InView>
      );
    } else if (Component) {
      // Only monitor invisible to visible, once visible, destroy the check.
      return <Component {...rest} {...childProps} />;
    } else if (children) {
      return children;
    }

    return <div className={cx('LazyComponent', className)}>{placeholder}</div>;
  }
}

const themedLazyComponent = themeable(LazyComponent);
(themedLazyComponent as any).defaultProps = LazyComponent.defaultProps;
export default themedLazyComponent;
