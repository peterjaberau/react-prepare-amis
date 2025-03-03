import React, { useState, useCallback } from 'react';
// @ts-ignore
import { Responsive, WidthProvider } from 'react-grid-layout';
import Widget from './Widget';
import { WidgetItem, Canvas } from '../types';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface GridCanvasProps {
  canvas: Canvas;
  allCanvases: Canvas[];
  onUpdateCanvas: (updatedCanvas: Canvas) => void;
  onMoveWidgetToCanvas: (widgetId: string, sourceCanvasId: string, targetCanvasId: string) => void;
}

const GridCanvas: React.FC<GridCanvasProps> = ({
  canvas,
  allCanvases,
  onUpdateCanvas,
  onMoveWidgetToCanvas
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);

  const handleRemoveWidget = (id: string) => {
    const updatedCanvas = {
      ...canvas,
      widgets: canvas.widgets.filter(widget => widget.i !== id)
    };

    onUpdateCanvas(updatedCanvas);
  };

  const handleRenameWidget = (id: string, newName: string) => {
    const updatedCanvas = {
      ...canvas,
      widgets: canvas.widgets.map(widget =>
        widget.i === id ? { ...widget, name: newName } : widget
      )
    };

    onUpdateCanvas(updatedCanvas);
  };

  const handleMoveWidget = (widgetId: string, targetId: string) => {
    if (targetId && targetId !== canvas.id) {
      onMoveWidgetToCanvas(widgetId, canvas.id, targetId);
    }
  };

  // Debounced layout change handler
  const handleLayoutChange = useCallback((layout: any) => {
    const updatedWidgets = canvas.widgets.map(widget => {
      const updatedPosition = layout.find((item: any) => item.i === widget.i);
      if (updatedPosition) {
        return {
          ...widget,
          x: updatedPosition.x,
          y: updatedPosition.y,
          w: updatedPosition.w,
          h: updatedPosition.h
        };
      }
      return widget;
    });

    const updatedCanvas = {
      ...canvas,
      widgets: updatedWidgets
    };

    onUpdateCanvas(updatedCanvas);
  }, [canvas, onUpdateCanvas]);

  const handleDragStart = () => {
    setIsDragging(true);
    document.body.classList.add('dragging-widget');
  };

  const handleDragStop = () => {
    setIsDragging(false);
    document.body.classList.remove('dragging-widget');
  };

  const handleResizeStart = () => {
    setIsResizing(true);
    document.body.classList.add('resizing-widget');
  };

  const handleResizeStop = () => {
    setIsResizing(false);
    document.body.classList.remove('resizing-widget');
  };

  // Handle drag events for canvas drop target
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDropTarget) {
      setIsDropTarget(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set to false if we're leaving the canvas (not entering a child element)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDropTarget(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropTarget(false);

    const widgetId = e.dataTransfer.getData('widgetId');
    const sourceCanvasId = e.dataTransfer.getData('sourceCanvasId');

    if (widgetId && sourceCanvasId && sourceCanvasId !== canvas.id) {
      onMoveWidgetToCanvas(widgetId, sourceCanvasId, canvas.id);
    }
  };

  return (
    <div
      className={`bg-gray-100 p-4 min-h-[400px] canvas-drop-target ${isDropTarget ? 'active' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {canvas.widgets.length === 0 ? (
        <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
          <p className="text-xl mb-4">No widgets in this canvas</p>
          <p className="text-sm text-gray-400">Add widgets using the "Add Widget" button</p>
        </div>
      ) : (
        <ResponsiveGridLayout
          className={`layout ${isDragging ? 'is-dragging' : ''} ${isResizing ? 'is-resizing' : ''}`}
          layouts={{ lg: canvas.widgets }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: canvas.config.cols, md: Math.max(6, canvas.config.cols - 2), sm: 6, xs: 4, xxs: 2 }}
          rowHeight={canvas.config.rowHeight}
          maxRows={canvas.config.maxRows}
          isBounded={canvas.config.isBounded}
          preventCollision={canvas.config.preventCollision}
          allowOverlap={canvas.config.allowOverlap}
          compactType={canvas.config.compactType}
          margin={canvas.config.margin}
          onLayoutChange={handleLayoutChange}
          onDragStart={handleDragStart}
          onDragStop={handleDragStop}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          isDraggable={true}
          isResizable={true}
        >
          {canvas.widgets.map(widget => (
            <div key={widget.i} data-grid={widget}>
              <Widget
                widget={widget}
                onRemove={handleRemoveWidget}
                onRename={handleRenameWidget}
                onMove={handleMoveWidget}
                allCanvases={allCanvases}
                currentCanvasId={canvas.id}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </div>
  );
};

export default GridCanvas;
