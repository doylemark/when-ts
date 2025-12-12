import { describe } from "bun:test";
import { applyFixtures, ZH_NULL_TIME, DAY } from "../../../test-utils";
import { when } from "../../../index";
import { weekday } from "../index";

describe("zh.Weekday", () => {
  // March 14, 2022 is a Monday
  // Note: indices are UTF-8 byte positions (Chinese chars = 3 bytes each)
  const fixtures = [
    { text: "和你下周一吃饭", index: 6, phrase: "下周一", diff: 7 * DAY }, // "和你" = 2 chars * 3 bytes = 6
    { text: "下星期三", index: 0, phrase: "下星期三", diff: 9 * DAY },
    { text: "和小西本周三一起打羽毛球", index: 9, phrase: "本周三", diff: 2 * DAY }, // "和小西" = 3 chars * 3 bytes = 9
    { text: "这周三", index: 0, phrase: "这周三", diff: 2 * DAY },
    { text: "这礼拜四浇花", index: 0, phrase: "这礼拜四", diff: 3 * DAY },
    { text: "这星期 4", index: 0, phrase: "这星期 4", diff: 3 * DAY },
    { text: "和李星期这星期 4喝茶", index: 12, phrase: "这星期 4", diff: 3 * DAY }, // "和李星期" = 4 chars * 3 bytes = 12
    { text: "周日", index: 0, phrase: "周日", diff: 6 * DAY },
    { text: "下周日", index: 0, phrase: "下周日", diff: (6 + 7) * DAY },
    { text: "2下周天", index: 1, phrase: "下周天", diff: (6 + 7) * DAY }, // "2" = 1 byte
    { text: "上周三", index: 0, phrase: "上周三", diff: -5 * DAY },
    { text: "下个周三", index: 0, phrase: "下个周三", diff: (7 + 2) * DAY },
    { text: "1下个礼拜 3", index: 1, phrase: "下个礼拜 3", diff: (7 + 2) * DAY }, // "1" = 1 byte
    { text: "下下礼拜 3", index: 0, phrase: "下下礼拜 3", diff: (7 + 7 + 2) * DAY },
  ];

  const parse = when.create({ rules: [weekday("override")] });
  applyFixtures("zh.Weekday", parse, fixtures, ZH_NULL_TIME);
});
