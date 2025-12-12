import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR, DAY } from "../../../test-utils";
import { when } from "../../../index";
import { weekday } from "../index";

describe("en.Weekday", () => {
  // Jan 6, 2016 is Wednesday (weekday 3)
  const fixtures = [
    // past/last
    { text: "do it for the past Monday", index: 14, phrase: "past Monday", diff: -2 * DAY },
    { text: "past saturday", index: 0, phrase: "past saturday", diff: -4 * DAY },
    { text: "past friday", index: 0, phrase: "past friday", diff: -5 * DAY },
    { text: "past wednesday", index: 0, phrase: "past wednesday", diff: -7 * DAY },
    { text: "past tuesday", index: 0, phrase: "past tuesday", diff: -DAY },
    // next
    { text: "next tuesday", index: 0, phrase: "next tuesday", diff: 6 * DAY },
    { text: "drop me a line at next wednesday", index: 18, phrase: "next wednesday", diff: 7 * DAY },
    { text: "next saturday", index: 0, phrase: "next saturday", diff: 3 * DAY },
    // this
    { text: "this tuesday", index: 0, phrase: "this tuesday", diff: -DAY },
    { text: "drop me a line at this wednesday", index: 18, phrase: "this wednesday", diff: 0 },
    { text: "this saturday", index: 0, phrase: "this saturday", diff: 3 * DAY },
  ];

  const parse = when.create({ rules: [weekday("override")] });
  applyFixtures("en.Weekday", parse, fixtures, EN_NULL_TIME);
});
