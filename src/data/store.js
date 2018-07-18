import { createStore } from 'redux';

import timeTracker from './timeTracker';
import { pageLoad } from './actions';
import { CURRENT_VERSION } from './version';

const DEFAULT_STATE = {
  selectedTask: -1,
  lastTickTime: -1,
  nextTaskId: 0,
  newTaskId: -1,
  themeColor: 'purple',
  tasksSorted: false,
  tasks: [],
  version: CURRENT_VERSION
};

const STORAGE_KEY = 'savedState';

export default (function() {
  var lastSaveTime = 0;

  function loadState() {
    var state = window.localStorage.getItem(STORAGE_KEY);

    try {
      state = JSON.parse(state);
    } catch (e) {
      console.log(e);
      state = undefined;
    }

    lastSaveTime = +new Date();

    return state || DEFAULT_STATE;
  }

  function saveState() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState()));
    lastSaveTime = +new Date();
  }

  const startSaveTimeout = (function () {
    var timeoutId = null;

    return () => {
      var timeSinceLastSave = (+new Date()) - lastSaveTime;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Save immediately if updates are infrequent
      // Also prevents blocking caused by high-frequency changes
      if (timeSinceLastSave > 10000) {
        saveState();
        return;
      }

      timeoutId = setTimeout(saveState, 1000);
    }
  }());

  const store = createStore(timeTracker, loadState());

  store.subscribe(startSaveTimeout);

  store.dispatch(pageLoad());

  window.addEventListener("beforeunload", saveState);

  return store;
}());