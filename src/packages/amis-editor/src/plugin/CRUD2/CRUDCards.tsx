/**
 * @file CRUDCards.tsx
 * @desc CRUD2 of card mode
 */

import React from 'react';
import {autobind} from 'amis';
import {
  EditorManager,
  JSONPipeIn,
  BuildPanelEventContext,
  registerEditorPlugin
} from 'amis-editor-core';
import {DSBuilderManager, DSFeatureEnum} from '../../builder';
import {Table2RenderereEvent, Table2RendererAction} from '../Table2';
import {BaseCRUDPlugin} from './BaseCRUD';

export class CRUDCardsPlugin extends BaseCRUDPlugin {
  static id = 'CardsCRUDPlugin';

  disabledRendererPlugin = true;

  name = 'Card List';

  panelTitle: 'Card List';

  icon = 'fa fa-window-maximize';

  panelIcon = 'fa fa-table';

  subPanelIcon = 'fill-table';

  pluginIcon = 'cards-plugin';

  panelJustify = true;

  multifactor = true;

  isBaseComponent = true;

  description =
    'Add, delete, modify and query data around the card list. Responsible for data pulling, paging, single operation, batch operation, sorting, quick editing and other functions, integrated query conditions. ';

  order = -1000;

  $schema = '/schemas/CRUD2CardsSchema.json';

  docLink = '/amis/zh-CN/components/cards';

  previewSchema: Record<string, any> = this.generatePreviewSchema('cards');

  scaffold: any = this.generateScaffold('cards');

  constructor(manager: EditorManager) {
    super(manager, Table2RenderereEvent, Table2RendererAction);
    this.dsManager = new DSBuilderManager(manager);
  }

  /** Non-entity data sources are built by default*/
  panelBodyCreator = (context: BuildPanelEventContext) => {
    /** Write dynamic controls first*/
    this.dynamicControls = {
      /** Column configuration */
      columns: context => this.renderColumnsControl(context),
      /** Toolbar configuration */
      toolbar: context => this.renderToolbarCollapse(context),
      /**Search bar*/
      filters: context => this.renderFiltersCollapse(context)
    };

    return this.baseCRUDPanelBody(context);
  };

  @autobind
  renderColumnsControl(context: BuildPanelEventContext) {
    const builder = this.dsManager.getBuilderBySchema(context.node.schema);

    return {
      title: 'Column Settings',
      order: 5,
      body: [
        {
          type: 'ae-crud-column-control',
          name: 'columns',
          nodeId: context.id,
          builder
        }
      ]
    };
  }

  @autobind
  renderToolbarCollapse(context: BuildPanelEventContext) {
    const builder = this.dsManager.getBuilderBySchema(context.node.schema);

    return {
      order: 20,
      title: 'Toolbar',
      body: [
        {
          type: 'ae-crud-toolbar-control',
          name: 'headerToolbar',
          nodeId: context.id,
          builder
        }
      ]
    };
  }

  @autobind
  renderFiltersCollapse(context: BuildPanelEventContext) {
    const builder = this.dsManager.getBuilderBySchema(context.node.schema);
    const collection: any[] = [];

    builder.features.forEach(feat => {
      if (/Query$/.test(feat)) {
        collection.push({
          type: 'ae-crud-filters-control',
          name:
            feat === DSFeatureEnum.SimpleQuery ||
            feat === DSFeatureEnum.AdvancedQuery
              ? 'filter'
              : feat === DSFeatureEnum.FuzzyQuery
              ? 'headerToolbar'
              : undefined,
          label:
            feat === DSFeatureEnum.SimpleQuery
              ? 'Simple query'
              : feat === DSFeatureEnum.AdvancedQuery
              ? 'Advanced search'
              : 'Fuzzy query',
          nodeId: context.id,
          feat: feat,
          builder
        });
      }
    });

    return collection.length > 0
      ? {
          order: 10,
          title: 'Search settings',
          body: collection
        }
      : undefined;
  }
}

// registerEditorPlugin(CRUDCardsPlugin);
