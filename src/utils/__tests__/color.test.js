import { colorNameToHex } from '../color';

it("returns a hex color code", () => {
  expect(colorNameToHex("red")).toMatch(/^#[0-9A-F]{6}$/i);
});

it("returns an empty string on an invalid name", () => {
  expect(colorNameToHex("notacolor")).toBe('');
});

it("returns unique colors", () => {
  var set = new Set();
  var colors = ['purple', 'orange', 'red', 'green', 'blue', 'teal'];

  colors.forEach(color => {
    set.add(colorNameToHex(color));
  });

  expect(set.size).toBe(colors.length);
  expect('' in colors).toBe(false);
});