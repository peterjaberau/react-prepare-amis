import React, { useContext, useMemo } from "react";
import {
  EmbeddedScene,
  PanelBuilders,
  SceneApp,
  SceneAppPage,
  SceneFlexItem,
  SceneFlexLayout,
} from "@scenes/index";
import { config } from "@runtime/index";
import { PLUGIN_ID } from "@/apps/modules/scenes/stories/helpers/constants.tsx";

export function getSceneDemo() {
  return new EmbeddedScene({
    body: new SceneFlexLayout({
      children: [
        new SceneFlexItem({
          width: "50%",
          height: 300,
          body: PanelBuilders.text()
            .setTitle("getSceneDemo - Panel title")
            .setOption("content", "Hello world!")
            .build(),
        }),
      ],
    }),
  });
}

export const getSceneAppPageDemo = () => {
  return new SceneAppPage({
    title: "getSceneAppPageDemo",
    url: PLUGIN_ID,
    getScene: getSceneDemo,
  } as any);
};

function getSceneAppDemo() {
  return new SceneApp({
    pages: [getSceneAppPageDemo()],
  });
}

export const SceneAppDemo = () => {
  const scene = useMemo(() => getSceneAppDemo(), []);
  return <scene.Component model={scene} />;
};
