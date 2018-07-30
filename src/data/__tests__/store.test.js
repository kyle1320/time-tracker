import { CURRENT_VERSION } from '../version';
import { PAGE_LOAD } from '../action-constants';
import { tick, newTask } from '../actions';

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

it("loads a default state", () => {
  jest.resetModules();
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
  jest.resetModules();
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
  window.localStorage.setItem.mockClear();

  // fake the current time
  var RealDate = Date;
  global.Date = class Date extends RealDate {
    constructor() { return new RealDate(+new RealDate() + 15000) }
  };

  store.dispatch(tick());
  expect(window.localStorage.setItem).toHaveBeenCalled();

  global.Date = RealDate;
});

it("can reload previously saved state", () => {
  jest.resetModules();
  window.localStorage = new MockStorage();

  var store = require('../store').default;

  store.dispatch(newTask());
  jest.runTimersToTime(1100);
  expect(store.getState().present.tasks).toHaveLength(1);

  jest.resetModules();

  store = require('../store').default;
  expect(store.getState().present.tasks).toHaveLength(1);

  jest.resetModules();
  localStorage.setItem("savedState", "invalid :(");

  store = require('../store').default;
  expect(store.getState().present.tasks).toHaveLength(0);
});

it("can reset the saved state", () => {
  jest.resetModules();
  window.localStorage = new MockStorage();

  var store = require('../store').default;

  store.dispatch(newTask());
  jest.runTimersToTime(1100);
  expect(store.getState().present.tasks).toHaveLength(1);

  window.confirm = () => false;
  window.resetAllAppData();

  jest.resetModules();
  store = require('../store').default;
  expect(store.getState().present.tasks).toHaveLength(1);

  window.confirm = () => true;
  window.resetAllAppData();

  jest.resetModules();
  store = require('../store').default;
  expect(store.getState().present.tasks).toHaveLength(0);
});