import { describe } from "bun:test";
import { applyFixtures, applyFixturesNil, EN_NULL_TIME, HOUR, MINUTE } from "../../../test-utils";
import { when } from "../../../index";
import { hourMinute, hour } from "../index";

const RU_NULL_TIME = EN_NULL_TIME;

describe("ru.Hour|ru.HourMinute", () => {
  const fixtok = [
    { text: "5:30вечера", index: 0, phrase: "5:30вечера", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "в 5:30 вечера", index: 3, phrase: "5:30 вечера", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "в 5:59 вечера", index: 3, phrase: "5:59 вечера", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "в 5-59 вечера", index: 3, phrase: "5-59 вечера", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "в 17-59 вечерело", index: 3, phrase: "17-59", diff: (17 * HOUR) + (59 * MINUTE) },
    { text: "до 11.10 вечера", index: 5, phrase: "11.10 вечера", diff: (23 * HOUR) + (10 * MINUTE) },
  ];

  const fixtnil = [
    { text: "28:30вечера", index: 0, phrase: "", diff: 0 },
    { text: "12:61вечера", index: 0, phrase: "", diff: 0 },
    { text: "24:10", index: 0, phrase: "", diff: 0 },
  ];

  const parse = when.create({ rules: [hour("override"), hourMinute("override")] });
  applyFixtures("ru.Hour|ru.HourMinute", parse, fixtok, RU_NULL_TIME);
  applyFixturesNil("ru.Hour|ru.HourMinute nil", parse, fixtnil, RU_NULL_TIME);
});

describe("ru.HourMinute|ru.Hour nil", () => {
  const fixtnil = [
    { text: "28:30вечера", index: 0, phrase: "", diff: 0 },
    { text: "12:61вечера", index: 0, phrase: "", diff: 0 },
    { text: "24:10", index: 0, phrase: "", diff: 0 },
  ];

  const parse = when.create({ rules: [hourMinute("override"), hour("skip")] });
  applyFixturesNil("ru.HourMinute|ru.Hour nil", parse, fixtnil, RU_NULL_TIME);
});
