import { createLogic } from 'redux-logic';
import { infoPointAdd } from 'fm3/actions/infoPointActions';

export const infoPointLogic = createLogic({
  type: 'SET_TOOL',
  process({ getState }, dispatch, done) {
    const state = getState();
    const tool = state.main.tool;
    const lat = state.infoPoint.lat;
    const userOpenedToolButThereIsNoInfoPointYet = tool === 'info-point' && lat === null;
    if (userOpenedToolButThereIsNoInfoPointYet) {
      const mapCenterLat = state.map.lat;
      const mapCenterLon = state.map.lon;
      dispatch(infoPointAdd(mapCenterLat, mapCenterLon, null));
    }
    done();
  },
});

export default infoPointLogic;
