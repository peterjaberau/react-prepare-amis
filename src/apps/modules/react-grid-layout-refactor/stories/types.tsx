import { ReactElement, Ref } from "react";
import { Layout } from "react-grid-layout";

type GridLayoutProps = {
  //
  // Basic props
  //

  // This allows setting the initial width on the server side.
  // This is required unless using the HOC <WidthProvider> or similar
  width: number;

  // If true, the container height swells and contracts to fit contents
  // default: true
  autoSize?: boolean;

  // Number of columns in this layout. eg. 12
  cols?: number;

  // A CSS selector for tags that will not be draggable.
  // For example: draggableCancel:'.MyNonDraggableAreaClassName'
  // If you forget the leading . it will not work.
  // .react-resizable-handle" is always prepended to this value.

  draggableCancel?: string;

  // A CSS selector for tags that will act as the draggable handle.
  // For example: draggableHandle:'.MyDragHandleClassName'
  // If you forget the leading . it will not work.
  draggableHandle?: string;

  // Compaction type.
  // default: vertical
  compactType?: "vertical" | "horizontal";

  // Layout is an array of objects with the format:
  // The index into the layout must match the key used on each item component.
  // If you choose to use custom keys, you can specify that key in the layout
  // array objects using the `i` prop.
  // If not provided, use data-grid props on children
  layout?: Array<{ i?: string; x: number; y: number; w: number; h: number }>;

  // Margin between items [x, y] in px.
  // default: [10, 10]
  margin?: [number, number];

  // Padding inside the container [x, y] in px
  // default: [10, 10]
  containerPadding?: [number, number];

  // Rows have a static height, but you can change this based on breakpoints
  // if you like.
  // default: 150
  rowHeight?: number;

  // Configuration of a dropping element. Dropping element is a "virtual" element
  // which appears when you drag over some element from outside.
  // It can be changed by passing specific parameters:
  //  i - id of an element
  //  w - width of an element
  //  h - height of an element
  droppingItem?: { i: string; w: number; h: number };

  //
  // Flags
  //
  // default: true
  isDraggable?: boolean;
  // default: true
  isResizable?: boolean;

  // default: false
  isBounded?: boolean;

  // Uses CSS3 translate() instead of position top/left.
  // This makes about 6x faster paint performance
  // default: true
  useCSSTransforms?: boolean;

  // If parent DOM node of ResponsiveReactGridLayout or ReactGridLayout has "transform: scale(n)" css property
  // we should set scale coefficient to avoid render artefacts while dragging.
  // default: 1
  transformScale?: number;

  // If true, grid can be placed one over the other.
  // If set, implies `preventCollision`.
  // default: false
  allowOverlap?: boolean;

  // If true, grid items won't change position when being
  // dragged over. If `allowOverlap` is still false
  // this simply won't allow one to drop on an existing object.
  // default: false
  preventCollision?: boolean;

  // If true, droppable elements (with `draggable={true}` attribute)
  // can be dropped on the grid. It triggers "onDrop" callback
  // with position and event object as parameters.
  // It can be useful for dropping an element in a specific position
  //
  // NOTE: In case of using Firefox you should add
  // `onDragStart={e => e.dataTransfer.setData('text/plain', '')}` attribute
  // along with `draggable={true}` otherwise this feature will work incorrect.
  // onDragStart attribute is required for Firefox for a dragging initialization
  // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
  // default: false
  isDroppable?: boolean;

  // Defines which resize handles should be rendered.
  // Allows for any combination of:
  // 's' - South handle (bottom-center)
  // 'w' - West handle (left-center)
  // 'e' - East handle (right-center)
  // 'n' - North handle (top-center)
  // 'sw' - Southwest handle (bottom-left)
  // 'nw' - Northwest handle (top-left)
  // 'se' - Southeast handle (bottom-right)
  // 'ne' - Northeast handle (top-right)
  //
  // Note that changing this property dynamically does not work due to a restriction in react-resizable.
  // default: ['se']
  resizeHandles?: Array<"s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne">;

  // Custom component for resize handles
  // See `handle` as used in https://github.com/react-grid-layout/react-resizable#resize-handle
  // Your component should have the class `.react-resizable-handle`, or you should add your custom
  // class to the `draggableCancel` prop.
  resizeHandle?:
    | ReactElement<any>
    | ((resizeHandleAxis: any, ref: Ref<HTMLElement>) => ReactElement<any>);

  //
  // Callbacks
  //

  // Callback so you can save the layout.
  // Calls back with (currentLayout) after every drag or resize stop.
  onLayoutChange: (layout: Layout) => void;

  /*
  * All callbacks below have signature (layout, oldItem, newItem, placeholder, e, element).
  * 'start' and 'stop' callbacks pass `undefined` for 'placeholder'.

  type ItemCallback = (layout: Layout, oldItem: any, newItem: any,
                       placeholder: any, e: MouseEvent, element: HTMLElement) => void;

   */

  // Calls when drag starts.
  onDragStart: (
    layout: Layout,
    oldItem: any,
    newItem: any,
    placeholder: any,
    e: MouseEvent,
    element: HTMLElement,
  ) => void;

  // Calls on each drag movement.
  onDrag: (
    layout: Layout,
    oldItem: any,
    newItem: any,
    placeholder: any,
    e: MouseEvent,
    element: HTMLElement,
  ) => void;

  // Calls when drag is complete.
  onDragStop: (
    layout: Layout,
    oldItem: any,
    newItem: any,
    placeholder: any,
    e: MouseEvent,
    element: HTMLElement,
  ) => void;

  // Calls when resize starts.
  onResizeStart: (
    layout: Layout,
    oldItem: any,
    newItem: any,
    placeholder: any,
    e: MouseEvent,
    element: HTMLElement,
  ) => void;

  // Calls when resize movement happens.
  onResize: (
    layout: Layout,
    oldItem: any,
    newItem: any,
    placeholder: any,
    e: MouseEvent,
    element: HTMLElement,
  ) => void;

  // Calls when resize is complete.
  onResizeStop: (
    layout: Layout,
    oldItem: any,
    newItem: any,
    placeholder: any,
    e: MouseEvent,
    element: HTMLElement,
  ) => void;

  //
  // Dropover functionality
  //

  // Calls when an element has been dropped into the grid from outside.
  onDrop: (layout: Layout, item?: any, e?: any) => void;

  // Calls when an element is being dragged over the grid from outside as above.
  // This callback should return an object to dynamically change the droppingItem size
  // Return false to short-circuit the dragover
  onDropDragOver: (e: any) => { w?: number; h?: number } | false;

  // Ref for getting a reference for the grid's wrapping div.
  // You can use this instead of a regular ref and the deprecated `ReactDOM.findDOMNode()`` function.
  // Note that this type is React.Ref<HTMLDivElement> in TypeScript, Flow has a bug here
  // https://github.com/facebook/flow/issues/8671#issuecomment-862634865
  innerRef: { current: null | HTMLDivElement };
};

