export function colorNameToHex(name) {
  switch (name) {
    case 'purple': return '#673AB7';
    case 'orange': return '#FF9800';
    case 'green':  return '#4CAF50';
    case 'blue':   return '#2196F3';
    case 'red':    return '#F44336';
    case 'teal':   return '#009688';
    default:       return '';
  }
}