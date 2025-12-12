import { describe } from "bun:test";
import { applyFixtures, applyFixturesNil, EN_NULL_TIME, DAY } from "../../../test-utils";
import { when } from "../../../index";
import { weekday } from "../index";

const RU_NULL_TIME = EN_NULL_TIME;

describe("ru.Weekday", () => {
  // Jan 6, 2016 is Wednesday
  const fixtures = [
    // past/last
    { text: "это нужно было сделать в прошлый Понедельник", index: 45, phrase: "прошлый Понедельник", diff: -2 * DAY },
    { text: "прошлая суббота", index: 0, phrase: "прошлая суббота", diff: -4 * DAY },
    { text: "прошлая пятница", index: 0, phrase: "прошлая пятница", diff: -5 * DAY },
    { text: "в последнюю среду", index: 3, phrase: "последнюю среду", diff: -7 * DAY },
    { text: "в прошлый вторник", index: 3, phrase: "прошлый вторник", diff: -DAY },
    // next
    { text: "в следующий вторник", index: 3, phrase: "следующий вторник", diff: 6 * DAY },
    { text: "напиши мне в следующую среду, договоримся", index: 23, phrase: "следующую среду", diff: 7 * DAY },
    { text: "следующая суббота", index: 0, phrase: "следующая суббота", diff: 3 * DAY },
    { text: "в следующую суббота", index: 3, phrase: "следующую суббота", diff: 3 * DAY },
    // this
    { text: "в этот вторник", index: 3, phrase: "этот вторник", diff: -DAY },
    { text: "напиши мне в эту среду, договоримся", index: 23, phrase: "эту среду", diff: 0 },
    { text: "эта суббота", index: 0, phrase: "эта суббота", diff: 3 * DAY },
    { text: "во вторник", index: 0, phrase: "во вторник", diff: 6 * DAY },
    { text: "в субботу", index: 0, phrase: "в субботу", diff: 3 * DAY },
  ];

  const parse = when.create({ rules: [weekday("override")] });
  applyFixtures("ru.Weekday", parse, fixtures, RU_NULL_TIME);
});

describe("ru.Weekday nil", () => {
  const fixtures = [
    { text: "завтра", index: 0, phrase: "", diff: 0 },
  ];

  const parse = when.create({ rules: [weekday("override")] });
  applyFixturesNil("ru.Weekday nil", parse, fixtures, RU_NULL_TIME);
});
