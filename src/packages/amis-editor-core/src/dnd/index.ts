/**
 * @file drag related logic
 */
import find from 'lodash/find';
import {isAlive} from 'mobx-state-tree';
import {toast} from 'amis';
import debounce from 'lodash/debounce';
import {EditorManager} from '../manager';
import {DragEventContext, SubRendererInfo} from '../plugin';
import {EditorStoreType} from '../store/editor';
import {EditorNodeType} from '../store/node';
import {
  JSONGetById,
  autobind,
  reactionWithOldValue,
  unitFormula
} from '../util';
import {DefaultDNDMode} from './default';
import {DNDModeInterface} from './interface';
import {PositionHDNDMode} from './position-h';
import {FlexDNDMode} from './flex';

const toastWarning = debounce(msg => {
  toast.warning(msg);
}, 500);

export class EditorDNDManager {
  toDispose: Array<() => void> = [];

  /**
   * This will be created dynamically each time the region is switched.
   */
  dndMode?: DNDModeInterface;

  /**
   * Drag the object dom.
   */
  readonly dragGhost: HTMLElement;

  /**
   * Count the number of dragEnter, because this method will be called many times,
   * Sometimes you only want to process the logic when you first come in
   */
  dragEnterCount = 0;

  /**
   * The renderer element currently being dragged. Note that this is not necessarily e.target.
   */
  dragElement?: HTMLElement;

  /**
   * Drag and drop elements
   */
  dragImage?: HTMLElement;

  /**
   * Record the last mouse position information to assist in drag calculation.
   */
  lastX: number = 0;
  lastY: number = 0;
  curDragId: string;
  startX: number = 0;
  startY: number = 0;

  constructor(
    readonly manager: EditorManager,
    readonly store: EditorStoreType
  ) {
    this.toDispose.push(
      reactionWithOldValue(
        () => (store.dragType === 'schema' ? store.dragId : ''),
        this.updateDragElements
      ),

      /**
       * Automatically add css such as is-dragenter to the dragged area.
       */
      reactionWithOldValue(
        () => ({id: store.dropId, region: store.dropRegion}),
        this.updateDropRegion
      )

      // /**
      // * Automatically highlight the area to be activated.
      //  */
      // reactionWithOldValue(
      //   () => ({id: store.planDropId, region: store.planDropRegion}),
      //   this.updatePlanDropRegion
      // )
    );

    this.dragGhost = document.createElement('div');
    this.dragGhost.classList.add('ae-DragGhost');
    this.dragGhost.classList.add('is-ghost');
  }

  /**
   * Create a drag-and-drop follower element. The default size is too large and sometimes not uniform.
   * @param id
   * @param node
   */
  createDragImage(id: string, node?: EditorNodeType) {
    const dragImage = document.createElement('div');
    dragImage.classList.add('ae-DragImage');
    // bca-disable-next-line
    dragImage.innerHTML = `<span>${node?.label || id}</span>`;
    document.body.appendChild(dragImage);
    // dragImage.style.cssText += `width: ${node.w}px; height: ${node.h}px;`;
    this.dragImage = dragImage;
    return dragImage;
  }

  /**
   * Destroy the drag-following element
   */
  disposeDragImage() {
    const dragImage = this.dragImage;
    dragImage?.parentElement?.removeChild(dragImage);
    delete this.dragImage;
  }

  /**
   * Switch to the target area.
   * @param and
   * @param id
   * @param region
   */
  switchToRegion(e: DragEvent, id: string, region: string): boolean {
    const store = this.store;
    if (
      !id ||
      !region ||
      (store.dropId === id && store.dropRegion === region)
    ) {
      return false;
    }
    const node = store.getNodeById(id, region)!;
    const config = node.regionInfo!;

    // Get the schema data of the currently dragged element
    const json = store.dragSchema;

    if (
      config?.accept?.(json) === false ||
      node.host?.memberImmutable(region)
    ) {
      return false;
    }

    const context: DragEventContext = {
      mode: store.dragMode as any,
      sourceType: store.dragType as any,
      sourceId: store.dragId,
      data: store.dragSchema,
      targetId: id,
      targetRegion: region
    };

    const event = this.manager.trigger('dnd-accept', context);
    if (event.prevented) {
      return false;
    }

    this.dndMode?.leave(e, this.dragGhost);
    this.dndMode?.dispose();

    store.setDropId(id, region);
    this.makeDNDModeInstance(node);
    this.dndMode?.enter(e, this.dragGhost!);
    store.calculateHighlightBox([id]);
    return true;
  }

