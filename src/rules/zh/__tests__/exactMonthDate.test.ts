import { describe } from "bun:test";
import { applyFixtures, applyFixturesNil, ZH_NULL_TIME, DAY, HOUR } from "../../../test-utils";
import { when } from "../../../index";
import { exactMonthDate } from "../index";

describe("zh.ExactMonthDate", () => {
  // March 14, 2022 is a Monday
  const fixtures = [
    { text: "4月1日", index: 0, phrase: "4月1日", diff: 18 * DAY },
    { text: "4月2日", index: 0, phrase: "4月2日", diff: 19 * DAY },
    { text: "4月 2日", index: 0, phrase: "4月 2日", diff: 19 * DAY },
    { text: "4 月 2 日", index: 0, phrase: "4 月 2 日", diff: 19 * DAY },
    { text: "四月一日", index: 0, phrase: "四月一日", diff: 18 * DAY },
    { text: "四月1日", index: 0, phrase: "四月1日", diff: 18 * DAY },
    { text: "四月", index: 0, phrase: "四月", diff: 18 * DAY },
    { text: "十一月一日", index: 0, phrase: "十一月一日", diff: 5568 * HOUR },
    { text: "四月三十日", index: 0, phrase: "四月三十日", diff: 1128 * HOUR },
    { text: "4月30日", index: 0, phrase: "4月30日", diff: 1128 * HOUR },
    { text: "5月1号", index: 0, phrase: "5月1号", diff: 1152 * HOUR },
    { text: "5/1", index: 0, phrase: "5/1", diff: 1152 * HOUR },
    { text: "5月1日", index: 0, phrase: "5月1日", diff: 1152 * HOUR },
    { text: "五月", index: 0, phrase: "五月", diff: 1152 * HOUR },
    { text: "12号", index: 0, phrase: "12号", diff: -2 * DAY },
  ];

  const parse = when.create({ rules: [exactMonthDate("override")] });
  applyFixtures("zh.ExactMonthDate", parse, fixtures, ZH_NULL_TIME);
});

describe("zh.ExactMonthDate nil", () => {
  const fixtures = [
    { text: "41", index: 0, phrase: "", diff: 18 * DAY },
  ];

  const parse = when.create({ rules: [exactMonthDate("override")] });
  applyFixturesNil("zh.ExactMonthDate nil", parse, fixtures, ZH_NULL_TIME);
});
