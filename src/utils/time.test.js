import { formatTime } from './time';

function time(h, m, s) {
  return h*60*60*1000 + m*60*1000 + s*1000;
}

test("works without conditional groups", () => {
  expect(formatTime("%h hours %mm %ss", time(3, 0, 12)))
    .toBe("3 hours 0m 12s");

  expect(formatTime("%h, %m", time(100, 59, 0)))
    .toBe("100, 59");
});

test("works with single-layer conditional groups", () => {
  expect(formatTime("?(%hh )%mm", time(5, 10, 20)))
    .toBe("5h 10m");

  expect(formatTime("?(%hh )%mm", time(0, 10, 20)))
    .toBe("10m");

  expect(formatTime("?(%hh )%mm?( %ss)", time(0, 10, 20)))
    .toBe("10m 20s");
});

test("works with multi-layer conditional groups", () => {
  expect(formatTime("?(%hh)?( %mm?( %ss))", time(5, 10, 20)))
    .toBe("5h 10m 20s");

  expect(formatTime("?(%hh)?( %mm?( %ss))", time(5, 0, 20)))
    .toBe("5h");

  expect(formatTime("?(%hh)?( %mm?( %ss))", time(5, 10, 0)))
    .toBe("5h 10m");

  expect(formatTime("?(%hh)?( %mm?( %ss))", time(0, 0, 20)))
    .toBe("");
});