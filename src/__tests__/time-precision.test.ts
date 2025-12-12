import { describe, it, expect } from "bun:test";
import { when } from "../index";

describe("Time Precision", () => {
  // Base time with non-zero seconds and milliseconds
  const base = new Date("2024-01-15T10:30:45.123Z");

  describe("when setting explicit time, should zero out sub-minute precision", () => {
    it("tomorrow at 5pm should have zero seconds and milliseconds", () => {
      const result = when.en("tomorrow at 5pm", base);
      expect(result).not.toBeNull();
      expect(result!.time.getUTCHours()).toBe(17);
      expect(result!.time.getUTCMinutes()).toBe(0);
      expect(result!.time.getUTCSeconds()).toBe(0);
      expect(result!.time.getUTCMilliseconds()).toBe(0);
    });

    it("5:30pm should have zero seconds and milliseconds", () => {
      const result = when.en("5:30pm", base);
      expect(result).not.toBeNull();
      expect(result!.time.getUTCHours()).toBe(17);
      expect(result!.time.getUTCMinutes()).toBe(30);
      expect(result!.time.getUTCSeconds()).toBe(0);
      expect(result!.time.getUTCMilliseconds()).toBe(0);
    });

    it("this morning should have zero seconds and milliseconds", () => {
      const result = when.en("this morning", base);
      expect(result).not.toBeNull();
      expect(result!.time.getUTCHours()).toBe(8);
      expect(result!.time.getUTCMinutes()).toBe(0);
      expect(result!.time.getUTCSeconds()).toBe(0);
      expect(result!.time.getUTCMilliseconds()).toBe(0);
    });

    it("tonight should have zero seconds and milliseconds", () => {
      const result = when.en("tonight", base);
      expect(result).not.toBeNull();
      expect(result!.time.getUTCHours()).toBe(23);
      expect(result!.time.getUTCMinutes()).toBe(0);
      expect(result!.time.getUTCSeconds()).toBe(0);
      expect(result!.time.getUTCMilliseconds()).toBe(0);
    });

    it("next friday at 2pm should have zero seconds and milliseconds", () => {
      const result = when.en("next friday at 2pm", base);
      expect(result).not.toBeNull();
      expect(result!.time.getUTCHours()).toBe(14);
      expect(result!.time.getUTCMinutes()).toBe(0);
      expect(result!.time.getUTCSeconds()).toBe(0);
      expect(result!.time.getUTCMilliseconds()).toBe(0);
    });
  });

  describe("relative times should preserve precision from base", () => {
    it("in 5 minutes should add exactly 5 minutes", () => {
      const result = when.en("in 5 minutes", base);
      expect(result).not.toBeNull();
      // Should be base + 5 minutes exactly
      const expected = new Date(base.getTime() + 5 * 60 * 1000);
      expect(result!.time.getTime()).toBe(expected.getTime());
    });

    it("2 hours ago should subtract exactly 2 hours", () => {
      const result = when.en("2 hours ago", base);
      expect(result).not.toBeNull();
      // Should be base - 2 hours exactly
      const expected = new Date(base.getTime() - 2 * 60 * 60 * 1000);
      expect(result!.time.getTime()).toBe(expected.getTime());
    });

    it("in 3 days should add exactly 3 days", () => {
      const result = when.en("in 3 days", base);
      expect(result).not.toBeNull();
      // Should be base + 3 days exactly
      const expected = new Date(base.getTime() + 3 * 24 * 60 * 60 * 1000);
      expect(result!.time.getTime()).toBe(expected.getTime());
    });
  });
});
