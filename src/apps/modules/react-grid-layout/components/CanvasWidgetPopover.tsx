import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface CanvasWidgetPopoverProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onCreateWidget: (widgetName: string) => void;
}

const CanvasWidgetPopover: React.FC<CanvasWidgetPopoverProps> = ({
  isOpen,
  position,
  onClose,
  onCreateWidget
}) => {
  const [widgetName, setWidgetName] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setWidgetName('');
    }
  }, [isOpen]);

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
    if (widgetName.trim()) {
      onCreateWidget(widgetName.trim());
      setWidgetName('');
    }
  };

  // Calculate position to ensure popover stays within viewport
  const calculatePosition = () => {
    const popoverWidth = 300;
    const popoverHeight = 180;
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
      className="fixed bg-white rounded-lg shadow-xl z-50 w-72"
      style={{ 
        top: `${y}px`, 
        left: `${x}px`,
      }}
    >
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="text-md font-semibold text-gray-800">Add Widget to Canvas</h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <X size={16} className="text-gray-600" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <label htmlFor="widgetName" className="block text-sm font-medium text-gray-700 mb-1">
            Widget Name
          </label>
          <input
            type="text"
            id="widgetName"
            value={widgetName}
            onChange={(e) => setWidgetName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter widget name"
            autoFocus
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 border rounded-md hover:bg-gray-100 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 text-sm"
            disabled={!widgetName.trim()}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CanvasWidgetPopover;