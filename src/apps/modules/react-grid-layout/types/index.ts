export interface WidgetItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  content?: string;
  canvasId: string; // Added canvasId to track which canvas the widget belongs to
}

export interface GridConfig {
  cols: number;
  rowHeight: number;
  isBounded: boolean;
  maxRows: number;
  preventCollision: boolean;
  allowOverlap: boolean;
  compactType: 'vertical' | 'horizontal' | null;
  margin: [number, number];
}

export interface Canvas {
  id: string;
  name: string;
  widgets: WidgetItem[];
  config: GridConfig;
}