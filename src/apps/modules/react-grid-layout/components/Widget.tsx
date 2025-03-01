import React, { useState } from 'react';
import { Edit, Trash2, Check, X, MoveRight } from 'lucide-react';
import { WidgetItem, Canvas } from '../types';

interface WidgetProps {
  widget: WidgetItem;
  onRemove: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onMove: (id: string, targetCanvasId: string) => void;
  allCanvases: Canvas[];
  currentCanvasId: string;
}

const Widget: React.FC<WidgetProps> = ({ 
  widget, 
  onRemove, 
  onRename, 
  onMove,
  allCanvases,
  currentCanvasId
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(widget.name);
  const [isMoveMenuOpen, setIsMoveMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleSave = () => {
    onRename(widget.i, newName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewName(widget.name);
    setIsEditing(false);
  };

  const toggleMoveMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMoveMenuOpen(!isMoveMenuOpen);
  };

  const handleMoveToCanvas = (e: React.MouseEvent, targetCanvasId: string) => {
    e.stopPropagation();
    onMove(widget.i, targetCanvasId);
    setIsMoveMenuOpen(false);
  };

  // Handle drag start for manual widget movement between canvases
  const handleDragStart = (e: React.DragEvent) => {
    // Set the dragged widget data
    e.dataTransfer.setData('widgetId', widget.i);
    e.dataTransfer.setData('sourceCanvasId', currentCanvasId);
    
    // Set a custom drag image (optional)
    const dragImage = document.createElement('div');
    dragImage.textContent = widget.name;
    dragImage.className = 'bg-white p-2 border rounded shadow-md text-sm';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Set effect and start dragging state
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    
    // Clean up the drag image element after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Prevent drag when clicking on buttons
  const handleMouseDown = (e: React.MouseEvent) => {
    // Stop propagation only for buttons and inputs
    if (
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLInputElement ||
      (e.target instanceof SVGElement && e.target.closest('button'))
    ) {
      e.stopPropagation();
    }
  };

  return (
    <div 
      className={`h-full w-full bg-white rounded-lg shadow-md flex flex-col overflow-hidden ${isDragging ? 'opacity-50' : ''}`}
      onMouseDown={handleMouseDown}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-gray-100 p-2 flex justify-between items-center border-b cursor-move">
        {isEditing ? (
          <div className="flex items-center space-x-2 w-full">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-2 py-1 border rounded"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              onClick={handleSave}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <Check size={16} className="text-green-600" />
            </button>
            <button 
              onClick={handleCancel}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X size={16} className="text-red-600" />
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-medium text-gray-800 truncate">{widget.name}</h3>
            <div className="flex space-x-1">
              {allCanvases.length > 1 && (
                <div className="relative">
                  <button 
                    onClick={toggleMoveMenu}
                    className="p-1 hover:bg-gray-200 rounded" 
                    title="Move to another canvas"
                  >
                    <MoveRight size={16} className="text-purple-600" />
                  </button>
                  
                  {isMoveMenuOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                        Move to canvas:
                      </div>
                      {allCanvases
                        .filter(canvas => canvas.id !== currentCanvasId)
                        .map(canvas => (
                          <button
                            key={canvas.id}
                            onClick={(e) => handleMoveToCanvas(e, canvas.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {canvas.name}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
              <button 
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <Edit size={16} className="text-blue-600" />
              </button>
              <button 
                onClick={() => onRemove(widget.i)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <Trash2 size={16} className="text-red-600" />
              </button>
            </div>
          </>
        )}
      </div>
      <div className="flex-1 p-4 bg-gray-50">
        <div className="h-full flex items-center justify-center text-gray-500">
          {widget.content || `Widget ${widget.i} Content`}
        </div>
      </div>
    </div>
  );
};

export default Widget;