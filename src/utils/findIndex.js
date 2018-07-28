export function findIndex(arr, predicate) {
  for (var i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i, arr)) {
      return i;
    }
  }
  return -1;
}

export function findLastIndex(arr, predicate) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i], i, arr)) {
      return i;
    }
  }
  return -1;
}