  /**
   * Create a drag mode instance based on the region configuration.
   * For example, when dragging a table column area, a line is placed to indicate the dragged position.
   * @param region
   */
  makeDNDModeInstance(region: EditorNodeType) {
    if (!region || !isAlive(region)) {
      return this.dndMode || null;
    }
    const mode = region.regionInfo?.dndMode;
    const regionNode = JSONGetById(this.store.schema, region.id);
    let Klass: new (
      dnd: EditorDNDManager,
      region: EditorNodeType,
      config: any
    ) => DNDModeInterface = DefaultDNDMode; // todo automatically instantiates different ones based on configuration

    if (mode === 'position-h') {
      Klass = PositionHDNDMode;
    }
    if (typeof mode === 'function') {
      if (mode(regionNode) === 'flex') {
        Klass = FlexDNDMode;
      }
    }

    this.dndMode = new Klass(this, region, {regionNode});
    return this.dndMode;
  }

  /**
   * Drag entry, one is the drag button toolbar, the other is the navigation item in the outline
   * @param id
   * @param and
   */
  startDrag(id: string, e: DragEvent) {
    const node = this.store.getNodeById(id)!;
    // Get the DOM node of the element to be dragged
    const dom = this.store.getDoc().querySelector(`[data-editor-id="${id}"]`);
    if (!node || !dom) {
      e.preventDefault();
      return;
    }
    e.target?.addEventListener('dragend', this.dragEnd);

    this.lastX = e.clientX;
    this.lastY = e.clientY;

    if (this.manager.draggableContainer(node.id)) {
      this.curDragId = id;
      this.startX = e.clientX;
      this.startY = e.clientY;
      return;
    }

    this.dragElement = dom as HTMLElement;
    // const rect = dom.getBoundingClientRect();
    e.dataTransfer!.effectAllowed = 'move';
    e.dataTransfer!.setDragImage(
      this.createDragImage(id, node),
      0, //e.clientX - rect.left,
      0
    );
    e.dataTransfer!.setData(`dnd/ae-node-${id}`.toLowerCase(), ``);

    setTimeout(() => {
      this.store.setDragId(id);
      const region = node.parent;
      // Directly set to the container where the current node is located
      this.switchToRegion(e, region.id, region.region);
    }, 4);
  }

  /**
   * Something has been dragged in. Currently only components available inside internal face edges are supported, and other types will be supported later.
   * @param and
   */
  @autobind
  dragEnter(e: DragEvent) {
    const store = this.store;
    this.dragEnterCount++;
    const activeId = store.activeId;

    if (activeId) {
      const curNode = store.getNodeById(activeId);
      if (!curNode) {
        toastWarning('请先选择一个元素作为插入的位置。');
        return;
      }
      /*
      if (curNode?.schema?.type === 'flex') {
        toastWarning('Layout container components do not support dragging and inserting child elements.');
        return;
      }
      */
    } else {
      toastWarning('Please select an element as the insertion location.');
      return;
    }

    if (store.dragId || this.dragEnterCount !== 1) {
      return;
    }

    const types = e.dataTransfer!.types;
    if (types.length > 0) {
      for (let i = types.length - 1; i >= 0; i--) {
        if (/^dnd-dom\/(.*)$/.test(types[i])) {
          const selector = RegExp.$1;
          const dom = document.querySelector(selector);
          if (dom) {
            dom.addEventListener('dragend', this.dragEnd);
            const id = dom.getAttribute('data-dnd-id')!;
            const type = dom.getAttribute('data-dnd-type')!;
            const dataRaw = dom.getAttribute('data-dnd-data');
            const schema = dataRaw
              ? JSON.parse(dataRaw)
              : {
                  type: 'tpl',
                  tpl: 'Unknown'
                };
            store.setDragId(id, 'copy', type, schema);
            const containerId = store.activeContainerId;

            // If a component is currently selected, its first area is in the drag-in state by default.
            if (containerId) {
              const node = store.getNodeById(containerId);
              if (node?.childRegions.length) {
                let slotIndex = 0;
                node.childRegions.forEach((regionItem: any, index: number) => {
                  // Prefer body as the location to insert child elements
                  if (regionItem.region) {
                    slotIndex = index;
                  }
                });
                this.switchToRegion(
                  e,
                  node.id,
                  node.childRegions[slotIndex].region
                );
              }
            }
            break;
          }
        }
      }
    }

    if (this.curDragId && this.manager.draggableContainer(this.curDragId)) {
      // When dragging special layout elements, switchToRegion is not required
      // Determine whether the parent container is a free container
      const curNode = store.getNodeById(activeId);
      if (curNode) {
        const parentNode = curNode.parentId
          ? store.getNodeById(curNode.parentId)
          : undefined;
        if (parentNode?.schema?.isFreeContainer) {
          store.setDropId(curNode.parentId, 'body');
        }
      }
      return;
    }
  }

