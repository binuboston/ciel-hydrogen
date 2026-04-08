import { describe, it, expect } from 'vitest';
import { titleize } from './string.js';

describe("titleize", () => {
  const TEST_DIRECTORY_NAMES = {
    "demo-storefront": "Demo Storefront",
    "nifty \u{1F602} project ": "Nifty Project",
    "Hello \u{1F602}": "Hello",
    _____: ""
  };
  it("replaces non-alpha-numeric characters with spaces and capitalizes the first letter of every word", () => {
    for (const [input, expected] of Object.entries(TEST_DIRECTORY_NAMES)) {
      expect(titleize(input)).toBe(expected);
    }
  });
});
