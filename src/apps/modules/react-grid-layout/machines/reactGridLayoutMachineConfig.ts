import { v4 as uuidv4 } from 'uuid';

export const initialContext = {
  selected: {
    exampleId: ""
  },
  canvases: [],
  specs: {
    events: [
      {
        type: "ADD_CANVAS",
      },
      {
        type: "RENAME_CANVAS",
        canvasId: "",
        newName: "",
      },
      {
        type: "REMOVE_CANVAS",
        canvasId: "",
      },
      {
        type: "UPDATE_CANVAS",
        canvas: {},
      },
      {
        type: "MOVE_WIDGET_TO_CANVAS",
        widgetId: "",
        sourceCanvasId: "",
        targetCanvasId: "",
      },
      {
        type: "OPEN_WIDGET_POPOVER",
        position: { x: 0, y: 0 },
      },
      {
        type: "CLOSE_WIDGET_POPOVER",
      },
      {
        type: "CREATE_WIDGET",
        title: "",
        targetCanvasId: "",
      },
      {
        type: "TOGGLE_GLOBAL_JSON_MODAL",
      },
      {
        type: "TOGGLE_LOAD_FROM_MENU",
      },
      {
        type: "LOAD_EXAMPLE",
        example: ["analytics", "project", "personal"],
      },
      {
        type: "NEW_SESSION",
      },
    ]
  },
  presets: {
    emptyCanvas: {
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
  },
  result: {
    totalWidgets: 0,
    summary: {
      canvasCount: 0,
      canvasNames: [],
      widgetsByCanvas: {}
    },
  },
  data: [
    {
      id: 'analytics',
      name: 'Analytics Dashboard',
      description: 'Data visualization with metrics and charts',
      data: [
        {
          id: uuidv4(),
          name: 'Overview',
          widgets: [
            {
              i: uuidv4(),
              x: 0,
              y: 0,
              w: 6,
              h: 4,
              name: 'Daily Active Users',
              content: 'Chart: Daily Active Users',
              canvasId: '1'
            },
            {
              i: uuidv4(),
              x: 6,
              y: 0,
              w: 6,
              h: 4,
              name: 'Revenue',
              content: 'Chart: Revenue',
              canvasId: '1'
            },
            {
              i: uuidv4(),
              x: 0,
              y: 4,
              w: 4,
              h: 4,
              name: 'Conversion Rate',
              content: 'Metric: Conversion Rate',
              canvasId: '1'
            },
            {
              i: uuidv4(),
              x: 4,
              y: 4,
              w: 8,
              h: 4,
              name: 'User Retention',
              content: 'Chart: User Retention',
              canvasId: '1'
            }
          ],
          config: {
            cols: 12,
            rowHeight: 100,
            isBounded: true,
            maxRows: 12,
            preventCollision: false,
            allowOverlap: false,
            compactType: 'vertical',
            margin: [10, 10]
          }
        },
        {
          id: uuidv4(),
          name: 'User Metrics',
          widgets: [
            {
              i: uuidv4(),
              x: 0,
              y: 0,
              w: 12,
              h: 4,
              name: 'User Growth',
              content: 'Chart: User Growth Over Time',
              canvasId: '2'
            },
            {
              i: uuidv4(),
              x: 0,
              y: 4,
              w: 6,
              h: 4,
              name: 'Demographics',
              content: 'Chart: User Demographics',
              canvasId: '2'
            },
            {
              i: uuidv4(),
              x: 6,
              y: 4,
              w: 6,
              h: 4,
              name: 'Geographical Distribution',
              content: 'Map: User Locations',
              canvasId: '2'
            }
          ],
          config: {
            cols: 12,
            rowHeight: 100,
            isBounded: true,
            maxRows: 12,
            preventCollision: false,
            allowOverlap: false,
            compactType: 'vertical',
            margin: [10, 10]
          }
        }
      ],
      canvasCount: 0,
      widgetCount: 0
    },
    {
      id: 'project',
      name: 'Project Management',
      description: 'Task tracking and project overview',
      data: [
        {
          id: uuidv4(),
          name: 'Project Overview',
          widgets: [
            {
              i: uuidv4(),
              x: 0,
              y: 0,
              w: 4,
              h: 4,
              name: 'Project Status',
              content: 'Status: In Progress',
              canvasId: '1'
            },
            {
              i: uuidv4(),
              x: 4,
              y: 0,
              w: 8,
              h: 4,
              name: 'Timeline',
              content: 'Gantt Chart: Project Timeline',
              canvasId: '1'
            },
            {
              i: uuidv4(),
              x: 0,
              y: 4,
              w: 6,
              h: 6,
              name: 'Task Distribution',
              content: 'Chart: Tasks by Assignee',
              canvasId: '1'
            },
            {
              i: uuidv4(),
              x: 6,
              y: 4,
              w: 6,
              h: 6,
              name: 'Recent Activity',
              content: 'Feed: Recent Updates',
              canvasId: '1'
            }
          ],
          config: {
            cols: 12,
            rowHeight: 80,
            isBounded: false,
            maxRows: 15,
            preventCollision: true,
            allowOverlap: false,
            compactType: 'vertical',
            margin: [15, 15]
          }
        },
        {
          id: uuidv4(),
          name: 'Resources',
          widgets: [
            {
              i: uuidv4(),
              x: 0,
              y: 0,
              w: 12,
              h: 3,
              name: 'Team Members',
              content: 'List: Team Members and Roles',
              canvasId: '2'
            },
            {
              i: uuidv4(),
              x: 0,
              y: 3,
              w: 6,
              h: 5,
              name: 'Budget Allocation',
              content: 'Chart: Budget Breakdown',
              canvasId: '2'
            },
            {
              i: uuidv4(),
              x: 6,
              y: 3,
              w: 6,
              h: 5,
              name: 'Resource Utilization',
              content: 'Chart: Resource Usage',
              canvasId: '2'
            }
          ],
          config: {
            cols: 12,
            rowHeight: 80,
            isBounded: false,
            maxRows: 15,
            preventCollision: true,
            allowOverlap: false,
            compactType: 'vertical',
            margin: [15, 15]
          }
        },
        {
          id: uuidv4(),
          name: 'Tasks',
          widgets: [
            {
              i: uuidv4(),
              x: 0,
              y: 0,
              w: 4,
              h: 8,
              name: 'To Do',
              content: 'List: Pending Tasks',
              canvasId: '3'
            },
            {
              i: uuidv4(),
              x: 4,
              y: 0,
              w: 4,
              h: 8,
              name: 'In Progress',
              content: 'List: Tasks in Progress',
              canvasId: '3'
            },
            {
              i: uuidv4(),
              x: 8,
              y: 0,
              w: 4,
              h: 8,
              name: 'Completed',
              content: 'List: Completed Tasks',
              canvasId: '3'
            }
          ],
          config: {
            cols: 12,
            rowHeight: 80,
            isBounded: false,
            maxRows: 15,
            preventCollision: true,
            allowOverlap: false,
            compactType: 'vertical',
            margin: [15, 15]
          }
        }
      ],
      canvasCount: 0,
      widgetCount: 0
    },
    {
      id: 'personal',
      name: 'Personal Dashboard',
      description: 'Daily overview and personal metrics',
      data: [
        {
          id: uuidv4(),
          name: 'Daily Overview',
          widgets: [
            {
              i: uuidv4(),
              x: 0,
              y: 0,
              w: 4,
              h: 3,
              name: 'Weather',
              content: 'Widget: Current Weather',
              canvasId: '1'
            },
            {
              i: uuidv4(),
              x: 4,
              y: 0,
              w: 8,
              h: 3,
              name: 'Calendar',
              content: 'Widget: Today\'s Events',
              canvasId: '1'
            },
            {
              i: uuidv4(),
              x: 0,
              y: 3,
              w: 6,
              h: 4,
              name: 'Tasks',
              content: 'List: Today\'s Tasks',
              canvasId: '1'
            },
            {
              i: uuidv4(),
              x: 6,
              y: 3,
              w: 6,
              h: 4,
              name: 'Notes',
              content: 'Widget: Quick Notes',
              canvasId: '1'
            }
          ],
          config: {
            cols: 12,
            rowHeight: 90,
            isBounded: true,
            maxRows: 10,
            preventCollision: false,
            allowOverlap: false,
            compactType: 'vertical',
            margin: [10, 10]
          }
        },
        {
          id: uuidv4(),
          name: 'Health & Fitness',
          widgets: [
            {
              i: uuidv4(),
              x: 0,
              y: 0,
              w: 6,
              h: 4,
              name: 'Step Counter',
              content: 'Widget: Daily Steps',
              canvasId: '2'
            },
            {
              i: uuidv4(),
              x: 6,
              y: 0,
              w: 6,
              h: 4,
              name: 'Water Intake',
              content: 'Widget: Water Consumption',
              canvasId: '2'
            },
            {
              i: uuidv4(),
              x: 0,
              y: 4,
              w: 12,
              h: 4,
              name: 'Workout Plan',
              content: 'Widget: Weekly Workout Schedule',
              canvasId: '2'
            }
          ],
          config: {
            cols: 12,
            rowHeight: 90,
            isBounded: true,
            maxRows: 10,
            preventCollision: false,
            allowOverlap: false,
            compactType: 'vertical',
            margin: [10, 10]
          }
        }
      ],
      canvasCount: 0,
      widgetCount: 0
    }
  ],
  components: {
    ReactGridLayoutApp: {
      isWidgetPopoverOpen: false,
      widgetPopoverPosition: { x: 0, y: 0 },
      isGlobalJSONModalOpen: false,
      isLoadFromMenuOpen: false,
    }
  }
}
