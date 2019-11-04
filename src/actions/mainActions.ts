import { createAction } from 'typesafe-actions';
import { LatLon, AppState } from 'fm3/types/common';

export type Tool =
  | 'objects'
  | 'route-planner'
  | 'measure-dist'
  | 'measure-ele'
  | 'measure-area'
  | 'route-planner'
  | 'track-viewer'
  | 'info-point'
  | 'changesets'
  | 'gallery'
  | 'map-details'
  | 'tracking';

export const setActiveModal = createAction('SET_ACTIVE_MODAL')<string | null>();

export const setTool = createAction('SET_TOOL')<Tool | null>();

export const setHomeLocation = createAction('SET_HOME_LOCATION')<{
  lat: number;
  lon: number;
} | null>();

export const startProgress = createAction('START_PROGRESS')<string | number>();

export const stopProgress = createAction('STOP_PROGRESS')<string | number>();

export const setLocation = createAction('SET_LOCATION')<{
  lat: number;
  lon: number;
  accuracy: number;
}>();

export interface PdfExportOptions {
  contours: boolean;
  shadedRelief: boolean;
  hikingTrails: boolean;
  bicycleTrails: boolean;
  skiTrails: boolean;
  horseTrails: boolean;
  scale: number;
  area: 'visible' | 'infopoints';
}

export const setExpertMode = createAction('SET_EXPERT_MODE')<boolean>();

export const setAppState = createAction('SET_APP_STATE')<AppState>();

export const exportGpx = createAction('EXPORT_GPX')<string[]>();

export const exportPdf = createAction('EXPORT_PDF')<PdfExportOptions>();

export const clearMap = createAction('CLEAR_MAP')();

export const toggleLocate = createAction('LOCATE')();

export const setSelectingHomeLocation = createAction(
  'SET_SELECTING_HOME_LOCATION',
)<boolean>();

export const enableUpdatingUrl = createAction('ENABLE_UPDATING_URL')();

export const reloadApp = createAction('RELOAD_APP')();

export const saveSettings = createAction('SAVE_SETTINGS')<{
  tileFormat: 'png' | 'jpeg';
  homeLocation: LatLon | null;
  overlayOpacity: { [type: string]: number };
  overlayPaneOpacity: number;
  expertMode: boolean;
  trackViewerEleSmoothingFactor: number;
  user: { name: string | null; email: string | null } | null;
  preventTips: boolean;
}>();

export const setErrorTicketId = createAction('SET_ERROR_TICKET_ID')<string>();

export const setEmbedFeatures = createAction('SET_EMBED_FEATURES')<string[]>();
