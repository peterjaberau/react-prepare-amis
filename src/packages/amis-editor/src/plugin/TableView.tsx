/**
 * @file table view component visual editing
 */

import React from 'react';
import {PluginInterface, registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {
  BaseEventContext,
  BasePlugin,
  BasicPanelItem,
  BasicToolbarItem,
  BuildPanelEventContext,
  RegionConfig,
  RendererInfo,
  VRendererConfig,
  ContextMenuEventContext,
  ContextMenuItem
} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';
import {VRenderer} from '@/packages/amis-editor-core/src';
import {type TableViewSchema} from '@/packages/amis/src';
import {JSONGetById} from '@/packages/amis-editor-core/src';
import {TableViewEditor} from '../component/TableViewEditor';
import {generateId} from '../util';

/**
 * Features not yet implemented:
 * * To delete by column, you need to reduce some colspan by one
 * * Split cells horizontally/vertically, increasing colspan and rowspan of surrounding nodes
 */

// td node template
const TD_TEMPLATE = {
  body: {
    type: 'tpl',
    wrapperComponent: '',
    tpl: '---'
  }
} as {body: {type: 'tpl'}};

/**
 * Traverse the table and calculate the actual row and column of each cell in the final rendering. Many subsequent operations will need to use this as a basis
 * For example, when inserting a column, you cannot base it on the position of the cell in the array, but on the column to which the cell belongs when it is actually rendered.
 */
function getCellRealPosition(table: TableViewSchema) {
  if (!table) {
    return {
      trs: []
    };
  }
  // Record which rows and columns are merged, so that these rows and columns will be skipped in subsequent calculations
  const spannedCell: boolean[][] = [];
  const trs = table.trs || [];

  let currentRow = 0; // The actual row currently rendered
  for (const tr of trs) {
    const tds = tr.tds || [];

    let currentCol = 0; // The actual column currently rendered
    for (const td of tds) {
      // Skip the merged rows
      while (spannedCell[currentRow] && spannedCell[currentRow][currentCol]) {
        currentCol = currentCol + 1;
      }
      const rowspan = td.rowspan || 1;
      const colspan = td.colspan || 1;
      // Mark the subsequent line merging situation
      if (rowspan > 1 || colspan > 1) {
        for (let i = 0; i < rowspan; i++) {
          const spanRow = currentRow + i;
          if (!spannedCell[spanRow]) {
            spannedCell[spanRow] = [];
          }
          for (let j = 0; j < colspan; j++) {
            const spanCol = currentCol + j;
            spannedCell[spanRow][spanCol] = true;
          }
        }
      }
      (td as any).$$row = currentRow;
      (td as any).$$col = currentCol;
      currentCol = currentCol + 1;
    }

    currentRow = currentRow + 1;
  }
  return table;
}

export class TableViewPlugin extends BasePlugin {
  static id = 'TableViewPlugin';
  // Associated renderer name
  rendererName = 'table-view';
  $schema = '/schemas/TableViewSchema.json';

  // Component name
  name = 'Table View';
  isBaseComponent = true;
  icon = 'fa fa-columns';
  pluginIcon = 'table-view-plugin';
  description = 'Table type display';
  searchKeywords = 'Table display';
  docLink = '/amis/zh-CN/components/table-view';
  tags = ['function'];
  scaffold = {
    type: 'table-view',
    trs: [
      {
        background: '#F7F7F7',
        tds: [
          {
            body: {
              type: 'tpl',
              wrapperComponent: '',
              tpl: 'region',
              id: generateId()
            }
          },
          {
            body: {
              type: 'tpl',
              wrapperComponent: '',
              id: generateId(),
              tpl: 'city'
            }
          },
          {
            body: {
              type: 'tpl',
              wrapperComponent: '',
              id: generateId(),
              tpl: 'sales volume'
            }
          }
        ]
      },
      {
        tds: [
          {
            rowspan: 2,
            body: {
              type: 'tpl',
              wrapperComponent: '',
              id: generateId(),
              tpl: 'North China'
            }
          },
          {
            body: {
              type: 'tpl',
              wrapperComponent: '',
              id: generateId(),
              tpl: 'Beijing'
            }
          },
          {
            body: {
              type: 'tpl',
              wrapperComponent: '',
              id: generateId(),
              tpl: '${beijing}'
            }
          }
        ]
      },
      {
        tds: [
          {
            body: {
              type: 'tpl',
              wrapperComponent: '',
              id: generateId(),
              tpl: 'Tianjin'
            }
          },
          {
            body: {
              type: 'tpl',
              wrapperComponent: '',
              id: generateId(),
              tpl: '${tianjing}'
            }
          }
        ]
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'Content area',
      renderMethod: 'renderTdBody',
      preferTag: 'display'
    }
  ];

  panelTitle = 'Table View';

  panelJustify = true;

  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        className: 'p-none',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                getSchemaTpl('caption'),
                {
                  label: 'Title position',
                  name: 'captionSide',
                  type: 'button-group-select',
                  size: 'sm',
                  mode: 'row',
                  className: 'ae-buttonGroupSelect--justify',
                  visibleOn: 'this.caption',
                  options: [
                    {label: 'Top', value: 'top'},
                    {label: 'Bottom', value: 'bottom'}
                  ]
                },
                {
                  type: 'input-text',
                  label: 'View width',
                  name: 'width',
                  clearable: true
                },
                {
                  type: 'input-text',
                  label: 'Default internal spacing of cells',
                  name: 'padding',
                  clearable: true
                },
                {
                  label: 'Show border',
                  name: 'border',
                  type: 'switch',
                  mode: 'row',
                  pipeIn: defaultValue(true),
                  inputClassName: 'inline-flex justify-between flex-row-reverse'
                },
                {
                  label: 'border color',
                  type: 'input-color',
                  name: 'borderColor',
                  visibleOn:
                    'this.border || typeof this.border === "undefined"',
                  pipeIn: defaultValue('#eceff8')
                }
              ]
            },
            getSchemaTpl('status')
          ])
        ]
      },
      {
        title: 'Appearance',
        className: 'p-none',
        body: getSchemaTpl('collapseGroup', [...getSchemaTpl('theme:common')])
      }
    ])
  ];

  fieldWrapperResolve = (dom: HTMLElement) => dom;

  overrides = {
    renderTd(this: any, td: any, colIndex: number, rowIndex: number) {
      const dom = this.super(td, colIndex, rowIndex);
      const info: RendererInfo = this.props.$$editor;

      if (!info || !td.$$id) {
        return dom;
      }

      const plugin = info.plugin as TableViewPlugin;
      const id = td.$$id;
      return (
        <VRenderer
          type={info.type}
          plugin={info.plugin}
          renderer={info.renderer}
          key={id}
          $schema="/schemas/TdObject.json"
          hostId={info.id}
          memberIndex={colIndex} // TODO: colIndex is actually incorrect, you need to add schema filter function to enable the plugin
          name={`${`Cell${rowIndex + 1},${colIndex + 1}`}`}
          id={id}
          draggable={false}
          wrapperResolve={plugin.fieldWrapperResolve}
          schemaPath={`${info.schemaPath}/td`}
          path={`${this.props.$path}/tr/${rowIndex}/td/${colIndex}`}
          data={this.props.data}
          children={dom}
        />
      );
    },
    renderTr(this: any, tr: any, rowIndex: number) {
      const dom = this.super(tr, rowIndex);
      const info: RendererInfo = this.props.$$editor;

      if (!info || !tr.$$id) {
        return dom;
      }

      const plugin = info.plugin as TableViewPlugin;
      const id = tr.$$id;
      return (
        <VRenderer
          type={info.type}
          plugin={info.plugin}
          renderer={info.renderer}
          key={id}
          $schema="/schemas/TrObject.json"
          hostId={info.id}
          memberIndex={rowIndex}
          name={`${`行 ${rowIndex + 1}`}`}
          id={id}
          draggable={false}
          wrapperResolve={plugin.fieldWrapperResolve}
          schemaPath={`${info.schemaPath}/tr`}
          path={`${this.props.$path}/tr/${rowIndex}`}
          data={this.props.data}
          children={dom}
        />
      );
    }
  };

  tdVRendererConfig: VRendererConfig = {
    panelTitle: 'Cell',
    panelBodyCreator: (context: BaseEventContext) => {
      return [
        getSchemaTpl('tabs', [
          {
            title: 'Attributes',
            className: 'p-none',
            body: [
              getSchemaTpl('collapseGroup', [
                {
                  title: 'Display',
                  body: [
                    {
                      label: 'background color',
                      type: 'input-color',
                      name: 'background'
                    },
                    {
                      label: 'text color',
                      type: 'input-color',
                      name: 'color'
                    },
                    {
                      label: 'text bold',
                      name: 'bold',
                      type: 'switch',
                      mode: 'row',
                      inputClassName:
                        'inline-flex justify-between flex-row-reverse'
                    }
                  ]
                },
                {
                  title: 'Layout',
                  body: [
                    {
                      type: 'input-text',
                      label: 'Cell width',
                      name: 'width',
                      clearable: true
                    },
                    {
                      type: 'input-number',
                      name: 'padding',
                      label: 'Cell padding'
                    },
                    {
                      label: 'Horizontal alignment',
                      name: 'align',
                      type: 'button-group-select',
                      size: 'sm',
                      mode: 'row',
                      className: 'ae-buttonGroupSelect--justify',
                      options: [
                        {
                          label: '',
                          value: 'left',
                          icon: 'fa fa-align-left'
                        },
                        {
                          label: '',
                          value: 'center',
                          icon: 'fa fa-align-center'
                        },
                        {
                          label: '',
                          value: 'right',
                          icon: 'fa fa-align-right'
                        },
                        {
                          label: '',
                          value: 'justify',
                          icon: 'fa fa-align-justify'
                        }
                      ]
                    },
                    {
                      label: 'Vertical alignment',
                      name: 'valign',
                      type: 'button-group-select',
                      size: 'sm',
                      mode: 'row',
                      className: 'ae-buttonGroupSelect--justify',
                      options: [
                        {
                          label: 'Top',
                          value: 'top'
                        },
                        {
                          label: 'Center',
                          value: 'middle'
                        },
                        {
                          label: 'Bottom',
                          value: 'bottom'
                        },
                        {
                          label: 'Baseline alignment',
                          value: 'baseline'
                        }
                      ]
                    },
                    {
                      type: 'input-number',
                      name: 'colspan',
                      label: 'Number of columns to merge horizontally'
                    },
                    {
                      type: 'input-number',
                      name: 'rowspan',
                      label: 'Number of vertically merged columns'
                    }
                  ]
                }
              ])
            ]
          },
          {
            title: 'Appearance',
            className: 'p-none',
            body: getSchemaTpl('collapseGroup', getSchemaTpl('theme:common'))
          }
        ])
      ];
    }
  };

  trVRendererConfig: VRendererConfig = {
    panelTitle: ' 行',
    panelBodyCreator: (context: BaseEventContext) => {
      return [
        getSchemaTpl('tabs', [
          {
            title: 'Attributes',
            body: [
              {
                label: 'row height',
                type: 'input-number',
                name: 'height'
              },
              {
                label: 'row background color',
                type: 'input-color',
                name: 'background'
              }
            ]
          },
          {
            title: 'Appearance',
            className: 'p-none',
            body: getSchemaTpl('collapseGroup', getSchemaTpl('theme:common'))
          }
        ])
      ];
    }
  };

  renderRenderer(props: any) {
    const $$editor = props.$$editor;
    const renderer = $$editor.renderer;
    const schema = props.$schema;
    getCellRealPosition(schema);
    return (
      <TableViewEditor schema={schema} manager={this.manager}>
        <renderer.component {...props} />
      </TableViewEditor>
    );
  }

  // Determine whether to select a cell or a row based on the path
  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    super.buildEditorPanel(context, panels);
    const plugin: PluginInterface = this;
    const store = this.manager.store;

    if (context.info.schemaPath.endsWith('/td')) {
      panels.push({
        key: 'td',
        order: 100,
        icon: this.tdVRendererConfig.panelIcon || 'fa fa-tablet',
        pluginIcon: plugin.pluginIcon,
        title: this.tdVRendererConfig.panelTitle || '格子',
        render: this.manager.makeSchemaFormRender({
          controls: this.tdVRendererConfig.panelControlsCreator
            ? this.tdVRendererConfig.panelControlsCreator(context)
            : this.tdVRendererConfig.panelControls!,
          body: this.tdVRendererConfig.panelBodyCreator
            ? this.tdVRendererConfig.panelBodyCreator(context)
            : this.tdVRendererConfig.panelBody!,
          panelById: store.activeId
        })
      });
    } else if (context.info.schemaPath.endsWith('/tr')) {
      panels.push({
        key: 'tr',
        order: 100,
        icon: this.trVRendererConfig.panelIcon || 'fa fa-tablet',
        title: this.trVRendererConfig.panelTitle || '格子',
        render: this.manager.makeSchemaFormRender({
          controls: this.trVRendererConfig.panelControlsCreator
            ? this.trVRendererConfig.panelControlsCreator(context)
            : this.trVRendererConfig.panelControls!,
          body: this.trVRendererConfig.panelBodyCreator
            ? this.trVRendererConfig.panelBodyCreator(context)
            : this.trVRendererConfig.panelBody!,
          panelById: store.activeId
        })
      });
    }
  }

  /**
   * When inserting a row, you need to handle the situation where there is a rowspan in the front.
   *
   *   +---+---+---+
   *   | a | b | c |
   *   +   +---+---+
   *   |   | d | e |
   *   +   +---+---+
   *   |   | f | g |
   *   +---+---+---+
   *
   * For example, to insert a row before position d, you need to increase the rowspan of a by one, and then insert two cells.
   */
  insertRow(tdId: string, position: 'above' | 'below') {
    const store = this.manager.store;
    const paths = store.getNodePathById(tdId);
    const tableId = paths[paths.length - 3].id;
    const table = store.getSchema(tableId);
    getCellRealPosition(table);

    const td = JSONGetById(table, tdId);

    if (!td) {
      console.warn('Cannot find the corresponding td id');
      return;
    }

    let insertRow = td.$$row;
    if (position === 'below') {
      // If there is rowspan, the number of inserted rows needs to be added to the rowspan
      if (td.rowspan) {
        insertRow = insertRow + td.rowspan;
      } else {
        insertRow = insertRow + 1;
      }
    }

    // Get the maximum number of columns
    let colSize = this.calculateCellActualMaxCol(table);
    let insertIndex = table.trs.length;
    for (let trIndex = 0; trIndex < table.trs.length; trIndex++) {
      for (const td of table.trs[trIndex].tds || []) {
        const tdRow = td.$$row;
        const rowspan = td.rowspan || 1;
        const colspan = td.colspan || 1;
        // If the row to be inserted is covered, increase the rowspan and subtract the corresponding value from the inserted row
        if (rowspan > 1 && tdRow < insertRow) {
          const isOverlapping = tdRow + rowspan > insertRow;
          if (isOverlapping) {
            td.rowspan = rowspan + 1;
            colSize = colSize - colspan;
          }
        }
        if (tdRow === insertRow) {
          insertIndex = trIndex;
          break;
        }
      }
    }

    const insertTds = [];
    for (let i = 0; i < colSize; i++) {
      insertTds.push(TD_TEMPLATE);
    }
    table.trs.splice(insertIndex, 0, {tds: insertTds});
    this.manager.store.changeValueById(tableId, table);
  }

  /**
   * Calculate the maximum number of columns
   *    +---+---+---+
   *		| a     | b |
   *		+       +---+
   *		|       | c |
   *		+---+---+---+
   *		| d | e | f |
   *		+---+---+---+
   *  return 3;
   */
  calculateCellActualMaxCol(tableData: TableViewSchema) {
    let maxColCount = 0;

    if (!tableData?.trs) {
      return maxColCount;
    }

    const rows = tableData.trs; // Get the rows in the table
    const actualRowColMap: {
      [key: string]: {
        rowIndex: number;
        colIndex: number;
      };
    } = {}; // Used to store the actual row and column of each cell and the maximum number of columns

    // Iterate through the rows in the table
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex]; // Get the current row
      let currentColIndex = 0; // Current column index

      for (let cellIndex = 0; cellIndex < row.tds.length; cellIndex++) {
        const cell = row.tds[cellIndex];
        const colspan = cell.colspan || 1; // Get the number of columns spanning a cell, the default is 1
        const rowspan = cell.rowspan || 1; // Get the number of rows spanned by the cell, the default is 1

        // Calculate the actual row and column of the cell
        const actualRowIndex = rowIndex;
        let actualColIndexStart = currentColIndex;

        // Consider spanning columns
        for (let i = 0; i < colspan; i++) {
          const key = `${actualRowIndex}-${actualColIndexStart + i}`;
          if (actualRowColMap[key]) {
            actualColIndexStart++;
          } else {
            actualRowColMap[key] = {
              rowIndex: actualRowIndex,
              colIndex: actualColIndexStart + i
            };
          }
        }

        currentColIndex += colspan;
      }
    }

    for (const key in actualRowColMap) {
      const {colIndex} = actualRowColMap[key];
      maxColCount = Math.max(maxColCount, colIndex + 1);
    }

    return maxColCount;
  }

  /**
   * Expand contextmenu for easier operation
   */
  buildEditorContextMenu(
    context: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    const {
      info,
      schema: {$$id: tdId, ...resetSchema}
    } = context;

    const colspan = resetSchema.colspan || 1;
    const rowspan = resetSchema.rowspan || 1;
    if (info.schemaPath.endsWith('/td')) {
      menus.push('|');

      menus.push({
        label: 'Add new column on the left',
        onSelect: this.insertCol.bind(this, tdId, 'left')
      });
      menus.push({
        label: 'Add new row below',
        onSelect: this.insertRow.bind(this, tdId, 'below')
      });
      menus.push({
        label: 'Add new row above',
        onSelect: this.insertRow.bind(this, tdId, 'above')
      });
      menus.push({
        label: 'Add new column on the right',
        onSelect: this.insertCol.bind(this, tdId, 'right')
      });

      menus.push('|');

      menus.push({
        label: 'Split cell',
        disabled: !(colspan > 1 || rowspan > 1) || false,
        onSelect: this.splitCell.bind(this, tdId)
      });
    }
  }

  /**
   * Insert columns
   *
   *		+---+---+---+
   *		| a     | b |
   *		+       +---+
   *		|       | c |
   *		+---+---+---+
   *		| d | e | f |
   *		+---+---+---+
   *
   * For example, to insert a column to the left of position c, you should increase the colspan of a by one, and then add a cell in the last row.
   */
  insertCol(tdId: string, position: 'left' | 'right') {
    const store = this.manager.store;
    const paths = store.getNodePathById(tdId);
    const tableId = paths[paths.length - 3].id;
    const table = store.getSchema(tableId);
    getCellRealPosition(table);
    const td = JSONGetById(table, tdId);
    if (!td) {
      console.warn('Cannot find the corresponding td id');
      return;
    }

    let insertCol = td.$$col;
    if (position === 'right') {
      insertCol = insertCol + 1;
    }

    for (const tr of table.trs || []) {
      const tds = tr.tds || [];
      let isInserted = false;
      for (let tdIndex = 0; tdIndex < tds.length; tdIndex++) {
        const td = tds[tdIndex];
        const tdColspan = td.colspan || 1;
        const tdCol = td.$$col;
        // If the row to be inserted is overwritten, add one to the node and skip the insertion
        if (tdColspan > 1) {
          const isOverlapping = tdCol + tdColspan > insertCol;
          if (isOverlapping) {
            td.colspan = tdColspan + 1;
            isInserted = true;
            break;
          }
        }
        if (insertCol <= tdCol) {
          tds.splice(tdIndex, 0, TD_TEMPLATE);
          isInserted = true;
          break;
        }
      }
      // If the corresponding node is not found, it may be inserted to the last row or the number of nodes in this column is insufficient, then it should be inserted to the end
      if (!isInserted) {
        tds.push(TD_TEMPLATE);
      }
    }
    this.manager.store.changeValueById(tableId, table);
  }

  /**
   * Split cells that span rows or columns
   *
   *		+---+---+---+
   *		| a     | b |
   *		+       +---+
   *		|       | c |
   *		+---+---+---+
   *		| d | e | f |
   *		+---+---+---+
   *
   * For example, if we split a, we will end up with
   *
   *		+---+---+---+
   *		| a | g | b |
   *		+---+---+---+
   *		| h | i | c |
   *		+---+---+---+
   *		| d | e | f |
   *		+---+---+---+
   *
   * Therefore, we need to add three cells: g, h, and i
   */
  splitCell(tdId: string) {
    const store = this.manager.store;
    const paths = store.getNodePathById(tdId);
    const tableId = paths[paths.length - 3].id;
    const table = store.getSchema(tableId);
    getCellRealPosition(table);
    const td = JSONGetById(table, tdId);
    if (!td) {
      console.warn('Cannot find the corresponding td id');
      return;
    }

    const rowspan = td.rowspan || 1;
    const colspan = td.colspan || 1;

    // Set the row and column span of this cell to 1
    td.colspan = 1;
    td.rowspan = 1;

    // Calculate which cells and positions need to be supplemented
    const tdRow = td.$$row;
    const tdCol = td.$$col;
    const insertTds = [];
    for (var i = 0; i < rowspan; i++) {
      for (var j = 0; j < colspan; j++) {
        // Skip the first one, which is the position of this cell itself
        if (i === 0 && j === 0) {
          continue;
        }
        insertTds.push({row: tdRow + i, col: tdCol + j});
      }
    }

    // You need to put the largest columns in front, mainly because you need to traverse in reverse to dynamically delete data later
    insertTds.sort((a: any, b: any) => {
      return b.col - a.col;
    });

    for (const tr of table.trs) {
      for (let tdIndex = 0; tdIndex < tr.tds.length; tdIndex++) {
        const td = tr.tds[tdIndex];
        const currentRow = td.$$row;
        const currentCol = td.$$col;
        let insertIndex = insertTds.length;
        while (insertIndex--) {
          const insertTd = insertTds[insertIndex];
          if (currentRow === insertTd.row) {
            if (insertTd.col <= currentCol) {
              tr.tds.splice(tdIndex, 0, TD_TEMPLATE);
            } else {
              tr.tds.push(TD_TEMPLATE);
            }
            insertTds.splice(insertIndex, 1);
          }
        }
      }
    }

    // If there is a cell in front that cannot be found, it means the following situation, this cell spans two rows and is the last row
    // At this time, table.tr actually only has one row of data, so you need to add another row of data
    // 	+---+---+
    // 	| a     |
    // 	+       +
    // 	|       |
    // 	+---+---+
    if (insertTds.length) {
      const newTds = [];
      for (var i = 0; i < insertTds.length; i++) {
        newTds.push(TD_TEMPLATE);
      }
      table.trs.push({tds: newTds});
    }

    this.manager.store.changeValueById(tableId, table);
  }

  buildEditorToolbar(
    {schema, info}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (info.schemaPath.endsWith('/td')) {
      const tdId = schema.$$id;
      toolbars.push({
        icon: 'fa fa-chevron-left',
        order: 100,
        tooltip: 'Add new column on the left',
        onClick: () => {
          this.insertCol(tdId, 'left');
        }
      });
      toolbars.push({
        icon: 'fa fa-chevron-down',
        order: 100,
        tooltip: 'Add new row below',
        onClick: () => {
          this.insertRow(tdId, 'below');
        }
      });
      toolbars.push({
        icon: 'fa fa-chevron-up',
        order: 100,
        tooltip: 'Add new row above',
        onClick: () => {
          this.insertRow(tdId, 'above');
        }
      });
      toolbars.push({
        icon: 'fa fa-chevron-right',
        order: 100,
        tooltip: 'Add new column on the right',
        onClick: () => {
          this.insertCol(tdId, 'right');
        }
      });
      const colspan = schema.colspan || 1;
      const rowspan = schema.rowspan || 1;
      if (colspan > 1 || rowspan > 1) {
        toolbars.push({
          icon: 'fa fa-columns',
          order: 100,
          tooltip: 'Split Cell',
          onClick: () => {
            this.splitCell(tdId);
          }
        });
      }
    }
  }
}

registerEditorPlugin(TableViewPlugin);