type ResponsiveGridLayoutProps = {
  // {name: pxVal}, e.g. {lg: 1200, md: 996, sm: 768, xs: 480}
  // Breakpoint names are arbitrary but must match in the cols and layouts objects.
  //default: {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}
  breakpoints?: {
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
    xxs?: number;
  };

  // # of cols. This is a breakpoint -> cols map, e.g. {lg: 12, md: 10, ...}
  //default: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}
  cols?: { lg?: number; md?: number; sm?: number; xs?: number; xxs?: number };

  // margin (in pixels). Can be specified either as horizontal and vertical margin, e.g. `[10, 10]` or as a breakpoint -> margin map, e.g. `{lg: [10, 10], md: [10, 10], ...}.
  margin: [number, number] | { [key: string]: [number, number] };

  // containerPadding (in pixels). Can be specified either as horizontal and vertical padding, e.g. `[10, 10]` or as a breakpoint -> containerPadding map, e.g. `{lg: [10, 10], md: [10, 10], ...}.
  containerPadding: [number, number] | { [key: string]: [number, number] };

  // layouts is an object mapping breakpoints to layouts.
  // e.g. {lg: Layout, md: Layout, ...}
  layouts: { [key: string]: Layout };

  //
  // Callbacks
  //

  // Calls back with breakpoint and new # cols
  onBreakpointChange: (newBreakpoint: string, newCols: number) => void;

  // Callback so you can save the layout.
  // AllLayouts are keyed by breakpoint.
  onLayoutChange: (
    currentLayout: Layout,
    allLayouts: { [key: string]: Layout },
  ) => void;

  // Callback when the width changes, so you can modify the layout as needed.
  onWidthChange: (
    containerWidth: number,
    margin: [number, number],
    cols: number,
    containerPadding: [number, number],
  ) => void;
};

type GridItemProps = {
  // A string corresponding to the component key
  i: string;

  // These are all in grid units, not pixels
  x: number;
  y: number;
  w: number;
  h: number;

  // default: 0
  minW?: number;

  // default: Infinity
  maxW?: number;

  // default: 0
  minH?: number;

  // default: Infinity
  maxH?: number;

  // If true, equal to `isDraggable: false, isResizable: false`.
  // default: false
  static?: boolean;

  // If false, will not be draggable. Overrides `static`.
  // default: false
  isDraggable?: boolean;

  // If false, will not be resizable. Overrides `static`.
  // default: true
  isResizable?: boolean;

  // By default, a handle is only shown on the bottom-right (southeast) corner.
  // As of RGL >= 1.4.0, resizing on any corner works just fine!
  // //default: ['se']
  resizeHandles?: Array<"s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne">;

  // If true and draggable, item will be moved only within grid.
  // default: false
  isBounded?: boolean;
};
