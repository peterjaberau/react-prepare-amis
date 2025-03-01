import React from 'react';
import { X, Copy } from 'lucide-react';
import { Canvas } from '../types';

interface GlobalJSONModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvases: Canvas[];
}

const GlobalJSONModal: React.FC<GlobalJSONModalProps> = ({ isOpen, onClose, canvases }) => {
  if (!isOpen) return null;
  
  const jsonData = {
    canvases,
    totalWidgets: canvases.reduce((total, canvas) => total + canvas.widgets.length, 0),
    summary: {
      canvasCount: canvases.length,
      canvasNames: canvases.map(canvas => canvas.name),
      widgetsByCanvas: canvases.reduce((acc, canvas) => {
        acc[canvas.name] = canvas.widgets.length;
        return acc;
      }, {} as Record<string, number>)
    }
  };
  
  const jsonString = JSON.stringify(jsonData, null, 2);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Dashboard JSON State</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="relative">
            <button 
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center"
              title="Copy to clipboard"
            >
              <Copy size={16} className="text-gray-700 mr-1" />
              <span className="text-sm">Copy</span>
            </button>
            <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm font-mono">
              {jsonString}
            </pre>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalJSONModal;