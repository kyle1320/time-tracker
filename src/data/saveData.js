import { DEFAULT_STATE } from './data-constants';

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

export { loadState, saveState };