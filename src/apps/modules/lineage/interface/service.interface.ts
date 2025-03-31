
import { ServicesUpdateRequest } from 'Models';
import { FormSubmitType } from '../enums/form.enum';
import { ServiceCategory } from '../enums/service.enum';
import {
  Pipeline,
  PipelineType,
} from '../generated/api/services/ingestionPipelines/createIngestionPipeline';
import { APIService } from '../generated/entity/services/apiService';
import {
  DashboardConnection,
  DashboardService,
} from '../generated/entity/services/dashboardService';
import { DatabaseService } from '../generated/entity/services/databaseService';
import {
  MessagingConnection,
  MessagingService,
} from '../generated/entity/services/messagingService';
import {
  MetadataConnection,
  MetadataService,
} from '../generated/entity/services/metadataService';
import {
  MlModelConnection,
  MlmodelService,
} from '../generated/entity/services/mlmodelService';
import {
  PipelineConnection,
  PipelineService,
} from '../generated/entity/services/pipelineService';
import {
  SearchConnection,
  SearchService,
} from '../generated/entity/services/searchService';
import {
  StorageConnection,
  StorageService,
} from '../generated/entity/services/storageService';
import { Paging } from '../generated/type/paging';

export interface IngestionSchedule {
  repeatFrequency: string;
  startDate: string;
}

export interface DatabaseConnection {
  hostPort: string;
  password: string;
  username: string;
  database: string;
  connectionArguments: Record<string, string>;
  connectionOptions: Record<string, string>;
}

export interface DataObj {
  id?: string;
  description: string | undefined;
  ingestionSchedule?: IngestionSchedule;
  name: string;
  serviceType: string;
  databaseConnection?: DatabaseConnection;
  brokers?: Array<string>;
  schemaRegistry?: string;
  username?: string;
  password?: string;
  url?: string;
  api_key?: string;
  site_name?: string;
  api_version?: string;
  server?: string;
  env?: string;
  sourceUrl?: string;
}

export type DomainSupportedServiceTypes =
  | DatabaseService
  | MessagingService
  | DashboardService
  | PipelineService
  | MlmodelService
  | StorageService;

export type ServicesType =
  | DatabaseService
  | MessagingService
  | DashboardService
  | PipelineService
  | MlmodelService
  | MetadataService
  | StorageService
  | SearchService
  | APIService;

export interface ServiceResponse {
  data: Array<ServicesType>;
  paging: Paging;
}

export type ConfigData =
  | DatabaseConnection
  | MessagingConnection
  | DashboardConnection
  | PipelineConnection
  | MlModelConnection
  | MetadataConnection
  | StorageConnection
  | SearchConnection;

export type IngestionWorkflowData = Pipeline & {
  name: string;
  enableDebugLog?: boolean;
  displayName?: string;
};

export interface IngestionWorkflowFormProps {
  pipeLineType: PipelineType;
  serviceCategory: ServiceCategory;
  workflowData: IngestionWorkflowData;
  operationType: FormSubmitType;
  cancelText?: string;
  okText?: string;
  className?: string;
  onCancel: () => void;
  onFocus: (fieldId: string) => void;
  onSubmit: (data: IngestionWorkflowData) => void;
  onChange?: (data: IngestionWorkflowData) => void;
  serviceData?: ServicesUpdateRequest;
}

export type ExtraInfoType = {
  name: string;
  description?: string;
  href?: string;
  location?: string;
  type?: string;
};
