import { createStore } from 'redux';

import timeTracker from './timeTracker';
import { upgrade } from './actions';
import { CURRENT_VERSION } from './version';

const DEFAULT_STATE = {
  selectedTask: -1,
  lastTickTime: -1,
  nextTaskId: 0,
  editTaskId: -1,
  themeColor: 'purple',
  tasks: [],
  version: CURRENT_VERSION
};

const STORAGE_KEY = 'savedState';

function loadState() {
  var state = window.localStorage.getItem(STORAGE_KEY)

  try {
    state = JSON.parse(state);
  } catch (e) {
    state = undefined;
  }

  return state || DEFAULT_STATE;
}

function saveState(state) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const store = createStore(timeTracker, loadState());

store.subscribe(() => {
  saveState(store.getState());
});

store.dispatch(upgrade());

export default store;