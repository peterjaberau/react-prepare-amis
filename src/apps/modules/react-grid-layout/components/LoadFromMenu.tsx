import React from 'react';
import { LayoutDashboard, Briefcase, User } from 'lucide-react';
import { Canvas } from '../types';
import { analyticsDashboard, projectManagement, personalDashboard } from '../data/examples';

interface LoadFromMenuProps {
  onSelect: (canvases: Canvas[]) => void;
  onClose: () => void;
}

const LoadFromMenu: React.FC<LoadFromMenuProps> = ({ onSelect, onClose }) => {
  const examples = [
    {
      id: 'analytics',
      name: 'Analytics Dashboard',
      description: 'Data visualization with metrics and charts',
      icon: <LayoutDashboard size={18} />,
      data: analyticsDashboard,
      canvasCount: analyticsDashboard.length,
      widgetCount: analyticsDashboard.reduce((count, canvas) => count + canvas.widgets.length, 0)
    },
    {
      id: 'project',
      name: 'Project Management',
      description: 'Task tracking and project overview',
      icon: <Briefcase size={18} />,
      data: projectManagement,
      canvasCount: projectManagement.length,
      widgetCount: projectManagement.reduce((count, canvas) => count + canvas.widgets.length, 0)
    },
    {
      id: 'personal',
      name: 'Personal Dashboard',
      description: 'Daily overview and personal metrics',
      icon: <User size={18} />,
      data: personalDashboard,
      canvasCount: personalDashboard.length,
      widgetCount: personalDashboard.reduce((count, canvas) => count + canvas.widgets.length, 0)
    }
  ];

  // Close the menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.load-from-menu') && 
          !(e.target as Element).closest('button')) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-md shadow-lg z-20 load-from-menu">
      <div className="p-3 border-b">
        <h3 className="text-sm font-semibold text-gray-700">Load Example Dashboard</h3>
      </div>
      <div className="py-2">
        {examples.map(example => (
          <button
            key={example.id}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start transition-colors"
            onClick={() => onSelect(example.data)}
          >
            <div className="flex-shrink-0 mr-3 mt-1 p-2 bg-indigo-100 rounded-md text-indigo-600">
              {example.icon}
            </div>
            <div>
              <div className="font-medium text-gray-800">{example.name}</div>
              <div className="text-sm text-gray-500">{example.description}</div>
              <div className="text-xs text-gray-400 mt-1">
                {example.canvasCount} canvas{example.canvasCount !== 1 ? 'es' : ''}, {example.widgetCount} widget{example.widgetCount !== 1 ? 's' : ''}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LoadFromMenu;