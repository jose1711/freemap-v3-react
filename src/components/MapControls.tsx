import { toggleLocate } from 'fm3/actions/mainActions';
import { mapRefocus, MapViewState } from 'fm3/actions/mapActions';
import { useMessages } from 'fm3/l10nInjector';
import { getMapLeafletElement } from 'fm3/leafletElementHolder';
import { RootState } from 'fm3/storeCreator';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import { FaMinus, FaPlus, FaRegDotCircle } from 'react-icons/fa';
import { RiFullscreenExitLine, RiFullscreenLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { MapSwitchButton } from './MapSwitchButton';

export function MapControls(): ReactElement | null {
  const m = useMessages();

  const dispatch = useDispatch();

  const zoom = useSelector((state: RootState) => state.map.zoom);

  const embedFeatures = useSelector(
    (state: RootState) => state.main.embedFeatures,
  );

  const locate = useSelector((state: RootState) => state.main.locate);

  const gpsTracked = useSelector((state: RootState) => state.map.gpsTracked);

  const onMapRefocus = useCallback(
    (changes: Partial<MapViewState>) => {
      dispatch(mapRefocus(changes));
    },
    [dispatch],
  );

  const map = getMapLeafletElement();

  const handleFullscreenClick = useCallback(() => {
    if (!document.exitFullscreen) {
      // unsupported
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
  }, []);

  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    function handler() {
      setForceUpdate(forceUpdate + 1);
    }

    document.addEventListener('fullscreenchange', handler);

    return () => {
      document.removeEventListener('fullscreenchange', handler);
    };
  }, [forceUpdate, setForceUpdate]);

  if (!map) {
    return null;
  }

  const embed = window.self !== window.top;

  return (
    <Card className="fm-toolbar">
      {(!embed || !embedFeatures.includes('noMapSwitch')) && (
        <MapSwitchButton />
      )}
      <ButtonGroup className="ml-1">
        <Button
          variant="secondary"
          onClick={() => {
            onMapRefocus({ zoom: zoom + 1 });
          }}
          title={m?.main.zoomIn}
          disabled={zoom >= map.getMaxZoom()}
        >
          <FaPlus />
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            onMapRefocus({ zoom: zoom - 1 });
          }}
          title={m?.main.zoomOut}
          disabled={zoom <= map.getMinZoom()}
        >
          <FaMinus />
        </Button>
      </ButtonGroup>
      {(!embed || !embedFeatures.includes('noLocateMe')) && (
        <Button
          className="ml-1"
          onClick={() => {
            dispatch(toggleLocate());
          }}
          title={m?.main.locateMe}
          active={locate}
          variant={gpsTracked ? 'warning' : 'secondary'}
        >
          <FaRegDotCircle />
        </Button>
      )}
      {'exitFullscreen' in document && (
        <Button
          className="ml-1"
          variant="secondary"
          onClick={handleFullscreenClick}
          title={
            document.fullscreenElement
              ? m?.general.exitFullscreen
              : m?.general.fullscreen
          }
        >
          {document.fullscreenElement ? (
            <RiFullscreenExitLine />
          ) : (
            <RiFullscreenLine />
          )}
        </Button>
      )}
    </Card>
  );
}
