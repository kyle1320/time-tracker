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

  // Performs the given action on the given state, and returns the new state.
  // saveEvent:   Whether to save the event in history.
  // resetFuture: Whether to reset any future history.
  // isPermanent: Whether this action should be permanent & cannot be undone.
  //              Has no effect unless saveEvent is true.
  record(state, action, saveEvent = true, resetFuture = true, isPermanent = false) {
    var {past, present, future} = state;

    if (saveEvent) {
      past = state.past.concat({
        state: present,
        action: action,
        time: this.currTime++,
        permanent: isPermanent
      });
    }

    present = this.step(present, action);

    if (resetFuture) {
      future = [];
    }

    if (past.length > this.limit) {
      past = past.slice(-this.limit);
    }

    return {past, present, future};
  }

  // future history will be reset, but action will not be saved in past history
  norecord(state, action) {
    return this.record(state, action, false, true);
  }

  // action will be permanent, but not reset future history.
  silent(state, action) {
    return this.record(state, action, true, false, true);
  }

  // action has no effect on history
  ignore(state, action) {
    return this.record(state, action, false, false);
  }

  // undo a specific event matching the given predicate,
  // or the last (non-permanent) event if no predicate is given
  undo(state, predicate = () => true) {
    var eventIndex = findLastIndex(state.past, (event) => {
      return !event.permanent && predicate(event.action);
    });

    if (eventIndex < 0) return state;

    var event   = state.past[eventIndex];
    var past    = removeElement(state.past, eventIndex);
    var present = replay(event.state, past, eventIndex, past.length, this.step);
    var future  = state.future.concat(event);

    return {past, present, future};
  }

  // redo the nearest undone event
  redo(state) {
    var eventIndex = state.future.length - 1;

    if (eventIndex < 0) return state;

    var event   = state.future[eventIndex];
    var past    = state.past.slice();
    var index   = insertChronological(event, past);
    var present = replay(event.state, past, index, past.length, this.step);
    var future  = state.future.slice(0, eventIndex);

    return {past, present, future};
  }
}

function removeElement(arr, index) {
  arr = arr.slice();
  arr.splice(index, 1);
  return arr;
}

// shuffle the event to the correct place
function insertChronological(event, events) {
  var index = events.length;

  while (index > 0 && event.time < events[index-1].time) {
    events[index] = events[index - 1];
    index--;
  }

  events[index] = event;

  return index;
}

function replay(state, events, startIndex, endIndex, step) {
  for (var i = startIndex; i < endIndex; i++) {
    var action = events[i].action;

    events[i] = {
      state: state,
      action: action,
      time: events[i].time,
      permanent: events[i].permanent
    };

    state = step(state, action);
  }

  return state;
}