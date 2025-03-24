import * as grafanaData from '@data/index';
import * as grafanaRuntime from '@runtime/index';
import * as grafanaUIraw from '@grafana-ui/index';
import TableModel from '~/core/TableModel';
import config from '~/core/config';
import { appEvents, contextSrv } from '~/core/core';
import { BackendSrv, getBackendSrv } from '~/core/services/backend_srv';
import impressionSrv from '~/core/services/impression_srv';
import TimeSeries from '~/core/time_series2';
import { arrayMove } from '~/core/utils/arrayMove';
import * as flatten from '~/core/utils/flatten';
import kbn from '~/core/utils/kbn';
import * as ticks from '~/core/utils/ticks';

// Help the 6.4 to 6.5 migration
// The base classes were moved from @grafana/ui to @grafana/data
// This exposes the same classes on both import paths
const grafanaUI: Record<string, unknown> = { ...grafanaUIraw };
// const grafanaUI: Record<string, unknown> = grafanaUIraw;
grafanaUI.PanelPlugin = grafanaData.PanelPlugin;
grafanaUI.DataSourcePlugin = grafanaData.DataSourcePlugin;
grafanaUI.AppPlugin = grafanaData.AppPlugin;
grafanaUI.DataSourceApi = grafanaData.DataSourceApi;

// const jQueryFlotDeps = [
//   'jquery.flot.crosshair',
//   'jquery.flot.events',
//   'jquery.flot.fillbelow',
//   'jquery.flot.gauge',
//   'jquery.flot.pie',
//   'jquery.flot.selection',
//   'jquery.flot.stack',
//   'jquery.flot.stackpercent',
//   'jquery.flot.time',
//   'jquery.flot',
// ].reduce((acc, flotDep) => ({ ...acc, [flotDep]: { fakeDep: 1 } }), {});

export const sharedDependenciesMap = {
  '@emotion/css': () => import('@emotion/css'),
  '@emotion/react': () => import('@emotion/react'),
  '@data/index': grafanaData,
  '@runtime/index': grafanaRuntime,
  '@grafana/slate-react': () => import('slate-react'),
  '@grafana-ui/index': grafanaUI,
  '@kusto/monaco-kusto': () => import('@kusto/monaco-kusto'),
  '~/core/app_events': {
    default: appEvents,
    __useDefault: true,
  },
  '~/core/config': {
    default: config,
    __useDefault: true,
  },
  '~/core/core': {
    appEvents: appEvents,
    contextSrv: contextSrv,
  },
  '~/core/services/backend_srv': {
    BackendSrv,
    getBackendSrv,
  },
  '~/core/table_model': { default: TableModel, __useDefault: true },
  '~/core/time_series': { default: TimeSeries, __useDefault: true },
  '~/core/time_series2': { default: TimeSeries, __useDefault: true },
  '~/core/utils/datemath': grafanaData.dateMath,
  '~/core/utils/flatten': flatten,
  '~/core/utils/kbn': {
    default: kbn,
    __useDefault: true,
  },
  '~/core/utils/ticks': ticks,
  '~/features/dashboard/impression_store': {
    impressions: impressionSrv,
  },
  d3: () => import('d3'),
  emotion: () => import('@emotion/css'),
  // bundling grafana-ui in plugins requires sharing i18next state
  i18next: () => import('i18next'),
  // jquery: {
  //   default: jquery,
  //   __useDefault: true,
  // },
  // ...jQueryFlotDeps,
  // add move to lodash for backward compatabilty with plugins
  lodash: () => import('lodash-es').then((module) => ({ ...module, move: arrayMove, __useDefault: true })),
  moment: () => import('moment').then((module) => ({ ...module, __useDefault: true })),
  prismjs: () => import('prismjs'),
  react: () => import('react'),
  'react-dom': () => import('react-dom'),
  // bundling grafana-ui in plugins requires sharing react-inlinesvg for the icon cache
  'react-inlinesvg': () => import('react-inlinesvg'),
  'react-redux': () => import('react-redux'),
  // Migration - React Router v5 -> v6
  // =================================
  // Plugins that still use "react-router@v5" don't depend on react-router directly, so they will not use this import.
  // (The react-router@v5 that we expose for them depends on the "react-router" package internally from core.)
  //
  // Plugins that would like update to "react-router@v6" will need to bundle "react-router",
  // however they cannot bundle "react-router" - this would mean that we have two instances of "react-router"
  // in the app, which would casue issues. As the "react-router" package re-exports everything from "react-router@v6"
  // which then re-exports everything from "react-router@v6", we are in the lucky state to be able to expose a compatible v6 version of the router to plugins by
  // just exposing "react-router".
  //
  // (This means that we are exposing two versions of the same package).
  'react-router': () => import('react-router'),
  'react-router': () => import('react-router'),
  redux: () => import('redux'),
  rxjs: () => import('rxjs'),
  'rxjs/operators': () => import('rxjs/operators'),
  slate: () => import('slate'),
  'slate-plain-serializer': () => import('slate-plain-serializer'),
  'slate-react': () => import('slate-react'),
};
