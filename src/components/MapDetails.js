import React from 'react';
import { connect } from 'react-redux';
import * as FmPropTypes from 'fm3/propTypes';

import { Polyline } from 'react-leaflet';

function MapDetails({ trackInfoPoints }) {
  return (
    <div>
      {trackInfoPoints &&
        <Polyline positions={(trackInfoPoints || []).map(point => [point.lat, point.lon])} interactive={false} weight={8} />
      }
    </div>
  );
}

MapDetails.propTypes = {
  trackInfoPoints: FmPropTypes.points,
};

export default connect(
  state => ({
    trackInfoPoints: state.mapDetails.trackInfoPoints,
  }),
)(MapDetails);
