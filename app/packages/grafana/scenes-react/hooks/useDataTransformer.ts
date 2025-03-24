import {
  CustomTransformerDefinition,
  DataProviderProxy,
  SceneDataProvider,
  SceneDataTransformer,
} from '@scenes/index';
import { useSceneContext } from './hooks';
import { useEffect, useId } from 'react';
import { isEqual } from 'lodash-es';
import { DataTransformerConfig } from '@schema/index';

export interface UseDataTransformerOptions {
  transformations: Array<DataTransformerConfig | CustomTransformerDefinition>;
  data: SceneDataProvider;
}

export function useDataTransformer(options: UseDataTransformerOptions) {
  const scene = useSceneContext();
  const key = useId();

  let dataTransformer = scene.findByKey<SceneDataTransformer>(key);

  if (!dataTransformer) {
    dataTransformer = new SceneDataTransformer({
      key: key,
      $data: new DataProviderProxy({ source: options.data.getRef() }),
      transformations: options.transformations,
    });
  }

  useEffect(() => scene.addToScene(dataTransformer), [dataTransformer, scene]);

  useEffect(() => {
    if (!isEqual(dataTransformer.state.transformations, options.transformations)) {
      dataTransformer.setState({ transformations: options.transformations });
      dataTransformer.reprocessTransformations();
    }
  }, [dataTransformer, options.transformations]);

  return dataTransformer;
}
