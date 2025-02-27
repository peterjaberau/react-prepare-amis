/**
 * @file tableview related visual editing, dragging row height, etc.
 */

import React from 'react';
import isEqual from 'lodash/isEqual';
import {toast} from '@/packages/src';
import {TableViewSchema, TrObject} from '@/packages/src';
import {EditorManager} from '@/packages/amis-editor-core/src';
import {autobind, JSONGetById, EditorStoreType} from '@/packages/amis-editor-core/src';

interface TableViewEditorProps {
  schema: TableViewSchema;
  manager: EditorManager;
  children?: any;
}

interface TableViewEditorState {
  // Line ID
  trIds: string[];
  // Column line id
  tdIds: string[];
  // Whether to display the merge cell button
  displayMergeCell: boolean;
}

const ROW_HEIGHT = 42;

// Find the row with the most td and use this row as the column line
function findMaxTrChildren(trs: TrObject[]) {
  let maxSize = 0;
  let maxIndex = 0;
  for (let trIndex = 0; trIndex < trs.length; trIndex++) {
    const childSize = (trs[trIndex].tds || []).length;
    if (childSize > maxSize) {
      maxIndex = trIndex;
      maxSize = childSize;
    }
  }
  return maxIndex;
}

export class TableViewEditor extends React.Component<
  TableViewEditorProps,
  TableViewEditorState
