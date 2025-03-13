
import * as common from '../..';

export const pluginVersion = "11.6.0-pre";

export interface Options {
  dedupStrategy: common.LogsDedupStrategy;
  displayedFields?: Array<string>;
  enableInfiniteScrolling?: boolean;
  enableLogDetails: boolean;
  isFilterLabelActive?: unknown;
  logRowMenuIconsAfter?: unknown;
  logRowMenuIconsBefore?: unknown;
  /**
   * TODO: figure out how to define callbacks
   */
  onClickFilterLabel?: unknown;
  onClickFilterOutLabel?: unknown;
  onClickFilterOutString?: unknown;
  onClickFilterString?: unknown;
  onClickHideField?: unknown;
  onClickShowField?: unknown;
  onNewLogsReceived?: unknown;
  prettifyLogMessage: boolean;
  showCommonLabels: boolean;
  showLabels: boolean;
  showLogContextToggle: boolean;
  showTime: boolean;
  sortOrder: common.LogsSortOrder;
  wrapLogMessage: boolean;
}

export const defaultOptions: Partial<Options> = {
  displayedFields: [],
};
