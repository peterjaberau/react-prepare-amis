import React, { useState } from "react";
import { Edit, Trash2, Check, X, Settings, Code, Plus } from "lucide-react";
import { Canvas, GridConfig } from "../types";
import GridToolbar from "./GridToolbar";
import JSONModal from "./JSONModal";
import CanvasWidgetPopover from "./CanvasWidgetPopover";
import { useReactGridLayoutMachine } from "../machines/reactGridLayoutMachineStore";
import {
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem, EuiText
} from "@elastic/eui";

const CanvasHeader: React.FC<any> = ({ canvas }) => {
  const { state, actor } = useReactGridLayoutMachine();

  return (
    <>
      <EuiFlexGroup
        direction={"row"}
        justifyContent={"spaceBetween"}
        gutterSize={"m"}
      >
        <EuiFlexItem grow={true}>
          {state.context.components.CanvasHeader.isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={state.context.components.CanvasHeader.newName}
                onChange={(e) => () =>
                  actor.send({
                    type: "CANVAS_UPDATE_LOCAL_NAME",
                    params: { newName: e.target.value },
                  })
                }
                className="border rounded px-3 py-2 text-lg w-64"
                autoFocus
              />


              <button
                onClick={() =>
                  actor.send({
                    type: "CANVAS_SAVE_NAME",
                    params: { canvasId: canvas.id },
                  })
                }
                className="p-2 hover:bg-gray-200 rounded"
              >
                <Check size={18} className="text-green-600" />
              </button>
              <button
                onClick={() => actor.send({ type: "CANVAS_CANCEL_EDITING" })}
                className="p-2 hover:bg-gray-200 rounded"
              >
                <X size={18} className="text-red-600" />
              </button>
            </div>
          ) : (
              <EuiText>
                <h3> {canvas.name} - {canvas.id}</h3>
              </EuiText>
          )}
        </EuiFlexItem>
        <EuiFlexItem grow={true}>
          <EuiFlexGroup
            direction={"row"}
            justifyContent={"flexEnd"}
            gutterSize="m"
          >
            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                onClick={() =>
                  actor.send({ type: "CANVAS_OPEN_WIDGET_POPOVER" })
                }
                iconType="plus"
                aria-label="Add Widget to Canvas"
              />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                onClick={() => actor.send({ type: "CANVAS_OPEN_JSON_MODAL" })}
                iconType="editorCodeBlock" //editorCodeBlock
                aria-label="View JSON"
              />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                onClick={() => actor.send({ type: "CANVAS_TOGGLE_SETTINGS" })}
                iconType="gear"
                aria-label="Canvas Settings"
              />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              {!state.context.components.CanvasHeader.isEditing && (
                <EuiButtonIcon
                  onClick={() => actor.send({ type: "CANVAS_START_EDITING" })}
                  iconType="pencil"
                  aria-label="Rename Canvas"
                />
              )}
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                onClick={() =>
                  actor.send({
                    type: "REMOVE_CANVAS",
                    params: { canvasId: canvas.id },
                  })
                }
                iconType="trash"
                aria-label="Remove Canvas"
                isDisabled={!(state.context.canvases.length > 1)}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};

export default CanvasHeader;

/*

<div className="border-b">
        <div className="flex justify-between items-center p-4">


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
              onClick={() =>
                actor.send({
                  type: "REMOVE_CANVAS",
                  params: { canvasId: canvas.id },
                })
              }
              className="p-2 hover:bg-gray-200 rounded-md"
              disabled={!canRemove}
              title={
                canRemove ? "Remove Canvas" : "Cannot remove the last canvas"
              }
            >
              <Trash2
                size={18}
                className={`${canRemove ? "text-red-600" : "text-gray-400"}`}
              />
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



 */
