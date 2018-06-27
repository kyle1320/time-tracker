import { createStore } from 'redux';
import timeTracker from './timeTracker';
import { loadState, saveState } from './saveData';

const store = createStore(timeTracker, loadState());

store.subscribe(() => {
  saveState(store.getState());
});

export default store;