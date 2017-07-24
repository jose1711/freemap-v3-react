import { createLogic } from 'redux-logic';

import { mapRefocus } from 'fm3/actions/mapActions';
import { startProgress, stopProgress, setActiveModal } from 'fm3/actions/mainActions';
import { toastsAddError } from 'fm3/actions/toastsActions';
import { gallerySetImages, galleryRemoveItem, galleryUpload } from 'fm3/actions/galleryActions';
import { infoPointSet } from 'fm3/actions/infoPointActions';

const galleryRequestImagesLogic = createLogic({
  cancelType: ['SET_TOOL', 'MAP_RESET'],
  type: 'GALLERY_REQUEST_IMAGES',
  process({ action: { payload: { lat, lon } }, getState, cancelled$ }, dispatch, done) {
    const pid = Math.random();
    dispatch(startProgress(pid));
    cancelled$.subscribe(() => {
      dispatch(stopProgress(pid));
    });

    fetch(`http://www.freemap.sk:3000/gallery/pictures?lat=${lat}&lon=${lon}&distance=${5000 / 2 ** getState().map.zoom}`)
      .then(res => res.json())
      .then((payload) => {
        dispatch(gallerySetImages(payload.map(item => toImage(item))));
      })
      .catch((e) => {
        dispatch(toastsAddError(`Nastala chyba pri načítavaní obrázkov: ${e.message}`));
      })
      .then(() => {
        dispatch(stopProgress(pid));
        done();
      });
  },
});

const galleryRequestImageLogic = createLogic({
  cancelType: ['SET_TOOL', 'MAP_RESET'],
  type: 'GALLERY_REQUEST_IMAGE',
  process({ action: { payload: id }, cancelled$ }, dispatch, done) {
    const pid = Math.random();
    dispatch(startProgress(pid));
    cancelled$.subscribe(() => {
      dispatch(stopProgress(pid));
    });

    fetch(`http://www.freemap.sk:3000/gallery/picture/${id}`)
      .then(res => res.json())
      .then((payload) => {
        dispatch(gallerySetImages([toImage(payload)]));
      })
      .catch((e) => {
        dispatch(toastsAddError(`Nastala chyba pri načítavaní obrázku: ${e.message}`));
      })
      .then(() => {
        dispatch(stopProgress(pid));
        done();
      });
  },
});

const galleryShowOnTheMapLogic = createLogic({
  type: 'GALLERY_SHOW_ON_THE_MAP',
  process({ getState }, dispatch, done) {
    const { images, activeImageId } = getState().gallery;
    const activeImage = activeImageId ? images.find(({ id }) => id === activeImageId) : null;
    if (activeImage) {
      dispatch(infoPointSet(activeImage.lat, activeImage.lon, activeImage.title));
      dispatch(mapRefocus({ lat: activeImage.lat, lon: activeImage.lon }));
    }
    done();
  },
});

const galleryUploadModalLogic = createLogic({
  type: 'SET_ACTIVE_MODAL',
  transform({ getState, action }, next) {
    if (action.payload === 'gallery-upload' && !getState().auth.user) {
      next(toastsAddError('Pre nahrávanie obrázkov do galérie musíte byť prihlásený.'));
    } else {
      next(action);
    }
  },
});

const galleryItemUploadLogic = createLogic({
  type: ['GALLERY_UPLOAD', 'GALLERY_START_ITEM_UPLOAD'],
  cancelType: 'SET_ACTIVE_MODAL',
  process({ getState }, dispatch, done) {
    const { items, uploadingId } = getState().gallery;

    if (uploadingId === null) {
      dispatch(setActiveModal(null));
      done();
      return;
    }

    const item = items.find(({ id }) => id === uploadingId);

    const formData = new FormData();
    formData.append('image', item.file);
    const data = JSON.stringify({
      title: item.title,
      description: item.description,
      position: item.position,
    });
    formData.append('meta', new Blob([data], { type: 'application/json' }));

    fetch('https://www.posttestserver.com/', {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
    }).then(() => {
      dispatch(galleryRemoveItem(item.id));
      dispatch(galleryUpload());
      done();
    });
  },
});

function toImage(payload) {
  return { ...payload, createdAt: new Date(payload.createdAt) }; // TODO validate payload
}

export default [galleryRequestImagesLogic, galleryRequestImageLogic, galleryShowOnTheMapLogic,
  galleryUploadModalLogic, galleryItemUploadLogic];
