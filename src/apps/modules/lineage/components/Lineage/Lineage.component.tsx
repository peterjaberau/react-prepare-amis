/*
 *  Copyright 2023 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import { Card } from 'antd';
import Qs from 'qs';
import React, {
  DragEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import ReactFlow, {
  Background,
  MiniMap,
  Panel,
  ReactFlowProvider,
} from 'reactflow';
import {
  MAX_ZOOM_VALUE,
  MIN_ZOOM_VALUE,
} from '../../constants/Lineage.constants';
import { useLineageProvider } from '../../context/LineageProvider/LineageProvider';
import useCustomLocation from '../../hooks/useCustomLocation/useCustomLocation';
import {
  customEdges,
  dragHandle,
  nodeTypes,
  onNodeContextMenu,
  onNodeMouseEnter,
  onNodeMouseLeave,
  onNodeMouseMove,
} from '../../utils/EntityLineageUtils';
import { getEntityBreadcrumbs } from '../../utils/EntityUtils';
import Loader from '../common/Loader/Loader';
import TitleBreadcrumb from '../common/TitleBreadcrumb/TitleBreadcrumb.component';
import CustomControlsComponent from '../Entity/EntityLineage/CustomControls.component';
import LineageControlButtons from '../Entity/EntityLineage/LineageControlButtons/LineageControlButtons';
import LineageLayers from '../Entity/EntityLineage/LineageLayers/LineageLayers';
import { SourceType } from '../SearchedData/SearchedData.interface';
import { LineageProps } from './Lineage.interface';

const Lineage = ({
  deleted,
  hasEditAccess,
  entity,
  entityType,
  isPlatformLineage,
}: LineageProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const location = useCustomLocation();
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
  const isFullScreen = queryParams.get('fullscreen') === 'true';

  const onFullScreenClick = useCallback(() => {
    history.push({
      search: Qs.stringify({ fullscreen: true }),
    });
  }, []);

  const onExitFullScreenViewClick = useCallback(() => {
    history.push({
      search: '',
    });
  }, []);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const breadcrumbs = useMemo(
    () =>
      entity
        ? [
            ...getEntityBreadcrumbs(entity, entityType),
            {
              name: t('label.lineage'),
              url: '',
              activeTitle: true,
            },
          ]
        : [],
    [entity]
  );

  useEffect(() => {
    updateEntityData(entityType, entity as SourceType, isPlatformLineage);
  }, [entity, entityType, isPlatformLineage]);

  // Loading the react flow component after the nodes and edges are initialised improves performance
  // considerably. So added an init state for showing loader.
  return (
    <Card
      onContextMenu={(e) =>
        window.updatePopupContent(
          {
            data: { component: 'Lineage' },
            logs: {},
          },
          e.target
        )
      }
      style={{ border: '2px solid black' }}
      className="lineage-card card-body-full w-auto card-padding-0"
      data-testid="lineage-details">
      {isFullScreen && breadcrumbs.length > 0 && (
        <>
          <TitleBreadcrumb className="p-md" titleLinks={breadcrumbs} />
        </>
      )}
      <div
        className="h-full relative lineage-container"
        data-testid="lineage-container"
        ref={reactFlowWrapper}>
        {entityLineage && (
          <>
            <CustomControlsComponent className="absolute top-1 right-1 p-xs" />
            <LineageControlButtons
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
                  reactFlowWrapper.current?.getBoundingClientRect() as DOMRect
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
              onPaneClick={onPaneClick}>
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

export default Lineage;
