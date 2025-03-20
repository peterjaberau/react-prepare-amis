import { Dispatch, SetStateAction } from 'react';

import { Tab, TabsBar } from '@grafana-ui/index';
import { GeomapLayerHover } from '~/plugins/panel/geomap/event';

type Props = {
  layers?: GeomapLayerHover[];
  setActiveTabIndex: Dispatch<SetStateAction<number>>;
  activeTabIndex: number;
};

export const DataHoverTabs = ({ layers, setActiveTabIndex, activeTabIndex }: Props) => {
  return (
    <TabsBar>
      {layers &&
        layers.map((g, index) => (
          <Tab
            key={index}
            label={g.layer.getName()}
            active={index === activeTabIndex}
            counter={g.features.length > 1 ? g.features.length : null}
            onChangeTab={() => {
              setActiveTabIndex(index);
            }}
          />
        ))}
    </TabsBar>
  );
};
