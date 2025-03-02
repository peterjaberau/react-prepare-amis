import React, { useState } from "react";
import GridCanvas from "./components/GridCanvas";
import CanvasHeader from "./components/CanvasHeader";
import WidgetCreationPopover from "./components/WidgetCreationPopover";
import GlobalJSONModal from "./components/GlobalJSONModal";
import LoadFromMenu from "./components/LoadFromMenu";
import { Canvas } from "./types";
import { v4 as uuidv4 } from "uuid";
import { Code, Plus, FolderOpen, RefreshCw } from "lucide-react";
import { emptyCanvas } from "./data/examples";
import { useReactGridLayoutMachine } from "./machines/reactGridLayoutMachineStore";
import "./index.css";
import { EuiButton,EuiPopover } from "@elastic/eui";

function ReactGridLayoutApp() {
  const { state, actor } = useReactGridLayoutMachine();



  const [isWidgetPopoverOpen, setIsWidgetPopoverOpen] = useState(false);
  const [widgetPopoverPosition, setWidgetPopoverPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isGlobalJSONModalOpen, setIsGlobalJSONModalOpen] = useState(false);
  const [isLoadFromMenuOpen, setIsLoadFromMenuOpen] = useState(false);



  const handleUpdateCanvas = (updatedCanvas: Canvas) => {
    // setCanvases(
    //   canvases.map((canvas) =>
    //     canvas.id === updatedCanvas.id ? updatedCanvas : canvas,
    //   ),
    // );
  };

  const handleMoveWidgetToCanvas = (
    widgetId: string,
    sourceCanvasId: string,
    targetCanvasId: string,
  ) => {
  };

  // internal state
  const handleOpenWidgetPopover = (event: React.MouseEvent) => {
    setWidgetPopoverPosition({ x: event.clientX, y: event.clientY });
    setIsWidgetPopoverOpen(true);
  };

  // internal state
  const handleCloseWidgetPopover = () => {
    setIsWidgetPopoverOpen(false);
  };

  const handleCreateWidget = (title: string, targetCanvasId: string) => {
  };



  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Canvases - {state.value}{" "}
          </h2>
          <div className="flex items-center space-x-3">
            {state.context.data.map((example: any) => (
              <EuiButton
                key={example.id}
                size="s"
                type="button"
                iconSize="s"
                color="text"
                fill
                onClick={() =>
                  actor.send({
                    type: "LOAD_EXAMPLE",
                    params: { exampleId: example.id },
                  })
                }
              >
                {example.id}
              </EuiButton>
            ))}

            <button
              onClick={() => actor.send({ type: "NEW_SESSION" })}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
              title="Start a new session"
            >
              <RefreshCw size={18} className="mr-2" />
              New Session
            </button>

            <EuiPopover
              id={'add-new-widget-popover'}
              button={<EuiButton onClick={() => actor.send({ type: 'OPEN_WIDGET_POPOVER'})}>Add New Widget</EuiButton>}
              isOpen={state.context.components.ReactGridLayoutApp.isWidgetPopoverOpen}
              closePopover={() => actor.send({ type: "CLOSE_WIDGET_POPOVER" })}
            >
              <WidgetCreationPopover />
            </EuiPopover>

            <button
              onClick={() => setIsGlobalJSONModalOpen(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
              title="View complete dashboard state"
            >
              <Code size={18} className="mr-2" />
              View JSON
            </button>

            <button
              onClick={handleOpenWidgetPopover}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add Widget
            </button>

            <button
              onClick={() => actor.send({ type: "ADD_CANVAS" })}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Add Canvas
            </button>
          </div>
        </div>

        <div className="space-y-10">
          {state.context.canvases.map((canvas: any) => (
            <div
              key={canvas.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >

              <CanvasHeader
                canvas={canvas}
                canRemove={state.context.canvases.length > 1}
                onRenameCanvas={(canvasId: string, newName) => actor.send({ type: "RENAME_CANVAS", params: { canvasId: canvasId, newName: newName } })}
                onUpdateCanvas={(updatedCanvas: any) => actor.send({ type: "UPDATE_CANVAS", params: { updatedCanvas: updatedCanvas } })}
              />

              <GridCanvas
                canvas={canvas}
                allCanvases={state.context.canvases}
                onUpdateCanvas={handleUpdateCanvas}
                onMoveWidgetToCanvas={handleMoveWidgetToCanvas}
              />
            </div>
          ))}
        </div>
      </main>





      <GlobalJSONModal
        isOpen={isGlobalJSONModalOpen}
        onClose={() => setIsGlobalJSONModalOpen(false)}
        canvases={state.context.canvases}
      />
    </div>
  );
}

export default ReactGridLayoutApp;

/*

function ReactGridLayoutApp() {

  const { state, actor } = useReactGridLayoutMachine();


  const [canvases, setCanvases] = useState<Canvas[]>([
    {
      id: uuidv4(),
      name: 'Canvas 1',
      widgets: [],
      config: {
        cols: 12,
        rowHeight: 100,
        isBounded: false,
        maxRows: 12,
        preventCollision: false,
        allowOverlap: false,
        compactType: 'vertical',
        margin: [10, 10]
      }
    }
  ]);
  const [isWidgetPopoverOpen, setIsWidgetPopoverOpen] = useState(false);
  const [widgetPopoverPosition, setWidgetPopoverPosition] = useState({ x: 0, y: 0 });
  const [isGlobalJSONModalOpen, setIsGlobalJSONModalOpen] = useState(false);
  const [isLoadFromMenuOpen, setIsLoadFromMenuOpen] = useState(false);

  const handleAddCanvas = () => {
    const newCanvas: Canvas = {
      id: uuidv4(),
      name: `Canvas ${canvases.length + 1}`,
      widgets: [],
      config: {
        cols: 12,
        rowHeight: 100,
        isBounded: false,
        maxRows: 12,
        preventCollision: false,
        allowOverlap: false,
        compactType: 'vertical',
        margin: [10, 10]
      }
    };

    setCanvases([...canvases, newCanvas]);
  };

  const handleRenameCanvas = (canvasId: string, newName: string) => {
    setCanvases(
      canvases.map(canvas =>
        canvas.id === canvasId ? { ...canvas, name: newName } : canvas
      )
    );
  };

  const handleRemoveCanvas = (canvasId: string) => {
    if (canvases.length <= 1) {
      alert("You cannot remove the last canvas.");
      return;
    }

    const newCanvases = canvases.filter(canvas => canvas.id !== canvasId);
    setCanvases(newCanvases);
  };

  const handleUpdateCanvas = (updatedCanvas: Canvas) => {
    setCanvases(
      canvases.map(canvas =>
        canvas.id === updatedCanvas.id ? updatedCanvas : canvas
      )
    );
  };

  const handleMoveWidgetToCanvas = (widgetId: string, sourceCanvasId: string, targetCanvasId: string) => {
    // Find the source and target canvases
    const sourceCanvas = canvases.find(canvas => canvas.id === sourceCanvasId);
    const targetCanvas = canvases.find(canvas => canvas.id === targetCanvasId);

    if (!sourceCanvas || !targetCanvas) return;

    // Find the widget to move
    const widgetToMove = sourceCanvas.widgets.find(widget => widget.i === widgetId);

    if (!widgetToMove) return;

    // Create a copy of the widget with the new canvasId
    const movedWidget = {
      ...widgetToMove,
      canvasId: targetCanvasId,
      // Position the widget at a reasonable location in the target canvas
      x: 0,
      y: targetCanvas.widgets.length > 0
        ? Math.max(...targetCanvas.widgets.map(w => w.y + w.h))
        : 0
    };

    // Remove the widget from the source canvas
    const updatedSourceCanvas = {
      ...sourceCanvas,
      widgets: sourceCanvas.widgets.filter(widget => widget.i !== widgetId)
    };

    // Add the widget to the target canvas
    const updatedTargetCanvas = {
      ...targetCanvas,
      widgets: [...targetCanvas.widgets, movedWidget]
    };

    // Update both canvases
    setCanvases(
      canvases.map(canvas => {
        if (canvas.id === sourceCanvasId) return updatedSourceCanvas;
        if (canvas.id === targetCanvasId) return updatedTargetCanvas;
        return canvas;
      })
    );
  };

  // internal state
  const handleOpenWidgetPopover = (event: React.MouseEvent) => {
    setWidgetPopoverPosition({ x: event.clientX, y: event.clientY });
    setIsWidgetPopoverOpen(true);
  };

  // internal state
  const handleCloseWidgetPopover = () => {
    setIsWidgetPopoverOpen(false);
  };

  const handleCreateWidget = (title: string, targetCanvasId: string) => {
    const targetCanvas = canvases.find(canvas => canvas.id === targetCanvasId);

    if (!targetCanvas) return;

    const id = uuidv4();
    const newWidget = {
      i: id,
      x: (targetCanvas.widgets.length * 4) % targetCanvas.config.cols,
      y: Math.floor(targetCanvas.widgets.length / 3) * 4,
      w: 4,
      h: 4,
      name: title,
      canvasId: targetCanvasId
    };

    const updatedCanvas = {
      ...targetCanvas,
      widgets: [...targetCanvas.widgets, newWidget]
    };

    handleUpdateCanvas(updatedCanvas);
    handleCloseWidgetPopover();
  };

  const handleLoadExample = (exampleCanvases: Canvas[]) => {
    // Generate new IDs for all canvases and widgets to ensure uniqueness
    const newCanvases = exampleCanvases.map(canvas => {
      const newCanvasId = uuidv4();
      return {
        ...canvas,
        id: newCanvasId,
        widgets: canvas.widgets.map(widget => ({
          ...widget,
          i: uuidv4(),
          canvasId: newCanvasId
        }))
      };
    });

    setCanvases(newCanvases);
    setIsLoadFromMenuOpen(false);
  };

  const handleNewSession = () => {
    // Generate a new empty canvas with a fresh ID
    const newEmptyCanvas = emptyCanvas.map(canvas => ({
      ...canvas,
      id: uuidv4()
    }));

    setCanvases(newEmptyCanvas);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">


        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Canvases</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setIsLoadFromMenuOpen(!isLoadFromMenuOpen)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                title="Load example dashboard"
              >
                <FolderOpen size={18} className="mr-2" />
                Load From
              </button>
              {isLoadFromMenuOpen && (
                <LoadFromMenu
                  onSelect={handleLoadExample}
                  onClose={() => setIsLoadFromMenuOpen(false)}
                />
              )}
            </div>

            <button
              onClick={handleNewSession}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
              title="Start a new session"
            >
              <RefreshCw size={18} className="mr-2" />
              New Session
            </button>

            <button
              onClick={() => setIsGlobalJSONModalOpen(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
              title="View complete dashboard state"
            >
              <Code size={18} className="mr-2" />
              View JSON
            </button>

            <button
              onClick={handleOpenWidgetPopover}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add Widget
            </button>

            <button
              onClick={handleAddCanvas}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Add Canvas
            </button>
          </div>
        </div>

        <div className="space-y-10">
          {canvases.map((canvas) => (
            <div
              key={canvas.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <CanvasHeader
                canvas={canvas}
                onRenameCanvas={handleRenameCanvas}
                onRemoveCanvas={handleRemoveCanvas}
                canRemove={canvases.length > 1}
                onUpdateCanvas={handleUpdateCanvas}
              />
              <GridCanvas
                canvas={canvas}
                allCanvases={canvases}
                onUpdateCanvas={handleUpdateCanvas}
                onMoveWidgetToCanvas={handleMoveWidgetToCanvas}
              />
            </div>
          ))}
        </div>
      </main>

      <WidgetCreationPopover
        isOpen={isWidgetPopoverOpen}
        position={widgetPopoverPosition}
        onClose={handleCloseWidgetPopover}
        canvases={canvases}
        onCreateWidget={handleCreateWidget}
      />

      <GlobalJSONModal
        isOpen={isGlobalJSONModalOpen}
        onClose={() => setIsGlobalJSONModalOpen(false)}
        canvases={canvases}
      />
    </div>
  );
}



 */
