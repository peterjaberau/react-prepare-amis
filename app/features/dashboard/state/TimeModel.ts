import { TimeRange, TimeZone } from '@data/index';

export interface TimeModel {
  time: any;
  fiscalYearStartMonth?: number;
  refresh?: string;
  timepicker: any;
  getTimezone(): TimeZone;
  timeRangeUpdated(timeRange: TimeRange): void;
}
