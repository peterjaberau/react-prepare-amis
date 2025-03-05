export const DiagramHandlerNames = [
  "onBurgerMenuClick",
  "onNavigateTo",
  "onOpenSource",
  "onCanvasClick",
  "onCanvasContextMenu",
  "onEdgeClick",
  "onEdgeContextMenu",
  "onNodeClick",
  "onNodeContextMenu",
  "onChange",
  "onCanvasDblClick",
] as const;


export const DiagramFeatureNames = [
  'Controls',
  'ReadOnly',
  'FocusMode',
  'NavigateTo',
  'ElementDetails',
  'RelationshipDetails',
  'RelationshipBrowser',
  'Search',
  'NavigationButtons',
  'Notations',
  'DynamicViewWalkthrough',
  'EdgeEditing',
  'ViewTitle',
  'FitView',
  /**
   * LikeC4Model is available in context
   */
  'LikeC4Model',
  /**
   * Running in VSCode
   */
  'Vscode',
] as const
