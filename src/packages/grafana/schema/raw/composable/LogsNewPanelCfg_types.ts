
import * as common from '@schema';

export const pluginVersion = "11.6.0-pre";

export interface Options {
  dedupStrategy: common.LogsDedupStrategy;
  enableInfiniteScrolling?: boolean;
  enableLogDetails: boolean;
  onNewLogsReceived?: unknown;
  showTime: boolean;
  sortOrder: common.LogsSortOrder;
  wrapLogMessage: boolean;
}
