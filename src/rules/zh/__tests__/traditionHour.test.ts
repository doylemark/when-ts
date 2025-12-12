import { describe } from "bun:test";
import { applyFixtures, ZH_NULL_TIME, HOUR, MINUTE } from "../../../test-utils";
import { when } from "../../../index";
import { traditionHour } from "../index";

describe("zh.TraditionHour", () => {
  // Note: indices are UTF-8 byte positions (Chinese chars = 3 bytes each)
  const fixtures = [
    { text: "午 时123", index: 0, phrase: "午 时", diff: 11 * HOUR },
    { text: "子时", index: 0, phrase: "子时", diff: 23 * HOUR },
    { text: "午时太阳正好", index: 0, phrase: "午时", diff: 11 * HOUR },
    { text: "我们在酉时喝一杯吧", index: 9, phrase: "酉时", diff: 17 * HOUR }, // "我们在" = 3 chars * 3 bytes = 9
    { text: "午时三刻问斩", index: 0, phrase: "午时三刻", diff: 11 * HOUR + 45 * MINUTE },
    { text: "午时四刻吃饭", index: 0, phrase: "午时四刻", diff: 12 * HOUR },
    { text: "戌时1刻", index: 0, phrase: "戌时1刻", diff: 19 * HOUR + 15 * MINUTE },
  ];

  const parse = when.create({ rules: [traditionHour("override")] });
  applyFixtures("zh.TraditionHour", parse, fixtures, ZH_NULL_TIME);
});
