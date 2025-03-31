//Lineage.test.tsx
const entityLineage = {
  entity: {
    name: 'fact_sale',
    fullyQualifiedName: 'sample_data.ecommerce_db.shopify.fact_sale',
    id: '5a1947bb-84eb-40de-a5c5-2b7b80c834c3',
    type: 'table',
  },
  nodes: [
    {
      name: 'dim_location',
      fullyQualifiedName: 'sample_data.ecommerce_db.shopify.dim_location',
      id: '30e9170c-0e07-4e55-bf93-2d2dfab3a36e',
      type: 'table',
    },
    {
      name: 'dim_address_clean',
      fullyQualifiedName: 'sample_data.ecommerce_db.shopify.dim_address_clean',
      id: '6059959e-96c8-4b61-b905-fc5d88b33293',
      type: 'table',
    },
  ],
  edges: [
    {
      toEntity: {
        fullyQualifiedName: 'sample_data.ecommerce_db.shopify.dim_location',
        id: '30e9170c-0e07-4e55-bf93-2d2dfab3a36e',
        type: 'table',
      },
      fromEntity: {
        fullyQualifiedName: 'sample_data.ecommerce_db.shopify.fact_sale',
        id: '5a1947bb-84eb-40de-a5c5-2b7b80c834c3',
        type: 'table',
      },
      sqlQuery: '',
      source: 'Manual',
    },
    {
      toEntity: {
        fullyQualifiedName: 'mlflow_svc.eta_predictions',
        id: 'b81f6bad-42f3-4216-8505-cf6f0c0a8897',
        type: 'mlmodel',
      },
      fromEntity: {
        fullyQualifiedName: 'sample_data.ecommerce_db.shopify.fact_sale',
        id: '5a1947bb-84eb-40de-a5c5-2b7b80c834c3',
        type: 'table',
      },
    },
    {
      toEntity: {
        fullyQualifiedName: 'sample_data.ecommerce_db.shopify.fact_sale',
        id: '5a1947bb-84eb-40de-a5c5-2b7b80c834c3',
        type: 'table',
      },
      fromEntity: {
        fullyQualifiedName: 'sample_data.ecommerce_db.shopify.dim_address_clean',
        id: '6059959e-96c8-4b61-b905-fc5d88b33293',
        type: 'table',
      },
      sqlQuery: '',
      source: 'Manual',
    },
  ],
};

const CustomEdge = {
  id: 'id1',
  sourceX: 20,
  sourceY: 20,
  targetX: 20,
  targetY: 20,
  sourcePosition: 'left',
  targetPosition: 'right',
  style: {},
  markerEnd: '',
  data: {
    source: 'node1',
    target: 'node2',
    sourceType: 'table',
    targetType: 'dashboard',
    onEdgeClick: {},
    isColumnLineage: false,
    selectedNode: {
      id: 'node1',
    },
    edge: {
      fromEntity: {
        id: '1',
        fullyQualifiedName: 'table1',
        type: 'table',
      },
      toEntity: {
        id: '2',
        fullyQualifiedName: 'table2',
        type: 'table',
      },
      pipeline: {
        id: 'pipeline1',
        fullyQualifiedName: 'pipeline1',
        type: 'pipeline',
        name: 'pipeline1',
      },
    },
    isEditMode: true,
  },
  selected: true,
};

const CustomNodeV1_NodeDataProps = {
  id: 'node1',
  type: 'table',
  data: {
    node: {
      fullyQualifiedName: 'dim_customer',
      type: 'table',
      entityType: 'table',
      id: 'khjahjfja',
      columns: [
        { fullyQualifiedName: 'col1', name: 'col1' },
        { fullyQualifiedName: 'col2', name: 'col2' },
        { fullyQualifiedName: 'col3', name: 'col3' },
      ],
    },
  },
  selected: false,
  isConnectable: false,
  xPos: 0,
  yPos: 0,
  dragging: true,
  zIndex: 0,
};

