import * as actions from '../action-constants';

it("contains only valid action strings", () => {
  for (var key in actions) {
    var action = actions[key];

    expect(typeof action).toBe('string');
    expect(action).toMatch(/^[0-9A-Z_-]+$/);
  }
});

it("contains no duplicate action strings", () => {
  var set = new Set();

  var count = 0;
  for (var key in actions) {
    set.add(actions[key]);

    expect(set.size).toBe(count + 1);
    
    count++;
  }
});