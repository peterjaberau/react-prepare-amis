import React from 'react';
import { EmbeddedScene, SceneFlexLayout, SceneFlexItem, VizPanel, PanelBuilders } from '@grafana/scenes';

export function getScene() {
  return new EmbeddedScene({
    body: new SceneFlexLayout({
      children: [
        new SceneFlexItem({
          width: '50%',
          height: 300,
          body: PanelBuilders.text().setTitle('Panel title').setOption('content', 'Hello world!').build(),
        }),
      ],
    }),
  });
}


export const SceneCreate = () => {
  const scene = getScene();

  return <scene.Component model={scene} />;
};

