import { describe } from "bun:test";
import { applyFixtures, ZH_NULL_TIME, DAY, HOUR } from "../../../test-utils";
import { when } from "../../../index";
import { casualDate } from "../index";

describe("zh.CasualDate", () => {
  // March 14, 2022 is a Monday
  // "后年" uses .AddDate(2, 0, 0) which adds 2 years
  const twoYearsMs = Date.UTC(2024, 2, 14) - Date.UTC(2022, 2, 14);

  const fixtures = [
    { text: "后天中午", index: 0, phrase: "后天", diff: 2 * DAY },
    { text: "大后天中午", index: 0, phrase: "大后天", diff: 3 * DAY },
    { text: "昨天", index: 0, phrase: "昨天", diff: -DAY },
    { text: "前天", index: 0, phrase: "前天", diff: -2 * DAY },
    { text: "大前天", index: 0, phrase: "大前天", diff: -3 * DAY },
    { text: "下月", index: 0, phrase: "下月", diff: 31 * DAY },
    { text: "下个月", index: 0, phrase: "下个月", diff: 31 * DAY },
    { text: "下下月", index: 0, phrase: "下下月", diff: (31 + 30) * DAY },
    { text: "下下个月", index: 0, phrase: "下下个月", diff: (31 + 30) * DAY },
    { text: "明年", index: 0, phrase: "明年", diff: 365 * DAY },
    { text: "后年", index: 0, phrase: "后年", diff: twoYearsMs },
    { text: "下月6号", index: 0, phrase: "下月6号", diff: 552 * HOUR },
  ];

  const parse = when.create({ rules: [casualDate("override")] });
  applyFixtures("zh.CasualDate", parse, fixtures, ZH_NULL_TIME);
});
