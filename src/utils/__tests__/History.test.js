import History from '../History';

function makeAction(type, data, id) {
  return { type, data, id };
}

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return state + action.data;
    case 'reset':
      return 0;
  }
}

it("correctly applies reducer and creates historic events", () => {
  var h = new History(reducer);
  var state = History.wrap(0);

  expect(History.unwrap(state)).toBe(0);

  state = h.record(state, makeAction('add', 3));
  expect(History.unwrap(state)).toBe(3);
  expect(state.past.length).toBe(1);
  expect(state.future.length).toBe(0);

  state = h.record(state, makeAction('add', 2));
  expect(History.unwrap(state)).toBe(5);
  expect(state.past.length).toBe(2);
  expect(state.future.length).toBe(0);

  state = h.record(state, makeAction('reset'));
  expect(History.unwrap(state)).toBe(0);
  expect(state.past.length).toBe(3);
  expect(state.future.length).toBe(0);

  state = h.ignore(state, makeAction('add', 1));
  expect(History.unwrap(state)).toBe(1);
  expect(state.past.length).toBe(3);
  expect(state.future.length).toBe(0);
});

it("can do simple undo / redo actions", () => {
  var h = new History(reducer);
  var state = History.wrap(0);

  state = h.record(state, makeAction('add', 3));
  state = h.record(state, makeAction('add', 2));
  state = h.record(state, makeAction('reset'));
  expect(History.unwrap(state)).toBe(0);
  expect(state.past.length).toBe(3);
  expect(state.future.length).toBe(0);

  state = h.undo(state);
  expect(History.unwrap(state)).toBe(5);
  expect(state.past.length).toBe(2);
  expect(state.future.length).toBe(1);

  state = h.undo(state);
  expect(History.unwrap(state)).toBe(3);
  expect(state.past.length).toBe(1);
  expect(state.future.length).toBe(2);

  state = h.undo(state);
  expect(History.unwrap(state)).toBe(0);
  expect(state.past.length).toBe(0);
  expect(state.future.length).toBe(3);

  state = h.redo(state);
  expect(History.unwrap(state)).toBe(3);
  expect(state.past.length).toBe(1);
  expect(state.future.length).toBe(2);

  state = h.record(state, makeAction('add', 1));
  expect(History.unwrap(state)).toBe(4);
  expect(state.past.length).toBe(2);
  expect(state.future.length).toBe(0);

  state = h.redo(state);
  expect(History.unwrap(state)).toBe(4);
  expect(state.past.length).toBe(2);
  expect(state.future.length).toBe(0);

  state = h.ignore(state, makeAction('add', 1));
  expect(History.unwrap(state)).toBe(5);
  expect(state.past.length).toBe(2);
  expect(state.future.length).toBe(0);

  state = h.undo(state);
  expect(History.unwrap(state)).toBe(3);
  expect(state.past.length).toBe(1);
  expect(state.future.length).toBe(1);
});

it("can undo a specific action", () => {
  var h = new History(reducer);
  var state = History.wrap(0);

  state = h.record(state, makeAction('add', 3));
  state = h.record(state, makeAction('add', 2, 1));
  state = h.record(state, makeAction('add', 6));
  expect(History.unwrap(state)).toBe(11);
  expect(state.past.length).toBe(3);
  expect(state.future.length).toBe(0);

  state = h.undo(state, a => a.id === 1);
  expect(History.unwrap(state)).toBe(9);
  expect(state.past.length).toBe(2);
  expect(state.future.length).toBe(1);

  state = h.undo(state);
  expect(History.unwrap(state)).toBe(3);
  expect(state.past.length).toBe(1);
  expect(state.future.length).toBe(2);

  state = h.redo(state);
  expect(History.unwrap(state)).toBe(9);
  expect(state.past.length).toBe(2);
  expect(state.future.length).toBe(1);

  state = h.redo(state);
  expect(History.unwrap(state)).toBe(11);
  expect(state.past.length).toBe(3);
  expect(state.future.length).toBe(0);
});

it("correctly applies norecord events", () => {
  var h = new History(reducer);
  var state = History.wrap(0);

  state = h.record(state, makeAction('add', 3));
  state = h.record(state, makeAction('add', 2));
  state = h.norecord(state, makeAction('reset'));
  expect(History.unwrap(state)).toBe(0);
  expect(state.past.length).toBe(2);
  expect(state.future.length).toBe(0);

  state = h.undo(state);
  expect(History.unwrap(state)).toBe(3);
  expect(state.past.length).toBe(1);
  expect(state.future.length).toBe(1);

  state = h.norecord(state, makeAction('add', 1));
  expect(History.unwrap(state)).toBe(4);
  expect(state.past.length).toBe(1);
  expect(state.future.length).toBe(0);
});

it("correctly applies silent events", () => {
  var h = new History(reducer);
  var state = History.wrap(0);

  state = h.record(state, makeAction('add', 3));
  state = h.record(state, makeAction('add', 2));
  state = h.silent(state, makeAction('add', 1));
  expect(History.unwrap(state)).toBe(6);
  expect(state.past.length).toBe(3);
  expect(state.future.length).toBe(0);

  state = h.undo(state);
  expect(History.unwrap(state)).toBe(4);
  expect(state.past.length).toBe(2);
  expect(state.future.length).toBe(1);

  state = h.undo(state);
  expect(History.unwrap(state)).toBe(1);
  expect(state.past.length).toBe(1);
  expect(state.future.length).toBe(2);

  state = h.undo(state);
  expect(History.unwrap(state)).toBe(1);
  expect(state.past.length).toBe(1);
  expect(state.future.length).toBe(2);

  state = h.redo(state);
  expect(History.unwrap(state)).toBe(4);
  expect(state.past.length).toBe(2);
  expect(state.future.length).toBe(1);
});

it("has a limit on the number of recorded events", () => {
  var h = new History(reducer, 4);
  var state = History.wrap(0);

  state = h.record(state, makeAction('add', 3));
  state = h.record(state, makeAction('add', 2, 1));
  state = h.record(state, makeAction('add', 6));
  state = h.record(state, makeAction('add', 4));
  expect(History.unwrap(state)).toBe(15);
  expect(state.past.length).toBe(4);
  expect(state.future.length).toBe(0);

  state = h.record(state, makeAction('add', 5));
  expect(History.unwrap(state)).toBe(20);
  expect(state.past.length).toBe(4);
  expect(state.future.length).toBe(0);

  state = h.undo(state, a => a.id === 1);
  expect(History.unwrap(state)).toBe(18);
  expect(state.past.length).toBe(3);
  expect(state.future.length).toBe(1);

  state = h.record(state, makeAction('add', 3));
  expect(History.unwrap(state)).toBe(21);
  expect(state.past.length).toBe(4);
  expect(state.future.length).toBe(0);
});