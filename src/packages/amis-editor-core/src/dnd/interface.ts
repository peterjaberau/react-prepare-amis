import {
  DeleteEventContext,
  InsertEventContext,
  MoveEventContext
} from '../plugin';
import {EditorNodeType} from '../store/node';
import {EditorDNDManager} from './index';

/**
 * Each drag mode needs to implement these conventions.
 */
export interface DNDModeInterface {
  readonly dnd: EditorDNDManager;
  readonly region: EditorNodeType;

  enter: (e: DragEvent, ghost: HTMLElement) => void;

  leave: (e: DragEvent, ghost: HTMLElement) => void;

  over: (e: DragEvent, ghost: HTMLElement) => void;

  getDropBeforeId: () => string | undefined;

  dispose: () => void;

  getDropPosition?: () => 'top' | 'bottom' | 'left' | 'right' | undefined;

  interruptionDrop?: () => boolean; // Whether to interrupt the drop event
}