  /**
   * Every movement after dragging, except the logic of switching areas, is handled by DNDMode.
   * @param and
   */
  @autobind
  dragOver(e: DragEvent) {
    const store = this.store;
    const target = e.target as HTMLElement;
    e.preventDefault();

    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    const d = Math.max(Math.abs(dx), Math.abs(dy));

    if (
      d > 0 &&
      this.curDragId &&
      this.manager.draggableContainer(this.curDragId)
    ) {
      // Special layout element drag position
      const doc = store.getDoc();
      const parentDoc = parent?.window.document;

      // Adjust the coordinate value of the highlighted area in real time
      let dragHlBoxItem = doc.querySelector(
        `[data-hlbox-id='${this.curDragId}']`
      ) as HTMLElement;

      if (store.isMobile && !dragHlBoxItem && parentDoc) {
        dragHlBoxItem = parentDoc.querySelector(
          `[data-hlbox-id='${this.curDragId}']`
        ) as HTMLElement;
      }

      if (dragHlBoxItem) {
        const hlBoxInset = dragHlBoxItem.style.inset || 'auto';
        const hlBoxInsetArr = hlBoxInset.split(' ');
        const hlBInset = {
          top: dragHlBoxItem.style.top || hlBoxInsetArr[0] || 'auto',
          right: dragHlBoxItem.style.right || hlBoxInsetArr[1] || 'auto',
          bottom:
            dragHlBoxItem.style.bottom ||
            hlBoxInsetArr[2] ||
            hlBoxInsetArr[0] ||
            'auto',
          left:
            dragHlBoxItem.style.left ||
            hlBoxInsetArr[3] ||
            hlBoxInsetArr[1] ||
            'auto'
        };
        dragHlBoxItem.style.inset = `${
          hlBInset.top !== 'auto' ? unitFormula(hlBInset.top, dy) : 'auto'
        } ${
          hlBInset.right !== 'auto' ? unitFormula(hlBInset.right, -dx) : 'auto'
        } ${
          hlBInset.bottom !== 'auto'
            ? unitFormula(hlBInset.bottom, -dy)
            : 'auto'
        } ${
          hlBInset.left !== 'auto' ? unitFormula(hlBInset.left, dx) : 'auto'
        }`;
      }

      // Adjust the coordinate value of the dragged element in real time
      const dragContainerItem = doc.querySelector(
        `[data-editor-id='${this.curDragId}']`
      ) as HTMLElement;

      if (dragContainerItem) {
        const curInset = dragContainerItem.style.inset || 'auto';
        const insetArr = curInset.split(' ');
        const inset = {
          top: insetArr[0] || 'auto',
          right: insetArr[1] || 'auto',
          bottom: insetArr[2] || insetArr[0] || 'auto',
          left: insetArr[3] || insetArr[1] || 'auto'
        };
        dragContainerItem.style.inset = `${
          inset.top !== 'auto' ? unitFormula(inset.top, dy) : 'auto'
        } ${inset.right !== 'auto' ? unitFormula(inset.right, -dx) : 'auto'} ${
          inset.bottom !== 'auto' ? unitFormula(inset.bottom, -dy) : 'auto'
        } ${inset.left !== 'auto' ? unitFormula(inset.left, dx) : 'auto'}`;
      }
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      return;
    }

    if (!store.dropId || !target) {
      return;
    }

    const curRegion = target.closest(`[data-region][data-region-host]`);
    const hostId = curRegion?.getAttribute('data-region-host');
    const region = curRegion?.getAttribute('data-region');
    const containerElem = target.closest('[data-editor-id][data-container]');
    const containerId = containerElem?.getAttribute('data-editor-id');

    const isMetaPressed = e.ctrlKey || e.metaKey || e.altKey;

    if (isMetaPressed) {
      if (region && hostId && containerElem!.contains(curRegion)) {
        store.setPlanDropId(hostId, region);
      } else if (containerId) {
        store.setPlanDropId(containerId, '');
      }
      return;
    }

    // If it doesn't move, don't process it, to avoid constant shaking
    if (d < 5) {
      // if (!curRegion || hostId === store.dropId) {
      //   return;
      // }

      // Use the navigation on the left to determine which container to drag into.
      // Switch across container components, adding 200 milliseconds of delay
      // if (now - this.lastMoveAt > 200 && region && hostId) {
      //   this.switchToRegion(e, hostId!, region!);
      // }

      // if (now - this.lastMoveAt > 200 && region && hostId) {
      //   store.setPlanDropId(hostId, region);
      // }
      return;
    }

    this.lastX = e.clientX;
    this.lastY = e.clientY;

    // The areas under the same container component can be quickly switched
    if (store.dropId === hostId && region && region !== store.dropRegion) {
      this.switchToRegion(e, store.dropId, region);
      return;
    }

    store.setPlanDropId('', '');
    this.dndMode?.over(e, this.dragGhost!);
  }

