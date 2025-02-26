import {
  BasePlugin,
  BaseEventContext,
  BasicToolbarItem,
  ContextMenuItem,
  ContextMenuEventContext,
  BasicPanelItem,
  BuildPanelEventContext,
  PluginEvent,
  InsertEventContext,
  PluginInterface
} from '../plugin';
import {registerEditorPlugin} from '../manager';
// @ts-ignore
import type {MenuItem} from 'amis-ui/lib/components/ContextMenu';
import {EditorNodeType} from '../store/node';

/**
 * Used to add some basic toolbar buttons to the currently selected element.
 */
export class BasicToolbarPlugin extends BasePlugin {
  static scene = ['layout'];
  order = -9999;

  buildEditorToolbar(
    {id, schema, info}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    const store = this.manager.store;
    const node = store.getNodeById(id)!;
    const parent = store.getSchemaParentById(id);
    const draggableContainer = this.manager.draggableContainer(id);
    // Determine whether it is an adsorption container
    const isSorptionContainer = schema?.isSorptionContainer || false;
    // let vertical = true;
    const regionNode = node.parent as EditorNodeType; // Parent node
    if ((Array.isArray(parent) && regionNode?.isRegion) || draggableContainer) {
      const host = node.host as EditorNodeType;

      if ((node.draggable || draggableContainer) && !isSorptionContainer) {
        toolbars.push({
          id: 'drag',
          iconSvg: 'drag-btn',
          icon: 'fa fa-arrows',
          tooltip: 'Press and drag to adjust the position',
          placement: 'bottom',
          draggable: true,
          order: -1000,
          onDragStart: this.manager.startDrag.bind(this.manager, id)
        });
      }

      const idx = parent?.indexOf(schema);

      // if (idx > 0 && node.moveable) {
      //   let icon = 'fa fa-arrow-up';
      // let tooltip = 'Move up';

      //   const dom = this.manager.store
      //     .getDoc()
      //     .querySelector(`[data-editor-id="${id}"]`);
      //   const prevDom = this.manager.store
      //     .getDoc()
      //     .querySelector(`[data-editor-id="${parent[idx - 1]?.$$id}"]`);

      //   if (dom && prevDom) {
      //     const prevRect = prevDom.getBoundingClientRect();
      //     const rect = dom.getBoundingClientRect();

      //     if (Math.abs(rect.x - prevRect.x) > Math.abs(rect.y - prevRect.y)) {
      //       vertical = false;
      //       icon = 'fa fa-arrow-left';
      // tooltip = 'Move forward';
      //     }

      //     toolbars.push({
      //       icon: icon,
      // // tooltip: 'Move forward (⌘ + ←)',
      //       tooltip: tooltip,
      //       onClick: () => this.manager.moveUp()
      //     });
      //   }
      // }

      // if (idx < parent.length - 1 && node.moveable) {
      //   let icon = 'fa fa-arrow-down';
      // let tooltip = 'Move down';

      //   const dom = this.manager.store
      //     .getDoc()
      //     .querySelector(`[data-editor-id="${id}"]`);
      //   const nextDom = this.manager.store
      //     .getDoc()
      //     .querySelector(`[data-editor-id="${parent[idx + 1]?.$$id}"]`);

      //   if (dom && nextDom) {
      //     const nextRect = nextDom.getBoundingClientRect();
      //     const rect = dom.getBoundingClientRect();

      //     if (Math.abs(rect.x - nextRect.x) > Math.abs(rect.y - nextRect.y)) {
      //       vertical = false;
      //       icon = 'fa fa-arrow-right';
      // tooltip = 'Move back';
      //     }

      //     toolbars.push({
      //       icon: icon,
      // // tooltip: 'Move back (⌘ + →)',
      //       tooltip: tooltip,
      //       onClick: () => this.manager.moveDown()
      //     });
      //   }
      // }

      // if (node.removable) {
      //   toolbars.push({
      // icon: 'fa fa-trash-o',
      // // tooltip: 'Delete (Del)',
      // tooltip: 'Delete',
      //     onClick: () => this.manager.del(id)
      //   });
      // }

      if (
        !host?.memberImmutable(regionNode.region) &&
        store.panels.some(Panel => Panel.key === 'renderers') &&
        store.toolbarMode === 'default'
      ) {
        const nextId = parent[idx + 1]?.$$id;

        toolbars.push(
          {
            id: 'insert-before',
            iconSvg: 'left-arrow-to-left',
            tooltip: 'Insert component forward',
            // level: 'special',
            placement: 'bottom',
            // placement: vertical ? 'bottom' : 'right',
            // className: vertical
            //   ? 'ae-InsertBefore is-vertical'
            //   : 'ae-InsertBefore',
            onClick: () =>
              this.manager.showInsertPanel(
                regionNode.region,
                regionNode.id,
                regionNode.preferTag,
                'insert',
                undefined,
                id
              )
          },
          {
            id: 'insert-after',
            iconSvg: 'arrow-to-right',
            tooltip: 'Insert component backwards',
            // level: 'special',
            placement: 'bottom',
            // placement: vertical ? 'top' : 'left',
            // className: vertical
            //   ? 'ae-InsertAfter is-vertical'
            //   : 'ae-InsertAfter',
            onClick: () =>
              this.manager.showInsertPanel(
                regionNode.region,
                regionNode.id,
                regionNode.preferTag,
                'insert',
                undefined,
                nextId
              )
          }
        );
      }
    }

    if (
      !node.isVitualRenderer &&
      (node.info.plugin.popOverBody || node.info.plugin.popOverBodyCreator)
    ) {
      toolbars.push({
        id: 'edit',
        icon: 'fa fa-pencil',
        tooltip: 'Edit',
        placement: 'bottom',
        onClick: e => this.manager.openNodePopOverForm(node.id)
      });
    }

    // if (node.duplicatable || node.duplicatable === undefined) {
    //   toolbars.push({
    //     iconSvg: 'copy-btn',
    // icon: 'does',
    // tooltip: 'Copy',
    //     placement: 'bottom',
    //     order: 999,
    //     onClick: this.manager.duplicate.bind(this.manager, id)
    //   });
    // }

    if (node.removable || node.removable === undefined) {
      toolbars.push({
        id: 'delete',
        iconSvg: 'delete-btn',
        icon: 'do',
        tooltip: 'Delete',
        placement: 'bottom',
        order: 999,
        onClick: this.manager.del.bind(this.manager, id)
      });
    }
    if (store.toolbarMode === 'default') {
      toolbars.push({
        id: 'more',
        iconSvg: 'more-btn',
        icon: 'fa fa-cog',
        tooltip: 'More',
        placement: 'bottom',
        order: 1000,
        onClick: e => {
          if (!e.defaultPrevented) {
            const info = (
              e.target as HTMLElement
            ).parentElement!.getBoundingClientRect();

            // 150 is the width of contextMenu
            //Default right alignment
            let x = window.scrollX + info.left + info.width - 150;

            // If the display is not complete, change it to left alignment
            if (x < 0) {
              x = window.scrollX + info.left;
            }

            this.manager.openContextMenu(id, '', {
              x: x,
              y: window.scrollY + info.top + info.height + 8
            });
          }
        }
      });
    }

    if (info.scaffoldForm?.canRebuild ?? info.plugin.scaffoldForm?.canRebuild) {
      toolbars.push({
        id: 'build',
        iconSvg: 'harmmer',
        tooltip: `Quickly build "${info.plugin.name}"`,
        placement: 'bottom',
        onClick: () => this.manager.reScaffoldV2(id)
      });
    }
  }

