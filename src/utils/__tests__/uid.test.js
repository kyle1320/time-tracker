import uid from '../uid';

it('generates alphanumeric UIDs of length 9', () => {
  for (var i = 0; i < 1000; i++) {
    expect(uid()).toMatch(/^[0-9A-Z]{9}$/i)
  }
});

it('generates unique IDs', () => {
  var set = new Set();

  for (var i = 0; i < 1000; i++) {
    var x = uid();

    set.add(x);

    expect(set.size).toBe(i + 1);
  }
});