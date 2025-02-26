/**
 * Takes over the store lifecycle, which is lightweight and suitable for use in components.
 * Compared to withStore in the renderer, the store here will not be in a big tree.
 * And it will not know which other stores are in the parent and child.
 */
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {destroy, IAnyStateTreeNode} from 'mobx-state-tree';
import {observer} from 'mobx-react';

export function withStore<K extends IAnyStateTreeNode>(
  storeFactory: (props: any) => K
) {
  return function <
    T extends React.ComponentType<
      React.ComponentProps<T> & {
        store: K;
      }
    >
  >(ComposedComponent: T) {
    ComposedComponent = observer(ComposedComponent);

    type OuterProps = JSX.LibraryManagedAttributes<
      T,
      Omit<React.ComponentProps<T>, 'store'>
    >;

    const result = hoistNonReactStatic(
      class extends React.Component<OuterProps> {
        static displayName: string = `WithStore(${
          ComposedComponent.displayName || 'Unkown'
        })`;
        static ComposedComponent = ComposedComponent as React.ComponentType<T>;
        ref: any;
        store?: K = storeFactory(this.props);
        refFn = (ref: any) => {
          this.ref = ref;
        };

        componentWillUnmount() {
          this.store && destroy(this.store);
          delete this.store;
        }

        getWrappedInstance() {
          return this.ref;
        }

        render() {
          const injectedProps = {
            store: this.store
          };

          return (
            <ComposedComponent
              {...(this.props as JSX.LibraryManagedAttributes<
                T,
                React.ComponentProps<T>
              > as any)}
              {...injectedProps}
              ref={this.refFn}
            />
          );
        }
      },
      ComposedComponent
    );

    return result as typeof result & {
      ComposedComponent: T;
    };
  };
}

export default withStore;
