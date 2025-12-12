import { describe } from "bun:test";
import { applyFixtures, applyFixturesNil, EN_NULL_TIME, HOUR, MINUTE } from "../../../test-utils";
import { when } from "../../../index";
import { hourMinute, hour } from "../index";

const NL_NULL_TIME = EN_NULL_TIME;

describe("nl.HourMinute", () => {
  const fixtok = [
    { text: "17:30u", index: 0, phrase: "17:30u", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "om 17:30 uur", index: 3, phrase: "17:30 uur", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "om 5:59 pm", index: 3, phrase: "5:59 pm", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "om 5:59 am", index: 3, phrase: "5:59 am", diff: (5 * HOUR) + (59 * MINUTE) },
  ];

  const fixtnil = [
    { text: "28:30pm", index: 0, phrase: "", diff: 0 },
    { text: "12:61u", index: 0, phrase: "", diff: 0 },
    { text: "24:10", index: 0, phrase: "", diff: 0 },
  ];

  const parse = when.create({ rules: [hourMinute("override")] });
  applyFixtures("nl.HourMinute", parse, fixtok, NL_NULL_TIME);
  applyFixturesNil("nl.HourMinute nil", parse, fixtnil, NL_NULL_TIME);
});

describe("nl.HourMinute|nl.Hour", () => {
  const fixtok = [
    { text: "17:30u", index: 0, phrase: "17:30u", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "om 17:30 uur", index: 3, phrase: "17:30 uur", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "om 5:59 pm", index: 3, phrase: "5:59 pm", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "om 5:59 am", index: 3, phrase: "5:59 am", diff: (5 * HOUR) + (59 * MINUTE) },
  ];

  const fixtnil = [
    { text: "28:30pm", index: 0, phrase: "", diff: 0 },
    { text: "12:61u", index: 0, phrase: "", diff: 0 },
    { text: "24:10", index: 0, phrase: "", diff: 0 },
  ];

  const parse = when.create({ rules: [hourMinute("override"), hour("skip")] });
  applyFixtures("nl.HourMinute|nl.Hour", parse, fixtok, NL_NULL_TIME);
  applyFixturesNil("nl.HourMinute|nl.Hour nil", parse, fixtnil, NL_NULL_TIME);
});

describe("nl.Hour|nl.HourMinute", () => {
  const fixtok = [
    { text: "17:30u", index: 0, phrase: "17:30u", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "om 17:30 uur", index: 3, phrase: "17:30 uur", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "om 5:59 pm", index: 3, phrase: "5:59 pm", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "om 5:59 am", index: 3, phrase: "5:59 am", diff: (5 * HOUR) + (59 * MINUTE) },
  ];

  const fixtnil = [
    { text: "28:30pm", index: 0, phrase: "", diff: 0 },
    { text: "12:61u", index: 0, phrase: "", diff: 0 },
    { text: "24:10", index: 0, phrase: "", diff: 0 },
  ];

  const parse = when.create({ rules: [hour("override"), hourMinute("override")] });
  applyFixtures("nl.Hour|nl.HourMinute", parse, fixtok, NL_NULL_TIME);
  applyFixturesNil("nl.Hour|nl.HourMinute nil", parse, fixtnil, NL_NULL_TIME);
});
