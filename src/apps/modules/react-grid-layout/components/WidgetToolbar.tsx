import React from 'react';
import { Plus, LayoutGrid, MoveRight } from 'lucide-react';
import { Canvas } from '../types';

interface WidgetToolbarProps {
  onAddWidget: () => void;
  allCanvases: Canvas[];
  currentCanvasId: string;
  targetCanvasId: string;
  onTargetCanvasChange: (canvasId: string) => void;
}

const WidgetToolbar: React.FC<WidgetToolbarProps> = ({ 
  onAddWidget, 
  allCanvases,
  currentCanvasId,
  targetCanvasId,
  onTargetCanvasChange
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <LayoutGrid size={20} className="mr-2" />
          Widget Dashboard
        </h2>
        
        <div className="flex items-center space-x-4">
          {allCanvases.length > 1 && (
            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 mr-2 flex items-center">
                <MoveRight size={16} className="mr-1" />
                Target Canvas:
              </label>
              <select
                value={targetCanvasId}
                onChange={(e) => onTargetCanvasChange(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                {allCanvases.map(canvas => (
                  <option 
                    key={canvas.id} 
                    value={canvas.id}
                    disabled={canvas.id === currentCanvasId}
                  >
                    {canvas.name} {canvas.id === currentCanvasId ? '(current)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <button
            onClick={onAddWidget}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus size={18} />
            <span>Add Widget</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WidgetToolbar;