export function formatTime(fmt, time) {
  var millis = time % 1000;
  time = (time - millis) / 1000;

  var seconds = time % 60;
  time = (time - seconds) / 60;

  var minutes = time % 60;
  time = (time - minutes) / 60;

  var hours = time;

  return parse(walk(fmt), {hours, minutes, seconds}, false);
}

function parse(next, timeInfo, inGroup) {
  var {hours, minutes, seconds} = timeInfo
  var str = "";
  var hasZero = false;

  while (next.exists()) {
    var c = next();
    switch (c) {
      case ')':
        if (inGroup) {
          return hasZero ? '' : str;
        } else {
          str += c;
        }
        break;
      case '%':
        var nextChar = next()
        switch (nextChar) {
          case 'h':
            str += hours;
            hasZero = hasZero || !hours;
            break;
          case 'm':
            str += minutes;
            hasZero = hasZero || !minutes;
            break;
          case 's':
            str += seconds;
            hasZero = hasZero || !seconds;
            break;
          default:
            str += c;
            str += nextChar;
            break;
        }
        break;
      case '?':
        if (next() === '(') {
          str += parse(next, timeInfo, true);
        } else {
          str += c;
        }
        break;
      default:
        str += c;
        break;
    }
  }

  return str;
}

function walk(fmt) {
  var i = 0;

  var next = function() {
    return fmt[i++];
  };

  next.exists = function() {
    return i < fmt.length;
  }

  return next;
}