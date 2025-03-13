import { applyFieldOverrides, DataFrame, GrafanaTheme2 } from '@data/index';

export function prepDataForStorybook(data: DataFrame[], theme: GrafanaTheme2) {
  return applyFieldOverrides({
    data: data,
    fieldConfig: {
      overrides: [],
      defaults: {},
    },
    theme,
    replaceVariables: (value: string) => value,
  });
}
