import { colorNameToHex } from '../color';

it("returns a hex color code", () => {
  expect(colorNameToHex("red")).toMatch(/^#[0-9A-F]{6}$/i);
});

it("returns an empty string on an invalid name", () => {
  expect(colorNameToHex("notacolor")).toBe('');
});

it("returns different values for different colors", () => {
  expect(colorNameToHex("red")).not.toBe(colorNameToHex("green"));
  expect(colorNameToHex("green")).not.toBe(colorNameToHex("blue"));
  expect(colorNameToHex("blue")).not.toBe(colorNameToHex("orange"));
});