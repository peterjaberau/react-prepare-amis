import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Responsive as ReactGridLayout,
  WidthProvider,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { generateGridBackground } from "../../../packages/utils";

import { Container } from "../Container";
import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from "@elastic/eui";
import { solidGravityDynamic } from "@/apps/modules/grid-layout/packages";
import { omit } from "lodash";

const ResponsiveGridLayout = WidthProvider(ReactGridLayout);

const ContainerComponents = ({ layoutList }: { layoutList: any[] }) => {
  return (
    <>
      {layoutList.map((item: any) => (
        <EuiPanel key={item.i} hasShadow={true}>
          <EuiText>
            <h4>{item.i}</h4>
          </EuiText>
        </EuiPanel>
      ))}
    </>
  );
};

export const Demo = (props: any) => {
  const { defaultProps, additionalProps } = props;
  const { layout, ...rest } = defaultProps;
  const { name } = additionalProps;

  const [internalState, setInternalState] = useState(defaultProps);

  useEffect(() => {
    setInternalState(defaultProps);

    console.log("internalState", internalState);
  }, [defaultProps]);


  return (
    <>
      <ResponsiveGridLayout layouts={internalState.layout} {...omit(internalState, [layout])}>
        {internalState.layout["lg"].map((item: any) => (
          <div key={item.i}>
            <ItemRenderer item={item} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </>
  );
};

export const ItemRenderer = ({ item }: any) => {
  return (
        <EuiPanel key={item.i} hasShadow={true} grow={true} style={{ height: '100%'}}>
          <EuiText>
            <h4>{item.i}</h4>
          </EuiText>
        </EuiPanel>
  );
};
