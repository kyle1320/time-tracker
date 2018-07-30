import compare from '../customCompare';

it("correctly compares alphabetical strings", () => {
  expect(compare("abc", "def")).toBeLessThan(0);
  expect(compare("abc", "abd")).toBeLessThan(0);
  expect(compare("abc", "Abc")).toBeLessThan(0);
  expect(compare("Abc", "abcd")).toBeLessThan(0);
  expect(compare("abc", "abc abc")).toBeLessThan(0);
  expect(compare("abc def", "Abc abc")).toBeLessThan(0);

  expect(compare("def", "abc")).toBeGreaterThan(0);
  expect(compare("Abc", "abc")).toBeGreaterThan(0);

  expect(compare("abc", "def", true)).toBeGreaterThan(0);
  expect(compare("abc", "abd", true)).toBeGreaterThan(0);
});

it("correctly compares alphanumeric strings", () => {
  expect(compare("abc123", "abcdef")).toBeLessThan(0);
  expect(compare("abc100", "abc40")).toBeLessThan(0);

  expect(compare("abc-123", "abc-def")).toBeLessThan(0);
  expect(compare("abc-40", "abc-100")).toBeLessThan(0);
  expect(compare("abc-100 abc", "abc-100 def")).toBeLessThan(0);
  expect(compare("abc-100a", "abc-40a")).toBeLessThan(0);
});