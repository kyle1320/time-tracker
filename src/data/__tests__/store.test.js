import { CURRENT_VERSION } from '../version';
import { PAGE_LOAD } from '../action-constants';
import { tick } from '../actions';

class MockStorage {
  constructor() {
    this.getItem = jest.fn(this.getItem);
    this.setItem = jest.fn(this.setItem);
    this.removeItem = jest.fn(this.removeItem);
  }

  getItem(key)    { return this[key]; }
  setItem(key, value)    { this[key] = value; }
  removeItem(key) { delete this[key]; }
}

function delay(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

it("loads a default state", () => {
  delete require.cache[require.resolve("../store")];
  window.localStorage = new MockStorage();

  var store = require('../store').default;
  var state = store.getState();

  expect(typeof state).toBe('object');

  expect(state).toHaveProperty('past');
  expect(state).toHaveProperty('present');
  expect(state).toHaveProperty('future');

  expect(typeof state.present).toBe('object');

  expect(state.past.findIndex(x => x.action.type === PAGE_LOAD)).toBeGreaterThanOrEqual(0);

  expect(state.present).toHaveProperty('selectedTask', null);
  expect(state.present).toHaveProperty('lastTickTime');
  expect(state.present.lastTickTime).toBeGreaterThan(0);
  expect(state.present).toHaveProperty('newItemId', null);
  expect(state.present).toHaveProperty('themeColor', 'purple');
  expect(state.present).toHaveProperty('tasks', []);
  expect(state.present).toHaveProperty('version', CURRENT_VERSION);
});

jest.useFakeTimers();

it("saves intermittently", () => {
  delete require.cache[require.resolve("../store")];
  window.localStorage = new MockStorage();

  var store = require('../store').default;

  store.dispatch(tick());

  expect(window.localStorage.setItem).not.toHaveBeenCalled();

  jest.runTimersToTime(1100);
  expect(window.localStorage.setItem).toHaveBeenCalled();
  window.localStorage.setItem.mockClear();

  jest.runTimersToTime(500);
  store.dispatch(tick());
  jest.runTimersToTime(500);
  store.dispatch(tick());
  jest.runTimersToTime(500);
  store.dispatch(tick());
  jest.runTimersToTime(500);
  store.dispatch(tick());
  jest.runTimersToTime(500);
  store.dispatch(tick());

  expect(window.localStorage.setItem).not.toHaveBeenCalled();
  
  jest.runTimersToTime(1100);
  expect(window.localStorage.setItem).toHaveBeenCalled();
});