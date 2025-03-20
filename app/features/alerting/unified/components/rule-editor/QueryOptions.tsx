import { css } from "@emotion/css";
import { useState } from "react";

import {
  GrafanaTheme2,
  RelativeTimeRange,
  dateTime,
  getDefaultRelativeTimeRange,
} from "@data/index";
import { relativeToTimeRange } from "@data/datetime/rangeutil";
import {
  Icon,
  InlineField,
  RelativeTimeRangePicker,
  Toggletip,
  clearButtonStyles,
  useStyles2,
} from "@grafana-ui/index";
import { AlertQuery } from "@grafana-module/app/types/unified-alerting-dto";

import {
  AlertQueryOptions,
  MaxDataPointsOption,
  MinIntervalOption,
} from "./QueryWrapper";

export interface QueryOptionsProps {
  query: AlertQuery;
  queryOptions: AlertQueryOptions;
  onChangeTimeRange?: (timeRange: RelativeTimeRange, index: number) => void;
  onChangeQueryOptions: (options: AlertQueryOptions, index: number) => void;
  index: number;
}

export const QueryOptions = ({
  query,
  queryOptions,
  onChangeTimeRange,
  onChangeQueryOptions,
  index,
}: QueryOptionsProps) => {
  const styles: any = useStyles2(getStyles);

  const [showOptions, setShowOptions] = useState(false);

  const timeRange = query.relativeTimeRange
    ? relativeToTimeRange(query.relativeTimeRange)
    : undefined;

  return (
    <>
      <Toggletip
        content={
          <div className={styles.queryOptions}>
            {onChangeTimeRange && (
              <InlineField label="Time Range">
                <RelativeTimeRangePicker
                  timeRange={
                    query.relativeTimeRange ?? getDefaultRelativeTimeRange()
                  }
                  onChange={(range) => onChangeTimeRange(range, index)}
                />
              </InlineField>
            )}
            <MaxDataPointsOption
              options={queryOptions}
              onChange={(options) => onChangeQueryOptions(options, index)}
            />
            <MinIntervalOption
              options={queryOptions}
              onChange={(options) => onChangeQueryOptions(options, index)}
            />
          </div>
        }
        closeButton={true}
        placement="bottom-start"
      >
        <button
          type="button"
          className={styles.actionLink}
          onClick={() => setShowOptions(!showOptions)}
        >
          Options{" "}
          {showOptions ? (
            <Icon name="angle-right" />
          ) : (
            <Icon name="angle-down" />
          )}
        </button>
      </Toggletip>

      <div className={styles.staticValues}>
        <span>{dateTime(timeRange?.from).locale("en").fromNow(true)}</span>
        {queryOptions.maxDataPoints && (
          <span>, MD = {queryOptions.maxDataPoints}</span>
        )}
        {queryOptions.minInterval && (
          <span>, Min. Interval = {queryOptions.minInterval}</span>
        )}
      </div>
    </>
  );
};

const getStyles: any = (theme: GrafanaTheme2 | any): any => {
  const clearButton = clearButtonStyles(theme);


  return {
    queryOptions: css({
      "> div": {
        justifyContent: "space-between",
      },
    }),

    staticValues: css({
      color: theme.colors.text.secondary,
      marginRight: theme.spacing(1),
    }),

    // @ts-ignore
    actionLink: css(clearButton, {
      color: theme.colors.text.link,
      cursor: "pointer",
      "&:hover": { textDecoration: "underline" },
    }),
  } as any;
};
