import ReactFlow, {
  Background,
  MiniMap,
  Panel,
  ReactFlowProvider,
} from "reactflow";

import {
  MAX_ZOOM_VALUE,
  MIN_ZOOM_VALUE,
} from "../../constants/Lineage.constants";
import { useLineageProvider } from "../../context/LineageProvider/LineageProvider";
import {
  customEdges,
  dragHandle,
  nodeTypes,
  onNodeContextMenu,
  onNodeMouseEnter,
  onNodeMouseLeave,
  onNodeMouseMove,
} from "../../utils/EntityLineageUtils";
import Loader from "../common/Loader/Loader";
import CustomControlsRenderer from "../Entity/EntityLineage/CustomControlsRenderer";
import LinearControlButtonsRenderer from "../Entity/EntityLineage/LineageControlButtons/LinearControlButtonsRenderer";
import LineageLayers from "../Entity/EntityLineage/LineageLayers/LineageLayers";
import { SourceType } from "../SearchedData/SearchedData.interface";
import { LineageProps } from "./Lineage.interface";

import { useTranslation } from "react-i18next";
import React, {
  DragEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Card } from "antd";
import {
  LineageControlButtonsRenderer
} from "@/apps/modules/lineage/components/Entity/EntityLineage/LineageControlButtons/LineageControlButtonsRenderer.tsx";

const LineageRenderer = ({
  deleted,
  hasEditAccess,
  entity,
  entityType,
  isPlatformLineage,
}: LineageProps) => {

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const {
    nodes,
    edges,
    isEditMode,
    init,
    onNodeClick,
    onEdgeClick,
    onNodeDrop,
    onNodesChange,
    onEdgesChange,
    entityLineage,
    onPaneClick,
    onConnect,
    onInitReactFlow,
    updateEntityData,
  } = useLineageProvider();

  const queryParams = new URLSearchParams(location.search);
  const isFullScreen = queryParams.get("fullscreen") === "true";

  const onFullScreenClick = useCallback(() => {
    // history.push({
    //   search: Qs.stringify({ fullscreen: true }),
    // });
    console.log("onFullScreenClick");
  }, []);

  const onExitFullScreenViewClick = useCallback(() => {
    // history.push({
    //   search: '',
    // });
    console.log("onExitFullScreenViewClick");
  }, []);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  useEffect(() => {
    updateEntityData(entityType, entity as SourceType, isPlatformLineage);
  }, [entity, entityType, isPlatformLineage]);

  // Loading the react flow component after the nodes and edges are initialised improves performance
  // considerably. So added an init state for showing loader.
  return (
    <Card
      className="lineage-card card-body-full w-auto card-padding-0"
      data-testid="lineage-details"
    >
      <div
        className="h-full relative lineage-container"
        data-testid="lineage-container"
        ref={reactFlowWrapper}
      >
        {entityLineage && (
          <>
            <CustomControlsRenderer className="absolute top-1 right-1 p-xs" />
            <LineageControlButtonsRenderer
              deleted={deleted}
              entityType={entityType}
              handleFullScreenViewClick={
                !isFullScreen ? onFullScreenClick : undefined
              }
              hasEditAccess={hasEditAccess}
              onExitFullScreenViewClick={
                isFullScreen ? onExitFullScreenViewClick : undefined
              }
            />
          </>
        )}
        {init ? (
          <ReactFlowProvider>
            <ReactFlow
              className="custom-react-flow"
              data-testid="react-flow-component"
              deleteKeyCode={null}
              edgeTypes={customEdges}
              edges={edges}
              fitViewOptions={{
                padding: 48,
              }}
              maxZoom={MAX_ZOOM_VALUE}
              minZoom={MIN_ZOOM_VALUE}
              nodeTypes={nodeTypes}
              nodes={nodes}
              nodesConnectable={isEditMode}
              selectNodesOnDrag={false}
              onConnect={onConnect}
              onDragOver={onDragOver}
              onDrop={(_e) =>
                onNodeDrop(
                  _e,
                  reactFlowWrapper.current?.getBoundingClientRect() as DOMRect,
                )
              }
              onEdgeClick={(_e, data) => {
                onEdgeClick(data);
                _e.stopPropagation();
              }}
              onEdgesChange={onEdgesChange}
              onInit={onInitReactFlow}
              onNodeClick={(_e, node) => {
                onNodeClick(node);
                _e.stopPropagation();
              }}
              onNodeContextMenu={onNodeContextMenu}
              onNodeDrag={dragHandle}
              onNodeDragStart={dragHandle}
              onNodeDragStop={dragHandle}
              onNodeMouseEnter={onNodeMouseEnter}
              onNodeMouseLeave={onNodeMouseLeave}
              onNodeMouseMove={onNodeMouseMove}
              onNodesChange={onNodesChange}
              onPaneClick={onPaneClick}
            >
              <Background gap={12} size={1} />
              <MiniMap pannable zoomable position="bottom-right" />

              <Panel position="bottom-left">
                <LineageLayers entity={entity} entityType={entityType} />
              </Panel>
            </ReactFlow>
          </ReactFlowProvider>
        ) : (
          <div className="loading-card">
            <Loader />
          </div>
        )}
      </div>
    </Card>
  );
};
export default LineageRenderer;
