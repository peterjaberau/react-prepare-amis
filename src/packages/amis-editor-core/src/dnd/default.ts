/**
 * Default drag mode implementation.
 */
import {animation} from '@/packages/src';
import findIndex from 'lodash/findIndex';
import {EditorDNDManager} from '.';
import {renderThumbToGhost} from '../component/factory';
import {EditorNodeType} from '../store/node';
import {translateSchema} from '../util';
import {DNDModeInterface} from './interface';

export class DefaultDNDMode implements DNDModeInterface {
  readonly dndContainer: HTMLElement; // Record the current drag area
  dropBeforeId?: string;
  constructor(readonly dnd: EditorDNDManager, readonly region: EditorNodeType) {
    // When initializing, the area where the element is located is set as the current drag area by default
    this.dndContainer = this.dnd.store
      .getDoc()
      .querySelector(
        `[data-region="${region.region}"][data-region-host="${region.id}"]`
      ) as HTMLElement;
  }

  /**
   * Record the mouse position at the last swap.
   */
  exchangeX: number = 0;
  exchangeY: number = 0;

  /**
   * Drag and drop ghost in for the first time. This gives the user an intuitive experience.
   * @param and
   * @param ghost
   */
  enter(e: DragEvent, ghost: HTMLElement) {
    const dragEl = this.dnd.dragElement;
    // If it is in the area where the moved element is located, then put the ghost in its original position.
    if (dragEl && dragEl.closest('[data-region]') === this.dndContainer) {
      const list: Array<any> = Array.isArray(this.region.schema)
        ? this.region.schema
        : [];
      const child = this.getChild(this.dndContainer, dragEl);
      const id = dragEl.getAttribute('data-editor-id')!;
      const idx = findIndex(list, (item: any) => item.$$id === id);
      if (~idx && list[idx + 1]) {
        this.dropBeforeId = list[idx + 1].$$id;
      }
      this.dndContainer.insertBefore(ghost, child);

      let innerHTML = dragEl.outerHTML
        .replace('ae-is-draging', '')
        // .replace(/\bdata\-editor\-id=('|").+?\1/g, '');
        // The above will cause fis to ignore subsequent require statements when compiling.
        .replace(/\bdata\-editor\-id=(?:'.+?'|".+?")/g, '');
      // bca-disable-next-line
      ghost.innerHTML = innerHTML;
    } else {
      const manager = this.dnd.manager;
      const store = manager.store;
      renderThumbToGhost(
        ghost,
        this.region,
        translateSchema(store.dragSchema),
        manager
      );
      this.dndContainer.appendChild(ghost);
    }
  }

  /**
   * Drag it out and remove the ghost
   * @param and
   * @param ghost
   */
  leave(e: DragEvent, ghost: HTMLElement) {
    this.dndContainer.removeChild(ghost);
  }

  over(e: DragEvent, ghost: HTMLElement) {
    const target = this.getTarget(e);
    const wrapper = this.dndContainer;
    const elemSchema = this.region.schema;
    const list: Array<any> = Array.isArray(elemSchema) ? elemSchema : [];
    const dx = e.clientX - this.exchangeX;
    const dy = e.clientY - this.exchangeY;
    const vertical = Math.abs(dy) > Math.abs(dx);
    const manager = this.dnd.manager;
    const store = manager.store;

    if (target && !animation.animating) {
      const targetId = target.getAttribute('data-editor-id')!;
      const targetChild = this.getChild(wrapper, target!);
      const idx = findIndex(list, (item: any) => item.$$id === targetId);

      const originIdx = Array.prototype.indexOf.call(wrapper.children, ghost);
      const targetIdx = Array.prototype.indexOf.call(
        wrapper.children,
        targetChild
      );

      if (
        ~originIdx &&
        originIdx > targetIdx &&
        (!this.exchangeY || (vertical ? dy < 0 : dx < 0))
        // (!this.exchangeY || dy < 0 || dx < 0)
      ) {
        // Originally at the back, move to the front
        this.exchangeX = e.clientX;
        this.exchangeY = e.clientY;
        this.dropBeforeId = list[idx]?.$$id;

        if (originIdx !== targetIdx - 1) {
          animation.capture(wrapper);
          wrapper.insertBefore(ghost, targetChild);
          animation.animateAll(store.calculateHighlightBox);
        }
      } else if (
        ~originIdx &&
        originIdx < targetIdx &&
        // (!this.exchangeY || dy > 0 || dx > 0)
        (!this.exchangeY || (vertical ? dy > 0 : dx > 0))
      ) {
        // Originally in front, move to the back
        this.exchangeX = e.clientX;
        this.exchangeY = e.clientY;

        if (list[idx + 1]) {
          this.dropBeforeId = list[idx + 1]?.$$id;
        } else {
          delete this.dropBeforeId;
        }

        if (originIdx !== targetIdx + 1) {
          animation.capture(wrapper);
          wrapper.insertBefore(ghost, targetChild.nextSibling);
          animation.animateAll(store.calculateHighlightBox);
        }
      }
    }

    if (ghost.parentNode !== wrapper) {
      delete this.dropBeforeId;
      animation.capture(wrapper);
      wrapper.appendChild(ghost);
      animation.animateAll(store.calculateHighlightBox);
    }
  }

  /**
   * Returns a relative position. If there is no data, it will be inserted at the end.
   */
  getDropBeforeId() {
    return this.dropBeforeId;
  }

  /**
   * Get which node the drag was placed on.
   */
  getTarget(e: DragEvent) {
    let target = (e.target as HTMLElement).closest(
      '[data-editor-id]'
    ) as HTMLElement;

    while (target) {
      const region = target.parentElement?.closest('[data-region]');

      if (region === this.dndContainer) {
        const renderer = target.getAttribute('data-renderer');
        if (renderer === 'grid') {
          // The sub-columns of the columns in the grid component can also be dragged into the selected column component. There are problems when dragging components of the same level. Please make it compatible.
          return target.parentElement;
        } else {
          return target;
        }
      }

      target =
        (target.parentElement?.closest('[data-editor-id]') as HTMLElement) ||
        null;
    }

    return null;
  }

  /**
   * Get the immediate children of the region, as they are sometimes inside the children of the children.
   * But the relative position of inserting ghost, insertBefore can only be the current child.
   * @param dom
   * @param descend
   */
  getChild(dom: HTMLElement, descend: HTMLElement) {
    let child = descend;

    while (child) {
      if (child.parentElement === dom) {
        break;
      }

      child = child.parentElement!;
    }

    return child;
  }

  /**
   * Destruction
   */
  dispose() {
    delete this.dropBeforeId;
  }
}