const CustomNodeV1_NodeDataProps2 = {
  id: 'node1',
  type: 'table',
  data: {
    node: {
      fullyQualifiedName: 'dim_customer',
      type: 'table',
      entityType: 'table',
      id: 'khjahjfja',
      columns: [
        { fullyQualifiedName: 'col1', name: 'col1' },
        { fullyQualifiedName: 'col2', name: 'col2' },
        { fullyQualifiedName: 'col3', name: 'col3' },
      ],
      dataModel: {
        modelType: 'DBT',
      },
    },
  },
  selected: false,
  isConnectable: false,
  xPos: 0,
  yPos: 0,
  dragging: true,
  zIndex: 0,
};

//LineageLayers.test.tsx
const LineageLayers_NodeDataProps = {
  id: 'node1',
  type: 'table',
  data: {
    node: {
      fullyQualifiedName: 'dim_customer',
      type: 'table',
      entityType: 'table',
      id: 'khjahjfja',
      columns: [
        { fullyQualifiedName: 'col1', name: 'col1' },
        { fullyQualifiedName: 'col2', name: 'col2' },
        { fullyQualifiedName: 'col3', name: 'col3' },
      ],
    },
  },
  selected: false,
  isConnectable: false,
  xPos: 0,
  yPos: 0,
  dragging: true,
  zIndex: 0,
};

const LineageSearchSelect = [
  {
    data: {
      node: {
        fullyQualifiedName: 'test1',
        entityType: EntityType.TABLE,
        columns: [{ fullyQualifiedName: 'column1' }, { fullyQualifiedName: 'column2' }],
      },
    },
  },
  { data: { node: { fullyQualifiedName: 'test2' } } },
  { data: { node: { fullyQualifiedName: 'test3' } } },
];

const CommonEntitySummaryInfo = {
  entityInfo: [
    {
      name: 'label.owner-plural',
      value: 'No Owner',
      url: '',
      isLink: false,
      visible: ['Lineage'],
    },
    {
      name: 'Type',
      value: 'Regular',
      isLink: false,
      visible: ['Lineage', 'Explore'],
    },
    {
      name: 'Service',
      value: 'sample_airflow',
      url: '/service/databaseServices/sample_airflow',
      isLink: true,
      visible: ['Lineage'],
    },
    {
      name: 'Tier',
      value: '-',
      isLink: false,
      visible: ['Lineage'],
    },
    {
      name: 'Usage',
      value: '-',
      isLink: false,
      visible: ['Lineage'],
    },
    {
      name: 'Columns',
      value: '-',
      isLink: false,
      visible: ['Lineage', 'Explore'],
    },
    {
      name: 'Pipeline URL',
      dataTestId: 'pipeline-url-label',
      value: 'Presto ETL',
      url: 'http://localhost:8080/tree?dag_id=presto_etl',
      isLink: true,
      isExternal: true,
      visible: ['Lineage', 'Explore'],
    },
  ],
  componentType: 'Explore',
};

const pipelineTasks = [
  {
    name: 'snowflake_task',
    displayName: 'Snowflake Task',
    description: 'Airflow operator to perform ETL on snowflake tables',
    sourceUrl: 'http://localhost:8080/taskinstance/list/?flt1_dag_id_equals=assert_table_exists',
    downstreamTasks: ['assert_table_exists'],
    taskType: 'SnowflakeOperator',
  },
  {
    name: 'assert_table_exists',
    displayName: 'Assert Table Exists',
    description: 'Assert if a table exists',
    sourceUrl: 'http://localhost:8080/taskinstance/list/?flt1_dag_id_equals=assert_table_exists',
    downstreamTasks: [],
    taskType: 'HiveOperator',
  },
];

const taskDAG = [
  {
    name: 'task1',
  },
  {
    name: 'task2',
  },
];

const taskDAGNodes = [
  {
    className: 'leaf-node Success',
    data: { label: 'Task 1' },
    id: 'task1',
    position: { x: 0, y: 0 },
    sourcePosition: 'right',
    targetPosition: 'left',
    type: 'input',
  },
  {
    className: 'leaf-node Failed',
    data: { label: 'Task 2' },
    id: 'task2',
    position: { x: 450, y: 0 },
    sourcePosition: 'right',
    targetPosition: 'left',
    type: 'output',
  },
];

const taskDAGEdges = [
  {
    id: 'task1-task2',
    markerEnd: {
      type: 'arrowclosed',
    },
    source: 'task1',
    target: 'task2',
    type: 'custom',
  },
];
