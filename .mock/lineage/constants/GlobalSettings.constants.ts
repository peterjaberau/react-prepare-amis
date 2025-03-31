/*
 *  Copyright 2022 Collate.
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

export enum GlobalSettingsMenuCategory {
  ACCESS = 'access',
  NOTIFICATIONS = 'notifications',
  CUSTOM_PROPERTIES = 'customProperties',
  PREFERENCES = 'preferences',
  MEMBERS = 'members',
  SERVICES = 'services',
  BOTS = 'bots',
  APPLICATIONS = 'apps',
  PERSONA = 'persona',
  SEARCH = 'search',
}

export enum GlobalSettingOptions {
  USERS = 'users',
  ADMINS = 'admins',
  TEAMS = 'teams',
  PERSONA = 'persona',
  ROLES = 'roles',
  POLICIES = 'policies',
  DATABASES = 'databases',
  DATABASE = 'database',
  DATABASE_SCHEMA = 'databaseSchemas',
  MESSAGING = 'messaging',
  METADATA = 'metadata',
  DASHBOARDS = 'dashboards',
  PIPELINES = 'pipelines',
  MLMODELS = 'mlmodels',
  STORED_PROCEDURES = 'storedProcedures',
  WEBHOOK = 'webhook',
  SLACK = 'slack',
  BOTS = 'bots',
  TABLES = 'tables',
  MSTEAMS = 'msteams',
  ACTIVITY_FEED = 'activityFeeds',
  SEARCH = 'search',
  SEARCH_INDEXES = 'searchIndexes',
  DATA_INSIGHT = 'dataInsight',
  EMAIL = 'email',
  NOTIFICATIONS = 'notifications',
  ALERT = 'alert',
  OBSERVABILITY = 'observability',
  GLOSSARY_TERM = 'glossaryTerm',
  ADD_NOTIFICATION = 'add-notification',
  EDIT_NOTIFICATION = 'edit-notification',
  ADD_OBSERVABILITY = 'add-observability',
  STORAGES = 'storages',
  DATA_INSIGHT_REPORT_ALERT = 'dataInsightReport',
  ADD_DATA_INSIGHT_REPORT_ALERT = 'add-data-insight-report',
  EDIT_DATA_INSIGHT_REPORT_ALERT = 'edit-data-insight-report',
  LOGIN_CONFIGURATION = 'loginConfiguration',
  CUSTOMIZE_LANDING_PAGE = 'customizeLandingPage',
  TOPICS = 'topics',
  CONTAINERS = 'containers',
  APPLICATIONS = 'apps',
  OM_HEALTH = 'om-health',
  PROFILER_CONFIGURATION = 'profiler-configuration',
  APPEARANCE = 'appearance',
  DASHBOARD_DATA_MODEL = 'dashboardDataModels',
  DATA_OBSERVABILITY = 'dataObservability',
  APIS = 'apiServices',
  API_COLLECTIONS = 'apiCollections',
  API_ENDPOINTS = 'apiEndpoints',
  DATA_PRODUCT = 'dataProducts',
  METRICS = 'metrics',
  SEARCH_RBAC = 'search-rbac',
  LINEAGE_CONFIG = 'lineageConfig',
  OM_URL_CONFIG = 'om-url-config',
  SEARCH_SETTINGS = 'search-settings',
  DATA_ASSETS = 'dataAssets',
  QUERY = 'query',
  TEST_CASES = 'testCases',
  TAGS = 'tags',
  DOMAINS = 'domains',
}
