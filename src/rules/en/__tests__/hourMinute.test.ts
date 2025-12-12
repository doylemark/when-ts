import { describe } from "bun:test";
import { applyFixtures, applyFixturesNil, EN_NULL_TIME, HOUR, MINUTE } from "../../../test-utils";
import { when } from "../../../index";
import { hourMinute, hour } from "../index";

describe("en.HourMinute", () => {
  const fixtok = [
    { text: "5:30pm", index: 0, phrase: "5:30pm", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "at 5:30 pm", index: 3, phrase: "5:30 pm", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "at 5:59 pm", index: 3, phrase: "5:59 pm", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "at 5-59 pm", index: 3, phrase: "5-59 pm", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "at 17-59 pam", index: 3, phrase: "17-59", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "up to 11:10 pm", index: 6, phrase: "11:10 pm", diff: (23 * HOUR) + (10 * MINUTE) },
  ];

  const fixtnil = [
    { text: "28:30pm", index: 0, phrase: "", diff: 0 },
    { text: "12:61pm", index: 0, phrase: "", diff: 0 },
    { text: "24:10", index: 0, phrase: "", diff: 0 },
  ];

  const parse = when.create({ rules: [hourMinute("override")] });
  applyFixtures("en.HourMinute", parse, fixtok, EN_NULL_TIME);
  applyFixturesNil("en.HourMinute nil", parse, fixtnil, EN_NULL_TIME);
});

describe("en.HourMinute|en.Hour", () => {
  const fixtok = [
    { text: "5:30pm", index: 0, phrase: "5:30pm", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "at 5:30 pm", index: 3, phrase: "5:30 pm", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "at 5:59 pm", index: 3, phrase: "5:59 pm", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "at 5-59 pm", index: 3, phrase: "5-59 pm", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "at 17-59 pam", index: 3, phrase: "17-59", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "up to 11:10 pm", index: 6, phrase: "11:10 pm", diff: (23 * HOUR) + (10 * MINUTE) },
  ];

  const fixtnil = [
    { text: "28:30pm", index: 0, phrase: "", diff: 0 },
    { text: "12:61pm", index: 0, phrase: "", diff: 0 },
    { text: "24:10", index: 0, phrase: "", diff: 0 },
  ];

  const parse = when.create({ rules: [hourMinute("override"), hour("skip")] });
  applyFixtures("en.HourMinute|en.Hour", parse, fixtok, EN_NULL_TIME);
  applyFixturesNil("en.HourMinute|en.Hour nil", parse, fixtnil, EN_NULL_TIME);
});

describe("en.Hour|en.HourMinute", () => {
  const fixtok = [
    { text: "5:30pm", index: 0, phrase: "5:30pm", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "at 5:30 pm", index: 3, phrase: "5:30 pm", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "at 5:59 pm", index: 3, phrase: "5:59 pm", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "at 5-59 pm", index: 3, phrase: "5-59 pm", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "at 17-59 pam", index: 3, phrase: "17-59", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "up to 11:10 pm", index: 6, phrase: "11:10 pm", diff: (23 * HOUR) + (10 * MINUTE) },
  ];

  const fixtnil = [
    { text: "28:30pm", index: 0, phrase: "", diff: 0 },
    { text: "12:61pm", index: 0, phrase: "", diff: 0 },
    { text: "24:10", index: 0, phrase: "", diff: 0 },
  ];

  const parse = when.create({ rules: [hour("override"), hourMinute("override")] });
  applyFixtures("en.Hour|en.HourMinute", parse, fixtok, EN_NULL_TIME);
  applyFixturesNil("en.Hour|en.HourMinute nil", parse, fixtnil, EN_NULL_TIME);
});
