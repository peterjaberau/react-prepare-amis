import React from 'react';
import { EmbeddedScene, EmbeddedSceneState, SceneComponentProps } from '@scenes/index';
import { SceneContext } from '../contexts/SceneContextProvider';
import { SceneContextObject } from '../contexts/SceneContextObject';

export class EmbeddedSceneWithContext extends EmbeddedScene {
  public constructor(state: EmbeddedSceneState) {
    super({ ...state, context: new SceneContextObject() });
  }

  public static Component = ({ model }: SceneComponentProps<EmbeddedSceneWithContext>) => {
    return (
      <SceneContext.Provider value={model.state.context as SceneContextObject}>
        <EmbeddedScene.Component model={model} />
      </SceneContext.Provider>
    );
  };
}
