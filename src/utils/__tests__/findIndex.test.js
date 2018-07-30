import { findIndex, findLastIndex } from '../findIndex';

it("correctly finds the first index", () => {
  var arr = [1, 1, 2, 3, 5, 8];

  expect(findIndex(arr, x => x === 1)).toBe(0);
  expect(findIndex(arr, x => x === 5)).toBe(4);
  expect(findIndex(arr, x => x === 12)).toBe(-1);
  expect(findIndex(arr, x => false)).toBe(-1);

  expect(findIndex([], x => x === undefined)).toBe(-1);
  expect(findIndex([], x => x === 0)).toBe(-1);
  expect(findIndex([], x => true)).toBe(-1);
});

it("correctly finds the last index", () => {
  var arr = [1, 1, 2, 3, 5, 8];

  expect(findLastIndex(arr, x => x === 1)).toBe(1);
  expect(findLastIndex(arr, x => x === 5)).toBe(4);
  expect(findLastIndex(arr, x => x === 12)).toBe(-1);
  expect(findLastIndex(arr, x => false)).toBe(-1);

  expect(findLastIndex([], x => x === undefined)).toBe(-1);
  expect(findLastIndex([], x => x === 0)).toBe(-1);
  expect(findLastIndex([], x => true)).toBe(-1);
});