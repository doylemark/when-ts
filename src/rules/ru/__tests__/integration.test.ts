import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR, MINUTE, DAY } from "../../../test-utils";
import { when } from "../../../index";
import * as ru from "../index";

const RU_NULL_TIME = EN_NULL_TIME;

// Helper to calculate diff from RU_NULL_TIME (Jan 6, 2016 00:00:00 UTC)
function dateDiff(year: number, month: number, day: number, hour = 0, minute = 0): number {
  const target = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  return target - RU_NULL_TIME.getTime();
}

// For "31 декабря" without year, the Go test uses time.Now().Year()
// Since tests should be deterministic, we'll compute based on fixed reference
function decemberThirtyFirst(): number {
  // In Go test, this uses current year. We'll use a fixed approach.
  // The test expects the date to be Dec 31 of the current year relative to null time.
  // For 2016 (null year), Dec 31 2016 would be future from Jan 6.
  return dateDiff(2016, 12, 31);
}

describe("ru.All Integration", () => {
  const fixtures = [
    { text: "завтра в 11:10 вечера", index: 0, phrase: "завтра в 11:10 вечера", diff: (47 * HOUR) + (10 * MINUTE) },
    { text: "вечером в следующий понедельник", index: 0, phrase: "вечером в следующий понедельник", diff: ((5 * 24) + 18) * HOUR },
    { text: "вечером в прошлый понедельник", index: 0, phrase: "вечером в прошлый понедельник", diff: ((-2 * 24) + 18) * HOUR },
    { text: "в следующий понедельник вечером", index: 3, phrase: "следующий понедельник вечером", diff: ((5 * 24) + 18) * HOUR },
    { text: "в Пятницу после обеда", index: 0, phrase: "в Пятницу после обеда", diff: ((2 * 24) + 15) * HOUR },
    { text: "в следующий вторник в 14:00", index: 3, phrase: "следующий вторник в 14:00", diff: ((6 * 24) + 14) * HOUR },
    { text: "в следующий вторник в четыре вечера", index: 3, phrase: "следующий вторник в четыре вечера", diff: ((6 * 24) + 16) * HOUR },
    { text: "в следующую среду в 2:25 вечера", index: 3, phrase: "следующую среду в 2:25 вечера", diff: (((7 * 24) + 14) * HOUR) + (25 * MINUTE) },
    { text: "в 11 утра в прошлый вторник", index: 3, phrase: "11 утра в прошлый вторник", diff: -13 * HOUR },
    { text: "написать письмо во вторник после обеда", index: 30, phrase: "во вторник после обеда", diff: ((6 * 24) + 15) * HOUR },
    { text: "написать письмо ко вторнику", index: 30, phrase: "ко вторнику", diff: 6 * DAY },
    { text: "написать письмо до утра субботы ", index: 30, phrase: "до утра субботы", diff: ((3 * 24) + 8) * HOUR },
    { text: "написать письмо к субботе после обеда ", index: 30, phrase: "к субботе после обеда", diff: ((3 * 24) + 15) * HOUR },
    { text: "В субботу вечером", index: 0, phrase: "В субботу вечером", diff: ((3 * 24) + 18) * HOUR },
    { text: "встреча 15 января 2024", index: 15, phrase: "15 января 2024", diff: dateDiff(2024, 1, 15) },
    { text: "5 марта 2025 запланирована встреча", index: 0, phrase: "5 марта 2025", diff: dateDiff(2025, 3, 5) },
    { text: "31 декабря 2023", index: 0, phrase: "31 декабря 2023", diff: dateDiff(2023, 12, 31) },
    { text: "15 января 2024 в 9:30", index: 0, phrase: "15 января 2024 в 9:30", diff: dateDiff(2024, 1, 15, 9, 30) },
    { text: "5 марта 2025 в 15:00 запланирована встреча", index: 0, phrase: "5 марта 2025 в 15:00", diff: dateDiff(2025, 3, 5, 15, 0) },
    { text: "31 декабря 2023 в 23:59", index: 0, phrase: "31 декабря 2023 в 23:59", diff: dateDiff(2023, 12, 31, 23, 59) },
    { text: "31 декабря", index: 0, phrase: "31 декабря", diff: decemberThirtyFirst() },
    { text: "встреча 15.01.2024 09:30", index: 15, phrase: "15.01.2024 09:30", diff: dateDiff(2024, 1, 15, 9, 30) },
    { text: "05.03.2025 15:00 запланирована встреча", index: 0, phrase: "05.03.2025 15:00", diff: dateDiff(2025, 3, 5, 15, 0) },
    { text: "31.12.2023 23:59", index: 0, phrase: "31.12.2023 23:59", diff: dateDiff(2023, 12, 31, 23, 59) },
    { text: "31.12.2023", index: 0, phrase: "31.12.2023", diff: dateDiff(2023, 12, 31) },
  ];

  const parse = when.create({ rules: ru.all });
  applyFixtures("ru.All", parse, fixtures, RU_NULL_TIME);
});
