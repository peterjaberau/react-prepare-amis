import React from 'react';
import { Settings, Code } from 'lucide-react';
import { GridConfig } from '../types';

interface GridToolbarProps {
  config: GridConfig;
  onConfigChange: (config: GridConfig) => void;
  onShowJSON: () => void;
}

const GridToolbar: React.FC<GridToolbarProps> = ({ 
  config, 
  onConfigChange,
  onShowJSON
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    let newValue: any = value;
    
    if (type === 'number') {
      newValue = parseInt(value, 10);
    } else if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (name === 'margin') {
      const marginValue = parseInt(value, 10);
      newValue = [marginValue, marginValue];
    }
    
    onConfigChange({
      ...config,
      [name]: newValue
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Settings size={20} className="mr-2" />
          Canvas Settings
        </h2>
        <button
          onClick={onShowJSON}
          className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Code size={18} />
          <span>View JSON</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Columns
          </label>
          <input
            type="number"
            name="cols"
            value={config.cols}
            onChange={handleChange}
            min={1}
            max={24}
            className="border rounded-md px-3 py-2"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Row Height (px)
          </label>
          <input
            type="number"
            name="rowHeight"
            value={config.rowHeight}
            onChange={handleChange}
            min={30}
            max={300}
            className="border rounded-md px-3 py-2"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Margin (px)
          </label>
          <input
            type="number"
            name="margin"
            value={config.margin[0]}
            onChange={handleChange}
            min={0}
            max={50}
            className="border rounded-md px-3 py-2"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Max Rows
          </label>
          <input
            type="number"
            name="maxRows"
            value={config.maxRows}
            onChange={handleChange}
            min={1}
            max={50}
            className="border rounded-md px-3 py-2"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Compact Type
          </label>
          <select
            name="compactType"
            value={config.compactType === null ? 'none' : config.compactType}
            onChange={(e) => {
              const value = e.target.value;
              onConfigChange({
                ...config,
                compactType: value === 'none' ? null : value as 'vertical' | 'horizontal'
              });
            }}
            className="border rounded-md px-3 py-2"
          >
            <option value="none">None</option>
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isBounded"
            name="isBounded"
            checked={config.isBounded}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isBounded" className="ml-2 text-sm text-gray-700">
            Is Bounded
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="preventCollision"
            name="preventCollision"
            checked={config.preventCollision}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="preventCollision" className="ml-2 text-sm text-gray-700">
            Prevent Collision
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowOverlap"
            name="allowOverlap"
            checked={config.allowOverlap}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="allowOverlap" className="ml-2 text-sm text-gray-700">
            Allow Overlap
          </label>
        </div>
      </div>
    </div>
  );
};

export default GridToolbar;