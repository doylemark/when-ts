import { describe } from "bun:test";
import { applyFixtures, applyFixturesNil, EN_NULL_TIME, HOUR, MINUTE } from "../../../test-utils";
import { when } from "../../../index";
import { hourMinute, hour } from "../index";

const BR_NULL_TIME = EN_NULL_TIME;

describe("br.HourMinute", () => {
  const fixtok = [
    { text: "5:30pm", index: 0, phrase: "5:30pm", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "at 5:30 pm", index: 3, phrase: "5:30 pm", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "at 5:59 pm", index: 3, phrase: "5:59 pm", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "at 5-59 pm", index: 3, phrase: "5-59 pm", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "at 17-59 pam", index: 3, phrase: "17-59", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "up to 11:10 pm", index: 6, phrase: "11:10 pm", diff: (23 * HOUR) + (10 * MINUTE) },
    { text: "19h35m", index: 0, phrase: "19h35", diff: (19 * HOUR) + (35 * MINUTE) },
  ];

  const fixtnil = [
    { text: "28:30pm", index: 0, phrase: "", diff: 0 },
    { text: "12:61pm", index: 0, phrase: "", diff: 0 },
    { text: "24:10", index: 0, phrase: "", diff: 0 },
  ];

  const parse = when.create({ rules: [hourMinute("override")] });
  applyFixtures("br.HourMinute", parse, fixtok, BR_NULL_TIME);
  applyFixturesNil("br.HourMinute nil", parse, fixtnil, BR_NULL_TIME);
});

describe("br.HourMinute|br.Hour", () => {
  const fixtok = [
    { text: "5:30pm", index: 0, phrase: "5:30pm", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "at 5:30 pm", index: 3, phrase: "5:30 pm", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "at 5:59 pm", index: 3, phrase: "5:59 pm", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "at 5-59 pm", index: 3, phrase: "5-59 pm", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "at 17-59 pam", index: 3, phrase: "17-59", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "up to 11:10 pm", index: 6, phrase: "11:10 pm", diff: (23 * HOUR) + (10 * MINUTE) },
    { text: "19h35m", index: 0, phrase: "19h35", diff: (19 * HOUR) + (35 * MINUTE) },
  ];

  const fixtnil = [
    { text: "28:30pm", index: 0, phrase: "", diff: 0 },
    { text: "12:61pm", index: 0, phrase: "", diff: 0 },
    { text: "24:10", index: 0, phrase: "", diff: 0 },
  ];

  const parse = when.create({ rules: [hourMinute("override"), hour("skip")] });
  applyFixtures("br.HourMinute|br.Hour", parse, fixtok, BR_NULL_TIME);
  applyFixturesNil("br.HourMinute|br.Hour nil", parse, fixtnil, BR_NULL_TIME);
});

describe("br.Hour|br.HourMinute", () => {
  const fixtok = [
    { text: "5:30pm", index: 0, phrase: "5:30pm", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "at 5:30 pm", index: 3, phrase: "5:30 pm", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "at 5:59 pm", index: 3, phrase: "5:59 pm", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "at 5-59 pm", index: 3, phrase: "5-59 pm", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "at 17-59 pam", index: 3, phrase: "17-59", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "up to 11:10 pm", index: 6, phrase: "11:10 pm", diff: (23 * HOUR) + (10 * MINUTE) },
    { text: "19h35m", index: 0, phrase: "19h35", diff: (19 * HOUR) + (35 * MINUTE) },
  ];

  const fixtnil = [
    { text: "28:30pm", index: 0, phrase: "", diff: 0 },
    { text: "12:61pm", index: 0, phrase: "", diff: 0 },
    { text: "24:10", index: 0, phrase: "", diff: 0 },
  ];

  const parse = when.create({ rules: [hour("override"), hourMinute("override")] });
  applyFixtures("br.Hour|br.HourMinute", parse, fixtok, BR_NULL_TIME);
  applyFixturesNil("br.Hour|br.HourMinute nil", parse, fixtnil, BR_NULL_TIME);
});
