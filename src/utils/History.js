import { findLastIndex } from "./findIndex";

export default class History {
  constructor(reducer, eventLimit = 10) {
    this.step = reducer;
    this.limit = eventLimit;

    this.currTime = 0;
  }

  static wrap(state) {
    return {
      past: [],
      present: state,
      future: []
    };
  }

  static unwrap(state) {
    return state.present;
  }

  // action will be saved in past history, future history will be reset
  record(state, action) {
    var {past, present, future} = state;

    past = state.past.concat({
      state: present,
      action: action,
      time: this.currTime++,
      silent: false
    });
    present = this.step(present, action);
    future = [];

    if (past.length > this.limit) {
      past = past.slice(-this.limit);
    }

    return {past, present, future};
  }

  // future history will be reset, but action will not be saved in past history
  norecord(state, action) {
    var {past, present, future} = state;

    present = this.step(present, action);
    future = [];

    return {past, present, future};
  }

  // action will be saved, but not undoable.
  // Does not reset future history.
  // Useful for permanent actions that have no effect on historical state
  silent(state, action) {
    var {past, present, future} = state;

    past = state.past.concat({
      state: present,
      action: action,
      time: this.currTime++,
      silent: true
    });
    present = this.step(present, action);

    if (past.length > this.limit) {
      past = past.slice(-this.limit);
    }

    return {past, present, future};
  }

  // action has no effect on history
  ignore(state, action) {
    var {past, present, future} = state;

    present = this.step(present, action);

    return {past, present, future};
  }

  // undo a specific event matching the given predicate,
  // or the last (non-silent) event if no predicate is given
  undo(state, predicate = () => true) {
    var eventIndex = findLastIndex(state.past, (event) => {
      return !event.silent && predicate(event.action);
    });

    if (eventIndex < 0) return state;

    var event = state.past[eventIndex];
    var past = state.past.slice(0, eventIndex);
    var present = event.state;
    var future = state.future.concat(event);

    // replay subsequent events
    for (var i = eventIndex + 1; i < state.past.length; i++) {
      var action = state.past[i].action;

      past.push({
        state: present,
        action: action,
        time: state.past[i].time,
        silent: state.past[i].silent
      });

      present = this.step(present, action);
    }

    return {past, present, future};
  }

  // redo the nearest undone event
  redo(state) {
    var eventIndex = state.future.length - 1;

    if (eventIndex < 0) return state;

    var event = state.future[eventIndex];
    var past = state.past.slice();
    var present = event.state;
    var future = state.future.slice(0, eventIndex);

    // shuffle the event to the correct place
    var index = state.past.length;
    while (index > 0 && event.time < past[index-1].time) {
      past[index] = past[index - 1];
      index--;
    }
    past[index] = event;

    // replay subsequent events
    for (var i = index; i < past.length; i++) {
      var action = past[i].action;

      past[i] = {
        state: present,
        action: action,
        time: past[i].time,
        silent: past[i].silent
      };

      present = this.step(present, action);
    }

    return {past, present, future};
  }
}