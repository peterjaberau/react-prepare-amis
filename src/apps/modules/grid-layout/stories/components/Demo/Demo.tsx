import * as React from "react";
import { ThemeProvider } from "styled-components";
import { AppLayout } from "@devoinc/genesys-ui";
import { light } from "@devoinc/genesys-brand-devo";
import { useEffect } from "react";

import { type TLayout, solidGravityDynamic } from "../../../packages";
import { Container } from "../Container";

type Props = {
  layout?: TLayout;
  cols?: number;
  rowHeight?: number;
  disabled?: boolean;
  debug?: boolean;
};

export const Demo: React.FC<Props> = ({
  layout = [],
  cols = 12,
  rowHeight = 80,
  disabled = false,
  debug = false,
}) => {
  // Compact at initial layout
  const [internalLayout, setInternalLayout] = React.useState<TLayout>(
    solidGravityDynamic(layout),
  );

  useEffect(() => {
    setInternalLayout(solidGravityDynamic(layout));
  }, [layout]);


  return (
    <ThemeProvider theme={light}>
      <AppLayout>
        <AppLayout.Content padding={"0"}>
          <Container
            layout={internalLayout}
            onChange={(layout, final) => {
              // compact on any change to the layout
              setInternalLayout(solidGravityDynamic(layout));
              if (final) {
                // eslint-disable-next-line
                console.log("onFinalChange", layout);
              }
            }}
            cols={cols}
            rowHeight={rowHeight}
            disabled={disabled}
            debug={debug}
          />
        </AppLayout.Content>
      </AppLayout>
    </ThemeProvider>
  );
};
