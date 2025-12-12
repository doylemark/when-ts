import { expect, describe, it } from "bun:test";
import type { ParseFn } from "./types";

export interface Fixture {
  text: string;
  index: number;
  phrase: string;
  diff: number; // milliseconds
}

export function applyFixtures(
  name: string,
  parse: ParseFn,
  fixtures: Fixture[],
  baseTime: Date
) {
  describe(name, () => {
    fixtures.forEach((fixture, i) => {
      it(`should parse "${fixture.text}"`, () => {
        const result = parse(fixture.text, baseTime);
        expect(result).not.toBeNull();
        expect(result!.index).toBe(fixture.index);
        expect(result!.text).toBe(fixture.phrase);
        expect(result!.time.getTime() - baseTime.getTime()).toBe(fixture.diff);
      });
    });
  });
}

export function applyFixturesNil(
  name: string,
  parse: ParseFn,
  fixtures: Fixture[],
  baseTime: Date
) {
  describe(name, () => {
    fixtures.forEach((fixture, i) => {
      it(`should not parse "${fixture.text}"`, () => {
        const result = parse(fixture.text, baseTime);
        expect(result).toBeNull();
      });
    });
  });
}

// Reference times matching Go tests
export const EN_NULL_TIME = new Date(Date.UTC(2016, 0, 6, 0, 0, 0)); // Jan 6, 2016 (Wednesday)
export const ZH_NULL_TIME = new Date(Date.UTC(2022, 2, 14, 0, 0, 0)); // Mar 14, 2022 (Monday)
export const COMMON_NULL_TIME = new Date(Date.UTC(2016, 6, 15, 0, 0, 0)); // Jul 15, 2016 (Friday)

// Time constants in milliseconds
export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
