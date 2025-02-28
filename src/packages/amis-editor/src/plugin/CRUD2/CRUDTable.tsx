/**
 * @file CRUDTable.tsx
 * @desc CRUD2 of table mode
 */

import React from 'react';
import sortBy from 'lodash/sortBy';
import {autobind} from '@/packages/amis/src';
import {
  EditorManager,
  JSONPipeIn,
  BuildPanelEventContext,
  EditorNodeType,
  registerEditorPlugin
} from '@/packages/amis-editor-core/src';
import {
  DSBuilder,
  DSBuilderManager,
  DSFeatureEnum,
  DSFeatureType
} from '../../builder';
import {Table2RenderereEvent, Table2RendererAction} from '../Table2';
import {BaseCRUDPlugin} from './BaseCRUD';

export class CRUDTablePlugin extends BaseCRUDPlugin {
  static id = 'TableCRUDPlugin';

  panelJustify = true;

  multifactor = true;

  isBaseComponent = true;

  description =
    'It is used to implement the addition, deletion, modification and query of data, and to display table data. You can configure column information, and then the associated data can be displayed. It supports nesting, super headers, fixed columns, fixed headers, merged cells, etc. ';

  order = -950;

  $schema = '/schemas/CRUD2TableSchema.json';

  docLink = '/amis/zh-CN/components/table2';

  previewSchema: Record<string, any> = this.generatePreviewSchema('table2');

  scaffold: any = this.generateScaffold('table2');

  constructor(manager: EditorManager) {
    super(manager, Table2RenderereEvent, Table2RendererAction);
    this.dsManager = new DSBuilderManager(manager);
  }

  /** Non-entity data sources are built by default*/
  panelBodyCreator = (context: BuildPanelEventContext) => {
    return this.baseCRUDPanelBody(context);
  };
}

registerEditorPlugin(CRUDTablePlugin);
