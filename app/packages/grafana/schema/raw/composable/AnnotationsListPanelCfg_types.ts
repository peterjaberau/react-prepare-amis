
export const pluginVersion = "11.6.0-pre";

export interface Options {
  limit: number;
  navigateAfter: string;
  navigateBefore: string;
  navigateToPanel: boolean;
  onlyFromThisDashboard: boolean;
  onlyInTimeRange: boolean;
  showTags: boolean;
  showTime: boolean;
  showUser: boolean;
  tags: Array<string>;
}

export const defaultOptions: Partial<Options> = {
  limit: 10,
  navigateAfter: '10m',
  navigateBefore: '10m',
  navigateToPanel: true,
  onlyFromThisDashboard: false,
  onlyInTimeRange: false,
  showTags: true,
  showTime: true,
  showUser: true,
  tags: [],
};