> {
  tableViewWrapperRef: React.RefObject<HTMLDivElement>;

  // The following are used to drag rows and lines to change height and width
  // But there is a problem that has not been solved: if there are two cells in the same column with set widths at the same time, which one should be changed?
  draggingId: string;
  draggingElement: HTMLElement;
  draggingElementTop: number;
  draggingElementLeft: number;
  startX: number;
  startY: number;
  maxChildTrIndex: number;

  store: EditorStoreType;

  // Whether to enter the cell selection state for cell merging
  isSelectionCell: boolean;
  // For cell merging
  selectedCell: {
    [cellId: string]: any;
  };
  preventTableClick: boolean = false;

  constructor(props: TableViewEditorProps) {
    super(props);
    this.tableViewWrapperRef = React.createRef();
    this.store = this.props.manager.store;
    const trs = this.props.schema.trs || [];
    if (trs.length) {
      const trsIds = trs.map((tr: any) => tr.$$id);
      const maxChildTrIndex = findMaxTrChildren(trs);
      this.maxChildTrIndex = maxChildTrIndex;
      const tds = trs[maxChildTrIndex].tds || [];
      const tdsIds = tds.map((td: any) => td.$$id);
      this.state = {
        trIds: trsIds,
        tdIds: tdsIds,
        displayMergeCell: false
      };
    } else {
      this.state = {
        trIds: [],
        tdIds: [],
        displayMergeCell: false
      };
    }

    this.listenTdSelection();
  }

  componentDidMount() {
    this.syncLinePos();
    this.listenTdSelection();
  }

  componentWillUnmount() {
    this.removeListenTdSelection();
  }

  // Number of synchronization lines, mainly used to add rows or columns
  syncLineState() {
    const trs = this.props.schema.trs || [];
    if (!trs.length) {
      return;
    }
    const trsIds = trs.map((tr: any) => tr.$$id);
    const maxChildTrIndex = findMaxTrChildren(trs);
    this.maxChildTrIndex = maxChildTrIndex;
    const tds = trs[maxChildTrIndex].tds || [];
    const tdsIds = tds.map((td: any) => td.$$id);
    this.setState(
      {
        trIds: trsIds,
        tdIds: tdsIds
      },
      () => {
        this.syncLinePos();
      }
    );
  }

  @autobind
  removeListenTdSelection() {
    const dom = this.tableViewWrapperRef.current;
    if (dom) {
      const tbody = dom.querySelector('tbody')!;
      tbody.removeEventListener('mousedown', this.handleCellMouseDown);
      tbody.removeEventListener('mousemove', this.handleCellMouseMove);
      tbody.removeEventListener('mouseup', this.handleCellMouseUp);
      tbody.removeEventListener('click', this.handleCellMouseClick);
    }
  }

  // Listen to the drag event of td to realize cell merging
  @autobind
  listenTdSelection() {
    const dom = this.tableViewWrapperRef.current;
    if (dom) {
      const tbody = dom.querySelector('tbody')!;
      tbody.addEventListener('mousedown', this.handleCellMouseDown);
      tbody.addEventListener('mousemove', this.handleCellMouseMove);
      tbody.addEventListener('mouseup', this.handleCellMouseUp);
      tbody.addEventListener('click', this.handleCellMouseClick);
    }
  }

  // Click for cell merging
  @autobind
  handleCellMouseDown(e: MouseEvent) {
    const td = e.target! as HTMLElement;
    if (td && td.tagName !== 'TD') {
      return;
    }
    this.removeAllSelectionMark();
    this.setState({
      displayMergeCell: false
    });
    const tdId = td.getAttribute('data-editor-id')!;
    this.isSelectionCell = true;
    this.selectedCell = {
      [tdId]: JSONGetById(this.props.schema, tdId)
    };
  }

  // Move for cell merging
  @autobind
  handleCellMouseMove(e: MouseEvent) {
    if (this.isSelectionCell) {
      this.preventTableClick = true; //If there is a move, prevent the table click event once
      const td = e.target! as HTMLElement;
      if (td && td.tagName !== 'TD') {
        return;
      }
      const tdId = td.getAttribute('data-editor-id')!;
      if (!(tdId in this.selectedCell)) {
        this.selectedCell[tdId] = JSONGetById(this.props.schema, tdId);
        this.markSelectingCell();
        this.setState({
          displayMergeCell: true
        });
      }
    }
  }

  // Find the maximum and minimum row and column positions, taking into account the cross-row situation, for cell merging
  findFirstAndLastCell() {
    const tds = [];
    for (const tdId in this.selectedCell) {
      tds.push(this.selectedCell[tdId]);
    }
    if (!tds.length) {
      console.warn('td is required');
    }
    let minCol: number = tds[0].$$col;
    let minRow: number = tds[0].$$row;
    let maxCol: number = 0;
    let maxRow: number = 0;
    let firstCell = null;
    let lastCell = null;
    for (const td of tds) {
      const col = td.$$col + (td.colspan || 1) - 1; // Subtract one here or you will have to do it later
      const row = td.$$row + (td.rowspan || 1) - 1;
      if (col >= maxCol) {
        maxCol = col;
      }
      if (row >= maxRow) {
        maxRow = row;
      }
      if (td.$$col <= minCol) {
        minCol = td.$$col;
      }
      if (td.$$row <= minRow) {
        minRow = td.$$row;
      }
      if (td.$$col === minCol && td.$$row === minRow) {
        firstCell = td;
      }
    }
    return {
      minRow,
      minCol,
      maxRow,
      maxCol,
      firstCell,
      lastCell
    };
  }

  /**
   * Select td mainly for cell merging, which requires it to be a rectangle, such as the following example
   *		┌───┬───┬───┬───┐
   *		│ a │ b │ c │ d │
   *		├───┴───┼───┤   │
   *		│ e     │ f │   │
   *		│       ├───┼───┤
   *		│       │ g │ h │
   *		└───────┴───┴───┘
   * It is not possible to directly select a and c, as the cells cannot be merged, so b needs to be added
   * If you select e and f, you need to automatically select g to make the whole thing a rectangle
   * The main function of this function is to complete the rectangle
   */
  markSelectingCell() {
    // First, find the smallest and largest row and column
    const {minRow, minCol, maxRow, maxCol} = this.findFirstAndLastCell();

    // The variable finds all nodes in this range, and adds them if they are not there
    for (const tr of this.props.schema.trs) {
      for (const td of tr.tds) {
        const internalTd = td as any;
        if (
          internalTd.$$col >= minCol &&
          internalTd.$$col <= maxCol &&
          internalTd.$$row >= minRow &&
          internalTd.$$row <= maxRow
        ) {
          if (!(internalTd.$$id in this.selectedCell)) {
            this.selectedCell[internalTd.$$id] = td;
          }
        }
      }
    }

    const dom = this.tableViewWrapperRef.current;
    if (dom) {
      const tds = dom.querySelectorAll('td');
      tds.forEach(td => {
        const tdId = td.getAttribute('data-editor-id')!;
        if (tdId in this.selectedCell) {
          td.setAttribute('data-selected', '1');
        }
      });
    }
  }

  // Clear the previous cell selection
  removeAllSelectionMark() {
    const dom = this.tableViewWrapperRef.current;
    if (dom) {
      const tds = dom.querySelectorAll('td');
      tds.forEach(td => {
        td.removeAttribute('data-selected');
      });
    }
  }

  @autobind
  handleCellMouseUp(e: MouseEvent) {
    this.isSelectionCell = false;
  }

  // If there is dragging, avoid selecting the table and causing state switching
  @autobind
  handleCellMouseClick(e: MouseEvent) {
    if (this.preventTableClick) {
      e.stopPropagation();
      e.preventDefault();
      this.preventTableClick = false;
    }
  }

  // Merge cell operation
  @autobind
  handleMergeCell() {
    const {firstCell, minRow, minCol, maxRow, maxCol} =
      this.findFirstAndLastCell();
    if (!firstCell) {
      console.warn('Cannot find the first cell');
      return;
    }

    const firstCellId = firstCell.$$id;
    const colspan = maxCol - minCol + 1;
    const rowspan = maxRow - minRow + 1;
    firstCell.colspan = colspan;
    firstCell.rowspan = rowspan;
    const tds = [];
    for (const tdId in this.selectedCell) {
      tds.push(this.selectedCell[tdId]);
    }
    // Other cells, these cells will be deleted
    const otherCellIds = tds
      .filter(td => td.$$id !== firstCellId)
      .map(td => td.$$id);

    const trs = this.props.schema.trs;
    let trIndex = trs.length;
    while (trIndex--) {
      const tr = trs[trIndex];
      tr.tds = tr.tds.filter(td => {
        return !otherCellIds.includes((td as any).$$id);
      });
      if (!tr.tds.length) {
        trs.splice(trIndex, 1);
      }
    }

    const tableId = (this.props.schema as any).$$id;
    this.store.changeValueById(tableId, this.props.schema);
    this.setState({displayMergeCell: false});
  }

  // The position of the synchronization line
  syncLinePos() {
    const dom = this.tableViewWrapperRef.current;
    if (dom) {
      const table = dom.querySelector('table')!;
      const tableRect = table.getBoundingClientRect();
      const trs = dom.querySelectorAll('tr');
      if (!trs.length || typeof this.maxChildTrIndex === 'undefined') {
        return;
      }
      const rowLines = Array.from(
        dom.querySelectorAll<HTMLElement>('.ae-TableViewEditor-rowLine')
      );
      for (let trIndex = 0; trIndex < trs.length; trIndex++) {
        if (!trs[trIndex]) {
          continue;
        }
        const trRect = trs[trIndex].getBoundingClientRect();
        if (rowLines[trIndex]) {
          // The line width is 7, so subtract 3.5
          rowLines[trIndex].style.top =
            trRect.top + trRect.height - tableRect.top - 3.5 + 'px';
        } else {
          console.warn('Incorrect number of lines');
        }
      }
      const tds = trs[this.maxChildTrIndex].querySelectorAll('td');

      const colLines = Array.from(
        dom.querySelectorAll<HTMLElement>('.ae-TableViewEditor-colLine')
      );
      for (let tdIndex = 0; tdIndex < tds.length; tdIndex++) {
        const td = tds[tdIndex];
        if (!td) {
          continue;
        }
        const tdRect = td.getBoundingClientRect();
        if (colLines[tdIndex]) {
          colLines[tdIndex].style.left =
            tdRect.left + tdRect.width - tableRect.left - 3.5 + 'px';
        } else {
          console.warn('Incorrect number of columns and lines');
        }
      }
    }
  }

  componentDidUpdate(prevProps: TableViewEditorProps) {
    const prevSchema = prevProps.schema;
    const thisSchema = this.props.schema;
    if (!isEqual(prevSchema, thisSchema)) {
      this.syncLineState();
    }
  }

  // General processing of horizontal or vertical lines when the mouse is pressed
  lineMouseDownCommon(e: React.MouseEvent<HTMLElement>) {
    this.startY = e.clientY;
    this.startX = e.clientX;
    const currentTarget = e.currentTarget;
    this.draggingElement = currentTarget;
    this.draggingElementTop = parseInt(this.draggingElement.style.top, 10);
    this.draggingElementLeft = parseInt(this.draggingElement.style.left, 10);
    currentTarget.style.background = '#4285f4';
    this.draggingId = currentTarget.getAttribute('data-id')!;
    currentTarget.addEventListener('click', this.handleLineClick, {once: true});
  }

  // Drag the horizontal line
  @autobind
  handleRowMouseDown(e: React.MouseEvent<HTMLElement>) {
    this.lineMouseDownCommon(e);
    document.addEventListener('mousemove', this.handleRowMouseMove);
    document.addEventListener('mouseup', this.handleRowMouseUp);
  }

  // Horizontal line movement
  @autobind
  handleRowMouseMove(e: MouseEvent) {
    const moveY = e.clientY - this.startY;
    this.draggingElement.style.top = this.draggingElementTop + moveY + 'px';
  }

  // End of horizontal line
  @autobind
  handleRowMouseUp(e: MouseEvent) {
    document.removeEventListener('mousemove', this.handleRowMouseMove);
    document.removeEventListener('mouseup', this.handleRowMouseUp);
    const moveY = e.clientY - this.startY;
    const store = this.store;
    const draggingId = this.draggingId;
    const value = store.getValueOf(draggingId);
    const rowElement = this.tableViewWrapperRef.current!.querySelector(
      `tr[data-editor-id="${draggingId}"]`
    );
    this.draggingElement.style.background = 'none';
    if (!value || !rowElement) {
      console.warn('Cannot find the corresponding id', draggingId);
    } else {
      const height = rowElement.getBoundingClientRect().height;
      const targetHeight = height + moveY;
      store.changeValueById(draggingId, {...value, height: targetHeight});
      if (ROW_HEIGHT - targetHeight > 20) {
        toast.warning(
          'Due to the limitation of padding, a height setting that is too small will not take effect. You can reduce the default padding'
        );
      }
    }
  }

  // Drag the vertical line
  @autobind
  handleColMouseDown(e: React.MouseEvent<HTMLElement>) {
    this.lineMouseDownCommon(e);
    document.addEventListener('mousemove', this.handleColMouseMove);
    document.addEventListener('mouseup', this.handleColMouseUp);
  }

  // Vertical line movement
  @autobind
  handleColMouseMove(e: MouseEvent) {
    const moveX = e.clientX - this.startX;
    this.draggingElement.style.left = this.draggingElementLeft + moveX + 'px';
  }

  // End of vertical line
  @autobind
  handleColMouseUp(e: MouseEvent) {
    document.removeEventListener('mousemove', this.handleColMouseMove);
    document.removeEventListener('mouseup', this.handleColMouseUp);
    const moveX = e.clientX - this.startX;
    const store = this.store;
    const draggingId = this.draggingId;
    const value = store.getValueOf(draggingId);
    const tdElement = this.tableViewWrapperRef!.current!.querySelector(
      `td[data-editor-id="${draggingId}"]`
    );
    this.draggingElement.style.background = 'none';
    if (!value || !tdElement) {
      console.warn('Cannot find the corresponding id', draggingId);
    } else {
      const width = tdElement.getBoundingClientRect().width;
      const targetWidth = width + moveX;
      store.changeValueById(draggingId, {...value, width: targetWidth});
    }
  }

  // Prevent bubbling and switch to table selection
  @autobind
  handleLineClick(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
  }

  //Cell merge button
  renderMergeIcon() {
    if (this.state.displayMergeCell) {
      return (
        <div
          className="ae-TableViewEditor-mergeIcon"
          onMouseDown={this.handleMergeCell}
        >
          Merge cells
        </div>
      );
    }
    return null;
  }

  render() {
    const {children, schema} = this.props;
    let rowLines = this.state.trIds.map((id: string) => (
      <div
        className="ae-TableViewEditor-rowLine"
        key={`row-${id}`}
        data-id={id}
        onMouseDown={this.handleRowMouseDown}
      ></div>
    ));

    let colLines = this.state.tdIds.map((id: string) => (
      <div
        className="ae-TableViewEditor-colLine"
        key={`row-${id}`}
        data-id={id}
        onMouseDown={this.handleColMouseDown}
      ></div>
    ));

    return (
      <div
        className="ae-TableViewEditor"
        ref={this.tableViewWrapperRef}
        style={schema?.style}
      >
        {children}
        {this.renderMergeIcon()}
        {rowLines}
        {colLines}
      </div>
    );
  }
}
