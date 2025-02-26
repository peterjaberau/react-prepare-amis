import {NodeWrapper, NodeWrapperProps} from './NodeWrapper';
import React from 'react';
import {observer} from 'mobx-react';
import {autobind} from '../util';
import type {Schema} from 'amis';
import find from 'lodash/find';
import {RegionWrapper} from './RegionWrapper';

export interface ContainerWrapperProps extends NodeWrapperProps {}

@observer
export class ContainerWrapper extends React.Component<ContainerWrapperProps> {
  ref: any;
  getWrappedInstance() {
    return this.ref;
  }

  @autobind
  refFn(ref: any) {
    this.ref = ref;
  }

  /*
    Basically, container renderers render child nodes through this.props.render('region', subScheme).
    Therefore, ContainerWrapper only needs to modify the delivered render to complete the wrapping.
   */
  @autobind
  renderChild(region: string, node: Schema, props: any) {
    const {render, $$editor, $$node, $schema} = this.props;

    if (
      // @ts-ignore
      $$editor.regions?.find(item => item.key === region)?.hiddenOn?.($schema)
    ) {
      return null;
    }

    const child = render(region, node, props);

    if ($$node?.memberImmutable(region)) {
      return child;
    }

    const config = find(
      $$editor.regions,
      item => item.key === region && !item.matchRegion && !item.renderMethod
    );

    if (config) {
      const Region = config.wrapper || RegionWrapper;

      return (
        <Region
          key={props?.key}
          preferTag={config.preferTag}
          name={config.key}
          label={config.label}
          placeholder={config.placeholder}
          regionConfig={config}
          editorStore={$$editor.plugin.manager.store}
          wrapperResolve={config.wrapperResolve}
          manager={$$editor.plugin.manager}
          children={child}
          rendererName={$$editor.renderer.name}
          $$editor={$$editor}
          node={$$node}
        />
      );
    }

    return child;
  }

  render() {
    const {$$editor, $$node, ...rest} = this.props;
    const props: any = {};
    const editorStore = $$editor.plugin.manager.store;

    if (
      $$editor.id &&
      (editorStore.isActive($$editor.id) ||
        editorStore.dropId === $$editor.id) &&
      Array.isArray($$editor.regions)
    ) {
      $$editor.regions.forEach(({key, optional}) => {
        if (optional) {
          return;
        } else if ($$node?.memberImmutable(key)) {
          return;
        }

        let defaultRegion: any[] = [];
        /**
         * Special processing of button groups in form
         * Reason: Ensure that the default submit button is also displayed in edit mode
         */
        if (
          key === 'actions' &&
          (typeof rest.submitText === 'undefined' || rest.submitText)
        ) {
          defaultRegion = [
            {
              type: 'submit',
              label: rest.submitText || 'Submit',
              primary: true
            }
          ];
        }

        let region = Array.isArray(rest[key])
          ? rest[key]
          : rest[key]
          ? [rest[key]]
          : defaultRegion;

        if (!region.length) {
          region = region.concat();
          region.push({children: () => null});
        }

        props[key] = region;
      });
    }

    return (
      <NodeWrapper
        {...rest}
        {...props}
        $$editor={$$editor}
        $$node={$$node}
        render={this.renderChild}
        ref={this.refFn}
      />
    );
  }
}
