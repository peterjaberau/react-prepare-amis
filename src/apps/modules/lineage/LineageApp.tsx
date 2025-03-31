import { AppContainerRenderer } from "@/apps/modules/lineage/components/AppContainer/AppContainerRenderer.tsx";
import { PlatformLineageRenderer } from "@/apps/modules/lineage/pages/PlatformLineage/PlatformLineageRenderer.tsx";
import { PageLayoutV1Renderer } from "@/apps/modules/lineage/components/PageLayoutV1/PageLayoutV1Renderer.tsx";
import { LineageProviderRenderer } from "@/apps/modules/lineage/context/LineageProvider/LineageProviderRenderer.tsx";
import { LineageRenderer } from "@/apps/modules/lineage/components/Lineage/LineageRenderer.tsx";
import {
  CustomControlsRenderer
} from "@/apps/modules/lineage/components/Entity/EntityLineage/CustomControlsRenderer.tsx";
import {
  LineageSearchSelectRenderer
} from "@/apps/modules/lineage/components/Entity/EntityLineage/LineageSearchSelect/LineageSearchSelectRenderer.tsx";
import { ExploreQuickFiltersRenderer } from "@/apps/modules/lineage/components/Explore/ExploreQuickFiltersRenderer.tsx";

function LinearControlButtonsRenderer() {
  return null;
}

export const LineageApp = () => {
  return (
    <AppContainerRenderer>
      <PlatformLineageRenderer>
        <PageLayoutV1Renderer>
          <LineageProviderRenderer>

            {/* LineageRenderer: has ReactFlowProvider */}
            {/*<LineageRenderer>*/}
            {/*  <CustomControlsRenderer>*/}
            {/*    <LineageSearchSelectRenderer />*/}
            {/*    <ExploreQuickFiltersRenderer />*/}
            {/*  </CustomControlsRenderer>*/}
            {/*  <LinearControlButtonsRenderer />*/}
            {/*</LineageRenderer>*/}
          </LineageProviderRenderer>
        </PageLayoutV1Renderer>
      </PlatformLineageRenderer>
    </AppContainerRenderer>
  );
};

/*


    AppRouter --> skip

      AppContainer
        AuthenticatedAppRouter --> skip

          PlatformLineage
            PageLayoutV1
              LineageProvider
                Lineage

                  CustomControls
                    LineageSearchSelect
                    ExploreQuickFilters

                  LineageControlButtons
                    FullscreenOutlined
                    ZoomInOutlined
                    ZoomOutOutlined
                    ExpandOutlined
                    NodeIndexOutlined
                    SettingOutlined
                    LineageConfigModal --> added inside LineageControlButtons


                  ReactFlowProvider --> inside LineageRenderer
                    ReactFlow
                      ReactFlowWrapper
                        GraphView
                          FlowRenderer
                            ZoomPane
                              Pane
                                EdgeRenderer
                                  ConnectionLineWrapper
                                NodeRenderer

                                  NodeWrapper
                                    CustomNodeV1
                                      LineageNodeLabelV1
                                        EntityLabel
                                        NodeChildren


                                  NodeWrapper
                                    CustomNodeV1
                                      LineageNodeLabelV1
                                        EntityLabel
                                        NodeChildren

                                UserSelection
                              StoreUpdater

                              Background
                                DotPattern

                              MiniMap
                                MiniMapNodes

                              LineageLayers


                EntityLineageSidebar
                  EntityNode  (tables)
                  EntityNode  (dashboards)
                  EntityNode  (topics)
                  EntityNode  (ML models)
                  EntityNode  (containers)
                  EntityNode  (pipelines)
                  EntityNode  (search indexes)
                  EntityNode  (data models)
                  EntityNode  (API Endpoints)
                  EntityNode  (Metrics)













              EntityLineageSidebar




DashboardDataModelUtils
EntityExportModalProvider
EntityHeader
EntityHeaderTitle
EdgeInfoDrawer
AddPipeLineModal
CustomControls
CustomEdge
CustomNode.utils
CustomNodeV1
EntityLineageSidebar
EntitySuggestionOption
LineageConfigModal
LineageControlButtons
LineageLayers
LineageNodeLabelV1
LineageSearchSelect
LoadMoreNode
NodeChildren
NodeSuggestions
TestSuiteSummaryWidget
EntityList
EntityRightPanel
Lineage
LineageRemoveButton
LineageProvider

ContainerPage
LogsViewerPage
PlatformLineage
SearchIndexDetailsPage
StoredProcedurePage


 */
