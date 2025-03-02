import React, { useState } from 'react';
import { Edit, Trash2, Check, X, Settings, Code, Plus } from 'lucide-react';
import { Canvas, GridConfig } from '../types';
import GridToolbar from './GridToolbar';
import JSONModal from './JSONModal';
import CanvasWidgetPopover from './CanvasWidgetPopover';
import { useReactGridLayoutMachine } from '../machines/reactGridLayoutMachineStore';

interface CanvasHeaderProps {
  canvas: Canvas;
  onRenameCanvas: (canvasId: string, newName: string) => void;
  canRemove: boolean;
  onUpdateCanvas?: (updatedCanvas: Canvas) => void;
}

const CanvasHeader: React.FC<CanvasHeaderProps> = ({
  canvas,
  onRenameCanvas,
  canRemove,
  onUpdateCanvas
}) => {

  const { state, actor } = useReactGridLayoutMachine();

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(canvas.name);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isJSONModalOpen, setIsJSONModalOpen] = useState(false);
  const [isWidgetPopoverOpen, setIsWidgetPopoverOpen] = useState(false);
  const [widgetPopoverPosition, setWidgetPopoverPosition] = useState({ x: 0, y: 0 });

  const handleStartEditing = () => {
    setIsEditing(true);
    setNewName(canvas.name);
  };

  const handleSaveCanvasName = () => {
    if (newName.trim()) {
      onRenameCanvas(canvas.id, newName);
    }
    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleConfigChange = (newConfig: GridConfig) => {
    if (onUpdateCanvas) {
      const updatedCanvas = {
        ...canvas,
        config: newConfig
      };
      onUpdateCanvas(updatedCanvas);
    }
  };

  const handleOpenWidgetPopover = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setWidgetPopoverPosition({
      x: rect.left,
      y: rect.bottom + window.scrollY
    });
    setIsWidgetPopoverOpen(true);
  };

  const handleCloseWidgetPopover = () => {
    setIsWidgetPopoverOpen(false);
  };

  const handleCreateWidget = (widgetName: string) => {
    if (onUpdateCanvas && widgetName.trim()) {
      // Create a new widget with a unique ID
      const newWidget = {
        i: crypto.randomUUID(),
        x: (canvas.widgets.length * 4) % canvas.config.cols,
        y: Math.floor(canvas.widgets.length / 3) * 4,
        w: 4,
        h: 4,
        name: widgetName,
        canvasId: canvas.id
      };

      // Update the canvas with the new widget
      const updatedCanvas = {
        ...canvas,
        widgets: [...canvas.widgets, newWidget]
      };

      onUpdateCanvas(updatedCanvas);
      handleCloseWidgetPopover();
    }
  };

  return (
    <div className="border-b">
      <div className="flex justify-between items-center p-4">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border rounded px-3 py-2 text-lg w-64"
              autoFocus
            />
            <button
              onClick={handleSaveCanvasName}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <Check size={18} className="text-green-600" />
            </button>
            <button
              onClick={handleCancelEditing}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <X size={18} className="text-red-600" />
            </button>
          </div>
        ) : (
          <h3 className="text-xl font-semibold text-gray-800">{canvas.name} - {canvas.id}</h3>
        )}

        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenWidgetPopover}
            className="p-2 hover:bg-gray-200 rounded-md flex items-center"
            title="Add Widget to Canvas"
          >
            <Plus size={18} className="text-green-600" />
          </button>
          <button
            onClick={() => setIsJSONModalOpen(true)}
            className="p-2 hover:bg-gray-200 rounded-md flex items-center"
            title="View JSON"
          >
            <Code size={18} className="text-gray-600" />
          </button>
          <button
            onClick={toggleSettings}
            className="p-2 hover:bg-gray-200 rounded-md flex items-center"
            title="Canvas Settings"
          >
            <Settings size={18} className="text-gray-600" />
          </button>
          {!isEditing && (
            <button
              onClick={handleStartEditing}
              className="p-2 hover:bg-gray-200 rounded-md"
              title="Rename Canvas"
            >
              <Edit size={18} className="text-blue-600" />
            </button>
          )}
          <button
            onClick={() => actor.send({ type: 'REMOVE_CANVAS', params: { canvasId: canvas.id } })}
            className="p-2 hover:bg-gray-200 rounded-md"
            disabled={!canRemove}
            title={canRemove ? "Remove Canvas" : "Cannot remove the last canvas"}
          >
            <Trash2 size={18} className={`${canRemove ? 'text-red-600' : 'text-gray-400'}`} />
          </button>
        </div>
      </div>

      {isSettingsOpen && (
        <div className="p-4 bg-gray-50 border-t">
          <GridToolbar
            config={canvas.config}
            onConfigChange={handleConfigChange}
            onShowJSON={() => setIsJSONModalOpen(true)}
          />
        </div>
      )}

      <JSONModal
        isOpen={isJSONModalOpen}
        onClose={() => setIsJSONModalOpen(false)}
        canvas={canvas}
      />

      <CanvasWidgetPopover
        isOpen={isWidgetPopoverOpen}
        position={widgetPopoverPosition}
        onClose={handleCloseWidgetPopover}
        onCreateWidget={handleCreateWidget}
      />
    </div>
  );
};

export default CanvasHeader;
