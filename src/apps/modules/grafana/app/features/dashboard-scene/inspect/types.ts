import { SceneObject, SceneObjectState } from '@scenes/index';
import { InspectTab } from 'app/features/inspector/types';

export interface SceneInspectTab<T extends SceneObjectState = SceneObjectState> extends SceneObject<T> {
  getTabValue(): InspectTab;
  getTabLabel(): string;
}
