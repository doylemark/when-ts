import { describe } from "bun:test";
import { applyFixtures, ZH_NULL_TIME, HOUR, MINUTE } from "../../../test-utils";
import { when } from "../../../index";
import { hourMinute } from "../index";

describe("zh.HourMinute", () => {
  // Note: indices are UTF-8 byte positions (Chinese chars = 3 bytes each)
  const fixtures = [
    { text: "上午 11:30", index: 0, phrase: "上午 11:30", diff: 11 * HOUR + 30 * MINUTE },
    { text: "下午 3:30", index: 0, phrase: "下午 3:30", diff: 15 * HOUR + 30 * MINUTE },
    { text: "下午 3点半", index: 0, phrase: "下午 3点半", diff: 15 * HOUR + 30 * MINUTE },
    { text: "凌晨 3点半", index: 0, phrase: "凌晨 3点半", diff: 3 * HOUR + 30 * MINUTE },
    { text: "晚上8:00", index: 0, phrase: "晚上8:00", diff: 20 * HOUR },
    { text: "晚上9:32", index: 0, phrase: "晚上9:32", diff: 21 * HOUR + 32 * MINUTE },
    { text: "晚 上 8:00", index: 0, phrase: "晚 上 8:00", diff: 20 * HOUR },
    { text: "晚上 8 点干啥去", index: 0, phrase: "晚上 8 点", diff: 20 * HOUR },
    { text: "他俩凌晨 3点去散步太可怕了", index: 6, phrase: "凌晨 3点", diff: 3 * HOUR }, // "他俩" = 2 chars * 3 bytes = 6
    { text: "早晨八点一刻", index: 0, phrase: "早晨八点一刻", diff: 8 * HOUR + 15 * MINUTE },
    { text: "早上八点半", index: 0, phrase: "早上八点半", diff: 8 * HOUR + 30 * MINUTE },
    { text: "今晚八点", index: 0, phrase: "今晚八点", diff: 20 * HOUR },
    { text: "今晚八点半", index: 0, phrase: "今晚八点半", diff: 20 * HOUR + 30 * MINUTE },
  ];

  const parse = when.create({ rules: [hourMinute("override")] });
  applyFixtures("zh.HourMinute", parse, fixtures, ZH_NULL_TIME);
});
