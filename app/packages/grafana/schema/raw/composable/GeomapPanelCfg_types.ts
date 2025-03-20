
import * as ui from '@schema';

export const pluginVersion = "11.6.0-pre";

export interface Options {
  basemap: ui.MapLayerOptions;
  controls: ControlsOptions;
  layers: Array<ui.MapLayerOptions>;
  tooltip: TooltipOptions;
  view: MapViewConfig;
}

export const defaultOptions: Partial<Options> = {
  layers: [],
};

export interface MapViewConfig {
  allLayers?: boolean;
  id: string;
  lastOnly?: boolean;
  lat?: number;
  layer?: string;
  lon?: number;
  maxZoom?: number;
  minZoom?: number;
  padding?: number;
  shared?: boolean;
  zoom?: number;
}

export const defaultMapViewConfig: Partial<MapViewConfig> = {
  allLayers: true,
  id: 'zero',
  lat: 0,
  lon: 0,
  zoom: 1,
};

export interface ControlsOptions {
  /**
   * let the mouse wheel zoom
   */
  mouseWheelZoom?: boolean;
  /**
   * Lower right
   */
  showAttribution?: boolean;
  /**
   * Show debug
   */
  showDebug?: boolean;
  /**
   * Show measure
   */
  showMeasure?: boolean;
  /**
   * Scale options
   */
  showScale?: boolean;
  /**
   * Zoom (upper left)
   */
  showZoom?: boolean;
}

export interface TooltipOptions {
  mode: TooltipMode;
}

export enum TooltipMode {
  Details = 'details',
  None = 'none',
}

export enum MapCenterID {
  Coords = 'coords',
  Fit = 'fit',
  Zero = 'zero',
}
