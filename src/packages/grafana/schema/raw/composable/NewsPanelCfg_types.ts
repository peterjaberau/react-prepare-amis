
export const pluginVersion = "11.6.0-pre";

export interface Options {
  /**
   * empty/missing will default to grafana blog
   */
  feedUrl?: string;
  showImage?: boolean;
}

export const defaultOptions: Partial<Options> = {
  showImage: true,
};
