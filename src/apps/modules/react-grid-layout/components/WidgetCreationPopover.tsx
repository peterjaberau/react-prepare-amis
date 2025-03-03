import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Canvas } from "../types";
import { useReactGridLayoutMachine } from "@/apps/modules/react-grid-layout/machines/reactGridLayoutMachineStore.ts";
import {
  EuiButton,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFieldNumber,
  EuiComboBox,
  EuiSpacer,
  EuiButtonEmpty,
} from "@elastic/eui";

const formStateInit = {
  title: "",
  selectedCanvases: [],
}

const WidgetCreationPopover: React.FC<any> = () => {
  const { state, actor } = useReactGridLayoutMachine();

  const [canvasOptions, setCanvasOptions] = useState<any>(
    state.context.canvases.map((canvas: any) => ({
      label: canvas.name,
      value: canvas.id,
    })),
  );

  const [formState, setFormState] = useState({
    title: "",
    selectedCanvases: [],
  });

  useEffect(() => {
    console.log("formState", formState);
  }, [formState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actor.send({
      type: "CREATE_WIDGET",
      params: {
        title: formState.title,
        targetCanvasId: (formState.selectedCanvases[0] as any).value,
      },
    });

    handleClose();


  };

  const handleClose = () => {
    //e.preventDefault();
    setFormState(formStateInit);
    actor.send({ type: "CLOSE_WIDGET_POPOVER" });
  }

  return (
    <>
      <EuiForm component="form">
        <EuiFormRow label="Title" display={"columnCompressed"}>
          <EuiFieldText
            placeholder="Enter widget title"
            compressed={true}
            fullWidth={true}
            onChange={(e) =>
              setFormState({ ...formState, title: e.target.value })
            }
            value={formState.title}
          />
        </EuiFormRow>
        <EuiFormRow label="Canvas" display={"columnCompressed"}>
          <EuiComboBox
            isClearable={false}
            singleSelection={{ asPlainText: true }}
            compressed={true}
            options={canvasOptions}
            selectedOptions={formState.selectedCanvases}
            onChange={(comboBoxSelectionOptions: any) => {
              if (comboBoxSelectionOptions.length > 0) {
                setFormState({
                  ...formState,
                  selectedCanvases: comboBoxSelectionOptions,
                });
              }
            }}
          />
        </EuiFormRow>
        <EuiSpacer />
        <EuiFlexGroup component="span">
          <EuiFlexItem component="span">
            <EuiButtonEmpty onClick={handleClose} size={"s"}>Cancel</EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem component="span">
            <EuiButton
              disabled={formState.selectedCanvases.length <= 0}
              type={"button"}
              onClick={handleSubmit}
              size={"s"}
            >
              Save
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiForm>

      {/*<form onSubmit={handleSubmit} className="p-4">*/}
      {/*  <div className="mb-4">*/}
      {/*    <label*/}
      {/*      htmlFor="widgetTitle"*/}
      {/*      className="block text-sm font-medium text-gray-700 mb-1"*/}
      {/*    >*/}
      {/*      Widget Title*/}
      {/*    </label>*/}
      {/*    <input*/}
      {/*      type="text"*/}
      {/*      id="widgetTitle"*/}
      {/*      value={widgetTitle}*/}
      {/*      onChange={(e) => setWidgetTitle(e.target.value)}*/}
      {/*      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
      {/*      placeholder="Enter widget title"*/}
      {/*      autoFocus*/}
      {/*    />*/}
      {/*  </div>*/}

      {/*  <div className="mb-6">*/}
      {/*    <label*/}
      {/*      htmlFor="targetCanvas"*/}
      {/*      className="block text-sm font-medium text-gray-700 mb-1"*/}
      {/*    >*/}
      {/*      Target Canvas*/}
      {/*    </label>*/}
      {/*    <select*/}
      {/*      id="targetCanvas"*/}
      {/*      value={selectedCanvasId}*/}
      {/*      onChange={(e) => setSelectedCanvasId(e.target.value)}*/}
      {/*      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
      {/*    >*/}
      {/*      {state.context.canvases.map((canvas: any) => (*/}
      {/*        <option key={canvas.id} value={canvas.id}>*/}
      {/*          {canvas.name}*/}
      {/*        </option>*/}
      {/*      ))}*/}
      {/*    </select>*/}
      {/*  </div>*/}

      {/*  <div className="flex justify-end space-x-2">*/}
      {/*    <button*/}
      {/*      type="button"*/}
      {/*      onClick={() => actor.send({ type: "CLOSE_WIDGET_POPOVER" })}*/}
      {/*      className="px-4 py-2 border rounded-md hover:bg-gray-100"*/}
      {/*    >*/}
      {/*      Cancel*/}
      {/*    </button>*/}
      {/*    <button*/}
      {/*      type="submit"*/}
      {/*      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"*/}
      {/*      // disabled={!widgetTitle.trim() || !selectedCanvasId}*/}
      {/*    >*/}
      {/*      Create*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*</form>*/}
    </>
  );
};

export default WidgetCreationPopover;
