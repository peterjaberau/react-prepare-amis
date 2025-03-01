import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Canvas } from '../types';

interface WidgetCreationPopoverProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  canvases: Canvas[];
  onCreateWidget: (title: string, targetCanvasId: string) => void;
}

const WidgetCreationPopover: React.FC<WidgetCreationPopoverProps> = ({
  isOpen,
  position,
  onClose,
  canvases,
  onCreateWidget
}) => {
  const [widgetTitle, setWidgetTitle] = useState('');
  const [selectedCanvasId, setSelectedCanvasId] = useState<string>('');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && canvases.length > 0) {
      setSelectedCanvasId(canvases[0].id);
    }
  }, [isOpen, canvases]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (widgetTitle.trim() && selectedCanvasId) {
      onCreateWidget(widgetTitle.trim(), selectedCanvasId);
      setWidgetTitle('');
    }
  };

  // Calculate position to ensure popover stays within viewport
  const calculatePosition = () => {
    const popoverWidth = 320;
    const popoverHeight = 250;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let x = position.x;
    let y = position.y;
    
    // Adjust horizontal position if needed
    if (x + popoverWidth > windowWidth) {
      x = windowWidth - popoverWidth - 20;
    }
    
    // Adjust vertical position if needed
    if (y + popoverHeight > windowHeight) {
      y = windowHeight - popoverHeight - 20;
    }
    
    return { x, y };
  };
  
  const { x, y } = calculatePosition();

  return (
    <div 
      ref={popoverRef}
      className="fixed bg-white rounded-lg shadow-xl z-50 w-80"
      style={{ 
        top: `${y}px`, 
        left: `${x}px`,
      }}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Add New Widget</h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <X size={18} className="text-gray-600" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <label htmlFor="widgetTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Widget Title
          </label>
          <input
            type="text"
            id="widgetTitle"
            value={widgetTitle}
            onChange={(e) => setWidgetTitle(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter widget title"
            autoFocus
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="targetCanvas" className="block text-sm font-medium text-gray-700 mb-1">
            Target Canvas
          </label>
          <select
            id="targetCanvas"
            value={selectedCanvasId}
            onChange={(e) => setSelectedCanvasId(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {canvases.map(canvas => (
              <option key={canvas.id} value={canvas.id}>
                {canvas.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={!widgetTitle.trim() || !selectedCanvasId}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default WidgetCreationPopover;