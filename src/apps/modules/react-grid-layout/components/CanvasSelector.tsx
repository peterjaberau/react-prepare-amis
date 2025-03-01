import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { Canvas } from '../types';

interface CanvasSelectorProps {
  canvases: Canvas[];
  activeCanvasId: string;
  onCanvasChange: (canvasId: string) => void;
  onAddCanvas: () => void;
  onRenameCanvas: (canvasId: string, newName: string) => void;
  onRemoveCanvas: (canvasId: string) => void;
}

const CanvasSelector: React.FC<CanvasSelectorProps> = ({
  canvases,
  activeCanvasId,
  onCanvasChange,
  onAddCanvas,
  onRenameCanvas,
  onRemoveCanvas
}) => {
  const [editingCanvasId, setEditingCanvasId] = useState<string | null>(null);
  const [newCanvasName, setNewCanvasName] = useState('');

  const handleStartEditing = (canvas: Canvas) => {
    setEditingCanvasId(canvas.id);
    setNewCanvasName(canvas.name);
  };

  const handleSaveCanvasName = (canvasId: string) => {
    if (newCanvasName.trim()) {
      onRenameCanvas(canvasId, newCanvasName);
    }
    setEditingCanvasId(null);
  };

  const handleCancelEditing = () => {
    setEditingCanvasId(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Canvases</h2>
        <button
          onClick={onAddCanvas}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={18} />
          <span>Add Canvas</span>
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {canvases.map(canvas => (
          <div 
            key={canvas.id}
            className={`relative group flex items-center border rounded-md px-3 py-2 ${
              canvas.id === activeCanvasId 
                ? 'bg-blue-100 border-blue-300' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {editingCanvasId === canvas.id ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newCanvasName}
                  onChange={(e) => setNewCanvasName(e.target.value)}
                  className="border rounded px-2 py-1 text-sm w-32"
                  autoFocus
                />
                <button 
                  onClick={() => handleSaveCanvasName(canvas.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Check size={14} className="text-green-600" />
                </button>
                <button 
                  onClick={handleCancelEditing}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X size={14} className="text-red-600" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onCanvasChange(canvas.id)}
                  className="text-sm font-medium mr-2"
                >
                  {canvas.name}
                </button>
                
                <div className="hidden group-hover:flex items-center space-x-1 ml-2">
                  <button 
                    onClick={() => handleStartEditing(canvas)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Edit size={14} className="text-blue-600" />
                  </button>
                  <button 
                    onClick={() => onRemoveCanvas(canvas.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    disabled={canvases.length <= 1}
                  >
                    <Trash2 size={14} className={`${canvases.length <= 1 ? 'text-gray-400' : 'text-red-600'}`} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CanvasSelector;