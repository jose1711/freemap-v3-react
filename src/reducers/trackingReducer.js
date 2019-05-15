import * as at from 'fm3/actionTypes';
import produce from 'immer';

const initialState = {
  devices: [],
  accessTokens: [],
  trackedDevices: [],
  accessTokensDeviceId: undefined,
  modifiedDeviceId: undefined,
  modifiedAccessTokenId: undefined,
  modifiedTrackedDeviceId: undefined,
  tracks: [],
};

export default function tracking(state = initialState, action) {
  switch (action.type) {
    case at.CLEAR_MAP:
      return initialState;
    case at.SET_ACTIVE_MODAL:
      return {
        ...initialState,
        trackedDevices: state.trackedDevices,
      };
    case at.TRACKING_SET_DEVICES:
      return { ...state, devices: action.payload, accessTokens: [] };
    case at.TRACKING_MODIFY_DEVICE:
      return { ...state, modifiedDeviceId: action.payload };
    case at.TRACKING_SET_ACCESS_TOKENS:
      return { ...state, accessTokens: action.payload };
    case at.TRACKING_MODIFY_ACCESS_TOKEN:
      return { ...state, modifiedAccessTokenId: action.payload };
    case at.TRACKING_SHOW_ACCESS_TOKENS:
      return { ...state, accessTokensDeviceId: action.payload };

    case at.TRACKING_SET_TRACKED_DEVICES:
      return { ...state, trackedDevices: action.payload };
    case at.TRACKING_MODIFY_TRACKED_DEVICE:
      return { ...state, modifiedTrackedDeviceId: action.payload };
    case at.TRACKING_SAVE_TRACKED_DEVICE:
      return {
        ...state,
        trackedDevices: [...state.trackedDevices.filter(d => d.id !== state.modifiedTrackedDeviceId), action.payload],
        modifiedTrackedDeviceId: undefined,
      };
    case at.TRACKING_DELETE_TRACKED_DEVICE:
      return {
        ...state,
        trackedDevices: state.trackedDevices.filter(d => d.id !== action.payload),
      };

    case at.RPC_RESPONSE: {
      if (action.payload.method === 'tracking.subscribe' && action.payload.result) {
        return {
          ...state,
          tracks: [
            ...state.tracks,
            {
              id: action.payload.params.token || action.payload.params.deviceId,
              trackPoints: action.payload.result,
            },
          ],
        };
      }

      if (action.payload.method === 'tracking.unsubscribe' && !action.payload.error) {
        return {
          ...state,
          tracks: state.tracks.filter(track => track.id !== action.payload.params.token || action.payload.params.deviceId),
        };
      }

      return state;
    }
    case at.RPC_EVENT: {
      if (action.payload.method === 'tracking.addPoint') {
        // rest: id, lat, lon, altitude, speed, accuracy, bearing, battery, gsmSignal, message, ts
        const { token, deviceId, ...rest } = action.payload.params;
        return produce(state, (draft) => {
          let track = draft.tracks.find(t => t.id === token || deviceId);
          if (!track) {
            track = { id: token || deviceId, trackPoints: [] };
            draft.tracks.push(track);
          }
          track.trackPoints.push(rest);
        });
      }

      return state;
    }
    default:
      return state;
  }
}
