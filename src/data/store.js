import { createStore } from 'redux';

import timeTracker from './timeTracker';
import { DEFAULT_STATE } from './data-constants';
import { upgrade } from './actions';

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