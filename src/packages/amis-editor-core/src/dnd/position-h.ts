/**
 * @file A simpler drag mode that directly displays a line at a certain position to inform the user where the drag is about to go.
 * For example, if you want to move the column position in a table, it might be fatal if you really want to move the DOM.
 */
import findIndex from 'lodash/findIndex';
import {DefaultDNDMode} from './default';
import {DNDModeInterface} from './interface';

export class PositionHDNDMode
  extends DefaultDNDMode
  implements DNDModeInterface
{
  enter(e: DragEvent, ghost: HTMLElement) {
    ghost.innerHTML = '';
    ghost.classList.add('use-position');
    ghost.classList.add('is-horizontal');

    const dragEl = this.dnd.dragElement;
    const regionRect = this.dndContainer.getBoundingClientRect();

    const list: Array<any> = Array.isArray(this.region.schema)
      ? this.region.schema
      : [];

    // If it is in the area where the moved element is located, then put the ghost in its original position.
    if (dragEl && dragEl.closest(`[data-region]`) === this.dndContainer) {
      const id = dragEl.getAttribute('data-editor-id')!;
      const idx = findIndex(list, (item: any) => item.$$id === id);
      if (~idx && list[idx + 1]) {
        this.dropBeforeId = list[idx + 1].$$id;
      }

      if (dragEl.nextElementSibling) {
        const rect = dragEl.nextElementSibling.getBoundingClientRect();
        ghost.style.cssText += `top: 0; left: ${rect.x - regionRect.x}px;`;
      } else {
        ghost.style.cssText += `top: 0; left: 100%;`;
      }
    } else {
      ghost.style.cssText += `top: 0; left: -999999%;`;
    }
    this.dndContainer.appendChild(ghost);
  }

  leave(e: DragEvent, ghost: HTMLElement) {
    ghost.classList.remove('use-position');
    ghost.classList.remove('is-horizontal');
  }

  over(e: DragEvent, ghost: HTMLElement) {
    let target = this.getTarget(e);
    if (!target) {
      return;
    }

    // If it is a column, special processing is performed.
    if (this.dndContainer?.getAttribute('data-renderer') === 'table') {
      const col = target.parentElement?.closest(
        'th[data-editor-id], td[data-editor-id]'
      );
      if (col && this.dndContainer.contains(col)) {
        target = col as HTMLElement;
      }
    }

    const regionRect = this.dndContainer.getBoundingClientRect();
    const list: Array<any> = Array.isArray(this.region.schema)
      ? this.region.schema
      : [];

    const rect = target.getBoundingClientRect();
    if (
      target.nextElementSibling &&
      target.nextElementSibling.hasAttribute('data-editor-id')
    ) {
      ghost.style.cssText += `left: ${rect.x - regionRect.x}px;`;
      this.dropBeforeId = target.getAttribute('data-editor-id')!;
    } else if (e.clientX > rect.x + rect.width / 2) {
      ghost.style.cssText += `top: 0; left: ${rect.right - regionRect.x}px;`;
      delete this.dropBeforeId;
    } else {
      ghost.style.cssText += `left: ${rect.x - regionRect.x}px;`;
      this.dropBeforeId = target.getAttribute('data-editor-id')!;
    }
  }
}