  /**
   * Drag and drop logic.
   * @param and
   */
  @autobind
  async drop(e: DragEvent) {
    const store = this.store;
    if (this.curDragId && this.manager.draggableContainer(this.curDragId)) {
      // Update schema-style data after dragging special layout elements
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      this.manager.updateContainerStyleByDrag(this.curDragId, dx, dy);
      // Reset the drag ID to avoid affecting other drag elements
      this.curDragId = '';
      this.store.setDropId('');
      return;
    }

    if (!store.dropId) {
      // If there is no drag accepting container, skip it directly
      return;
    }

    const beforeId = this.dndMode?.getDropBeforeId();
    const position = this.dndMode?.getDropPosition?.();

    // If the drop event is interrupted, return directly
    if (this.dndMode?.interruptionDrop?.()) {
      return;
    }
    if (store.dragMode === 'move') {
      this.manager.move(
        store.dropId,
        store.dropRegion,
        store.dragId,
        beforeId,
        {position}
      );
    } else if (store.dragMode === 'copy') {
      let schema = store.dragSchema;
      const dropId = store.dropId;
      const dropRegion = store.dropRegion;
      let subRenderer: SubRendererInfo | undefined = undefined;

      if (store.dragType === 'subrenderer') {
        subRenderer = find(store.subRenderers, r => r.id === store.dragId);
        if (subRenderer?.scaffoldForm) {
          schema = await this.manager.scaffold(
            subRenderer.scaffoldForm,
            schema
          );
        }
      }

      this.manager.addChild(
        dropId,
        dropRegion,
        schema,
        beforeId,
        subRenderer,
        {
          id: store.dragId,
          type: store.dragType,
          data: store.dragSchema,
          position: position
        },
        false
      );
    }
  }

  /**
   * Called when dragging away.
   * @param and
   */
  @autobind
  dragLeave(e: DragEvent) {
    this.dragEnterCount--;
  }

  /**
   * The drag is over.
   * @param and
   */
  @autobind
  dragEnd(e: DragEvent) {
    e.target?.removeEventListener('dragend', this.dragEnd);

    this.dndMode?.leave(e, this.dragGhost!);
    delete this.dndMode;
    // bca-disable-next-line
    this.dragGhost.innerHTML = '';
    this.store.setDragId('');
    this.store.setDropId('');
    this.store.setPlanDropId('', '');
    this.disposeDragImage();
    this.dragEnterCount = 0;
  }

  /**
   * Automatically add css such as is-dragging to the dragging element.
   */
  @autobind
  updateDragElements(dragId: string) {
    if (dragId && this.manager.draggableContainer(dragId)) {
      return;
    }
    if (dragId) {
      [].slice
        .call(
          this.store.getDoc().querySelectorAll(`[data-editor-id="${dragId}"]`)
        )
        .forEach((elem: HTMLElement) => elem.classList.add('ae-is-draging'));
    } else {
      [].slice
        .call(this.store.getDoc().querySelectorAll(`.ae-is-draging`))
        .forEach((elem: HTMLElement) => elem.classList.remove('ae-is-draging'));
    }
  }

  /**
   * Automatically add css such as is-dragenter to the dragged area.
   */
  @autobind
  updateDropRegion(
    value: {id: string; region: string},
    oldValue?: {id: string; region: string}
  ) {
    if (
      this.store.dragId &&
      this.manager.draggableContainer(this.store.dragId)
    ) {
      return;
    }
    if (oldValue?.id && oldValue.region) {
      this.store
        .getDoc()
        .querySelector(
          `[data-region="${oldValue.region}"][data-region-host="${oldValue.id}"]`
        )
        ?.classList.remove('is-dragenter');
    }

    if (value.id && value.region) {
      this.store
        .getDoc()
        .querySelector(
          `[data-region="${value.region}"][data-region-host="${value.id}"]`
        )
        ?.classList.add('is-dragenter');
    }
  }

  // /**
  // * Automatically highlight the area to be activated.
  //  */
  // @autobind
  // updatePlanDropRegion(
  //   value: {id: string; region: string},
  //   oldValue?: {id: string; region: string}
  // ) {
  //   if (
  //     this.store.dragId &&
  //     this.manager.draggableContainer(this.store.dragId)
  //   ) {
  //     return;
  //   }
  //   if (oldValue?.id && oldValue.region) {
  //     this.store
  //       .getDoc()
  // .querySelector(
  //         `[data-region="${oldValue.region}"][data-region-host="${oldValue.id}"]`
  //       )
  //       ?.classList.remove('is-entering');
  //   }

  //   if (value.id && value.region) {
  //     this.store
  //       .getDoc()
  // .querySelector(
  //         `[data-region="${value.region}"][data-region-host="${value.id}"]`
  //       )
  //       ?.classList.add('is-entering');
  //   }
  // }

  /**
   * Destroy function.
   */
  dispose() {
    this.disposeDragImage();
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
  }
}
