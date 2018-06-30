// strings are split based on word boundaries,
// and then their components converted to numbers (if possible)
function process(str) {
  return str.split(/\b/).map(s => {
    var num = +s;
    if (!isNaN(num)) {
      return num;
    }
    return s;
  });
}

/*
  Compares the given strings, except that numbers in the strings
  are sorted by their numerical value.

  e.g. "ABC 123" would be ordered after "ABC 89"
*/
export default function compare(a, b) {
  var aParts = process(a);
  var bParts = process(b);

  for (var i = 0; i < aParts.length && i < bParts.length; i++) {
    var x = aParts[i];
    var y = bParts[i];

    var cmp;
    if (typeof x === 'string' || typeof y === 'string') {
      cmp = String(x).localeCompare(String(y))
    } else {
      cmp = x - y;
    }

    if (cmp) return cmp;
  }

  return aParts.length - bParts.length;
}