  buildEditorContextMenu(
    {id, schema, region, info, selections}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    const manager = this.manager;
    const store = manager.store;
    const parent = store.getSchemaParentById(id);
    const node = store.getNodeById(id)!;
    const paths = store.getNodePathById(id);
    const first = paths.pop()!;
    const host = node.host as EditorNodeType;
    const regionNode = node.parent as EditorNodeType;

    if (selections.length) {
      //Right-click menu for multiple selections
      if (store.toolbarMode === 'default') {
        menus.push({
          id: 'copy',
          label: 'Repeat one copy',
          icon: 'copy-icon',
          disabled: selections.some(item => !item.node.duplicatable),
          onSelect: () => manager.duplicate(selections.map(item => item.id))
        });
      }

      menus.push({
        id: 'unselect',
        label: 'Cancel multiple selection',
        icon: 'cancel-icon',
        onSelect: () =>
          store.setActiveId(
            id,
            region || node.childRegions.find(i => i.region)?.region
          )
      });

      menus.push({
        id: 'delete',
        label: 'Delete',
        icon: 'delete-icon',
        disabled: selections.some(item => !item.node.removable),
        className: 'text-danger',
        onSelect: () => manager.del(selections.map(item => item.id))
      });
    } else if (region) {
      const renderersPanel = store.panels.find(
        item => item.key === 'renderers'
      );

      if (renderersPanel) {
        // After adding the region, you don't need to 'insert component'
        /*
        menus.push({
          label: 'Insert component',
          onHighlight: (isOn: boolean) => isOn && store.setHoverId(id, region),
          onSelect: () => manager.showInsertPanel(region, id)
        });
        */
        menus.push({
          id: 'insert',
          label: 'Insert component',
          onHighlight: (isOn: boolean) => isOn && store.setHoverId(id, region),
          onSelect: () => store.showInsertRendererPanel()
        });

        menus.push({
          id: 'clear',
          label: 'Clear',
          onSelect: () => manager.emptyRegion(id, region)
        });

        menus.push({
          id: 'paste',
          label: 'Paste',
          onSelect: () => manager.paste(id, region)
        });
      }
    } else {
      if (store.toolbarMode === 'mini') {
        return;
      }
      menus.push({
        id: 'select',
        label: `Select ${first.label}`,
        disabled: store.activeId === first.id,
        data: id,
        onSelect: (id: string) => store.setActiveId(id),
        onHighlight: (isHiglight: boolean, id: string) =>
          isHiglight && store.setHoverId(id)
      });

      if (paths.length) {
        const children = paths
          .filter(node => !node.isRegion && node.info?.editable !== false)
          .reverse()
          .map(node => ({
            label: node.label,
            data: node.id,
            onSelect: (id: string) => store.setActiveId(id),
            onHighlight: (isHiglight: boolean, currentId: string) =>
              isHiglight && store.setHoverId(currentId)
          }));

        children.length &&
          menus.push({
            label: 'Selected level',
            children: children
          });
      }

      menus.push({
        id: 'unselect',
        label: 'Uncheck',
        disabled: !store.activeId || store.activeId !== id,
        onSelect: () => store.setActiveId('')
      });

      menus.push('|');

      const idx = Array.isArray(parent) ? parent.indexOf(schema) : -1;
      if (host?.schema?.isFreeContainer) {
        menus.push({
          label: 'Adjustment level',
          disabled:
            !Array.isArray(parent) || parent.length <= 1 || !node.moveable,
          children: [
            {
              id: 'move-top',
              label: 'Put on top',
              disabled: idx === parent.length - 1,
              onSelect: () => manager.moveTop()
            },
            {
              id: 'move-bottom',
              label: 'Put at the bottom',
              disabled: idx === 0,
              onSelect: () => manager.moveBottom()
            },
            {
              id: 'move-forward',
              label: 'Move up one level',
              disabled: idx === parent.length - 1,
              onSelect: () => manager.moveDown()
            },
            {
              id: 'move-backward',
              label: 'Move down one level',
              disabled: idx === 0,
              onSelect: () => manager.moveUp()
            }
          ]
        });
      } else {
        menus.push({
          id: 'move-forward',
          label: 'Move forward',
          disabled: !(Array.isArray(parent) && idx > 0) || !node.moveable,
          // || !node.prevSibling,
          onSelect: () => manager.moveUp()
        });

        menus.push({
          id: 'move-backward',
          label: 'Move backwards',
          disabled:
            !(Array.isArray(parent) && idx < parent.length - 1) ||
            !node.moveable,
          // || !node.nextSibling,
          onSelect: () => manager.moveDown()
        });
      }
      menus.push('|');

      menus.push({
        id: 'copy',
        label: 'Repeat one copy',
        disabled: !node.duplicatable,
        onSelect: () => manager.duplicate(id)
      });

      menus.push({
        id: 'copy-config',
        label: 'Copy configuration',
        onSelect: () => manager.copy(id)
      });

      menus.push({
        id: 'cat-config',
        label: 'Cut configuration',
        disabled: !node.removable,
        onSelect: () => manager.cut(id)
      });

      menus.push({
        id: 'paste-config',
        label: 'Paste configuration',
        disabled:
          !Array.isArray(parent) ||
          !node.parent ||
          node.info?.typeMutable === false ||
          !node.replaceable,
        onSelect: () => manager.paste(id)
      });

      menus.push({
        id: 'delete',
        label: 'Delete',
        disabled: !node.removable,
        className: 'text-danger',
        onSelect: () => manager.del(id)
      });

      /** "Click (insert backward by default)" + "Move forward" can replace "insert node in front" */
      /*
      menus.push({
        label: 'Insert node before',
        disabled:
          !Array.isArray(parent) ||
          !regionNode ||
          !regionNode.isRegion ||
          !host ||
          host.memberImmutable(regionNode.region) ||
          !store.panels.some(Panel => Panel.key === 'renderers'),
        onSelect: () =>
          this.manager.showInsertPanel(
            regionNode.region,
            regionNode.id,
            regionNode.preferTag,
            'insert',
            undefined,
            id
          )
      });
      */

      /** "Click (insert backward by default)" can replace "insert node behind" */
      /*
      menus.push({
        label: 'Insert node later',
        disabled:
          !Array.isArray(parent) ||
          !regionNode ||
          !regionNode.isRegion ||
          !host ||
          host.memberImmutable(regionNode.region) ||
          !store.panels.some(Panel => Panel.key === 'renderers'),
        onSelect: () =>
          this.manager.showInsertPanel(
            regionNode.region,
            regionNode.id,
            regionNode.preferTag,
            'insert',
            undefined,
            parent[idx + 1]?.$$id
          )
      });
      */

      menus.push('|');

      // const configPanel = store.panels.find(item => item.key === 'config');
      // menus.push({
      // label: 'Settings',
      // onSelect: () => manager.openConfigPanel(id),
      //   disabled: !configPanel
      // });

      // const codePanel = store.panels.find(item => item.key === 'code');
      // menus.push({
      // label: 'Edit code',
      // onSelect: () => manager.openCodePanel(id),
      //   disabled:
      //     !codePanel || (store.activeId === id && store.getPanelKey() === 'code')
      // });

      menus.push({
        id: 'undo',
        label: 'Undo',
        disabled: !store.canUndo,
        onSelect: () => store.undo()
      });

      menus.push({
        id: 'redo',
        label: 'Redo',
        disabled: !store.canRedo,
        onSelect: () => store.redo()
      });

      menus.push('|');

      /** You can use "Click (insert backward by default)" instead*/
      /*
      const renderersPanel = store.panels.find(
        item => item.key === 'renderers'
      );
      if (first.childRegions.length && renderersPanel) {
        if (first.childRegions.length > 1) {
          menus.push({
            label: 'Insert component',
            children: first.childRegions.map(region => ({
              label: `${region.label}`,
              data: region.region,
              onHighlight: (isOn: boolean, region: string) =>
                isOn ? store.setHoverId(id, region) : store.setHoverId(''),
              onSelect: (region: string) => manager.showInsertPanel(region, id)
            }))
          });
        } else {
          menus.push({
            label: 'Insert component',
            data: first.childRegions[0].region,
            onHighlight: (isOn: boolean, region: string) =>
              isOn ? store.setHoverId(id, region) : store.setHoverId(''),
            onSelect: (region: string) => manager.showInsertPanel(region, id)
          });
        }
      }
      */

      // Use the new version of the insert component panel (drawer pop-up)
      const renderersPanel = store.panels.find(
        item => item.key === 'renderers'
      );
      if (first.childRegions.length && renderersPanel) {
        if (first.childRegions.length > 1) {
          menus.push({
            id: 'insert',
            label: 'Insert component',
            children: first.childRegions.map(region => ({
              label: `${region.label}`,
              data: region.region,
              onHighlight: (isOn: boolean, region: string) =>
                isOn ? store.setHoverId(id, region) : store.setHoverId(''),
              onSelect: () => store.showInsertRendererPanel()
            }))
          });
        } else {
          menus.push({
            id: 'insert',
            label: 'Insert component',
            data: first.childRegions[0].region,
            onHighlight: (isOn: boolean, region: string) =>
              isOn ? store.setHoverId(id, region) : store.setHoverId(''),
            onSelect: () => store.showInsertRendererPanel()
          });
        }
      }
      if (node.type === 'container') {
        menus.push({
          id: 'clear',
          label: 'Empty container',
          disabled: !node.schema.body?.length,
          onSelect: () => manager.emptyRegion(id, 'body')
        });
      }

      menus.push({
        id: 'replace',
        label: 'Replace component',
        disabled:
          !node.host ||
          node.info?.typeMutable === false ||
          !node.parent.isRegion ||
          !store.panels.some(Panel => Panel.key === 'renderers') ||
          !node.replaceable,
        onSelect: () => manager.showReplacePanel(id)
      });
    }

    if (
      !selections.length &&
      (info.plugin.scaffoldForm?.canRebuild || info.scaffoldForm?.canRebuild)
    ) {
      menus.push({
        id: 'build',
        label: `Quickly build "${info.plugin.name}"`,
        disabled: schema.$$commonSchema || schema.$$formSchema,
        onSelect: () =>
          this.manager.reScaffold(
            id,
            info.scaffoldForm || info.plugin.scaffoldForm!,
            schema
          )
      });
    }
  }

  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    if (!context.selections.length) {
      return;
    }
    const store = this.manager.store;

    let menus: Array<ContextMenuItem> = [];
    const contextMenuContext: ContextMenuEventContext = {
      ...context,
      data: menus,
      region: ''
    };

    menus = this.manager.buildContextMenus(contextMenuContext);

    if (menus.length) {
      panels.push({
        key: 'contextmenu',
        icon: 'fa fa-cog',
        title: 'Operation',
        menus: menus,
        render: this.manager.makeSchemaFormRender({
          body: [
            {
              type: 'button-group',
              buttons: menus
                .filter(item => item !== '|')
                .map(menu => ({
                  ...(menu as MenuItem),
                  type: 'button',
                  onClick: (menu as MenuItem).onSelect
                }))
            } as any
          ],
          panelById: store.activeId
        })
      });
    }
  }

  afterInsert(event: PluginEvent<InsertEventContext>) {
    const context = event.context;

    if (context.node && context.subRenderer?.plugin?.popOverBody) {
      const id = context.data.$$id;

      if (id) {
        setTimeout(() => {
          this.manager.setActiveId(id);
          requestAnimationFrame(() => {
            this.manager.openNodePopOverForm(id);
          });
        }, 200);
      }
    }
  }
}

registerEditorPlugin(BasicToolbarPlugin);
