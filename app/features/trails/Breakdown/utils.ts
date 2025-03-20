import { SelectableValue } from '@data/index';
import { AdHocFiltersVariable, QueryVariable, sceneGraph, SceneObject } from '@scenes/index';

import { VAR_FILTERS } from '../shared';

export function getLabelOptions(scenObject: SceneObject, variable: QueryVariable) {
  const labelFilters = sceneGraph.lookupVariable(VAR_FILTERS, scenObject);
  const labelOptions: Array<SelectableValue<string>> = [];

  if (!(labelFilters instanceof AdHocFiltersVariable)) {
    return [];
  }

  const filters = labelFilters.state.filters;

  for (const option of variable.getOptionsForSelect()) {
    const filterExists = filters.find((f) => f.key === option.value);

    if (option.label === 'le') {
      // Do not show the "le" label
      continue;
    }
    if (filterExists) {
      continue;
    }
    labelOptions.push({ label: option.label, value: String(option.value) });
  }

  return labelOptions;
}

interface Type<T> extends Function {
  new (...args: any[]): T;
}
export function findSceneObjectByType<T extends SceneObject>(scene: SceneObject, sceneType: Type<T>) {
  const targetScene = sceneGraph.findObject(scene, (obj) => obj instanceof sceneType);

  if (targetScene instanceof sceneType) {
    return targetScene;
  }

  return null;
}

export function findSceneObjectsByType<T extends SceneObject>(scene: SceneObject, sceneType: Type<T>) {
  function isSceneType(scene: SceneObject): scene is T {
    return scene instanceof sceneType;
  }

  const targetScenes = sceneGraph.findAllObjects(scene, isSceneType);
  return targetScenes.filter(isSceneType);
}
