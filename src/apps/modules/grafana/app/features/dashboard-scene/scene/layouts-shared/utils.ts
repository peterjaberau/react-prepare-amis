import { SceneObject } from '@scenes/index';

import { DashboardLayoutManager, isDashboardLayoutManager } from '../types/DashboardLayoutManager';

export function findParentLayout(sceneObject: SceneObject): DashboardLayoutManager | null {
  let parent = sceneObject.parent;

  while (parent) {
    if (isDashboardLayoutManager(parent)) {
      return parent;
    }

    parent = parent.parent;
  }

  return null;
}
