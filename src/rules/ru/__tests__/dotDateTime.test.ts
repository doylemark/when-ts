import { describe } from "bun:test";
import { applyFixtures, applyFixturesNil, EN_NULL_TIME } from "../../../test-utils";
import { when } from "../../../index";
import { dotDateTime } from "../index";

const RU_NULL_TIME = EN_NULL_TIME;

// Helper to calculate diff from RU_NULL_TIME (Jan 6, 2016 00:00:00 UTC)
function dateDiff(year: number, month: number, day: number, hour = 0, minute = 0): number {
  const target = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  return target - RU_NULL_TIME.getTime();
}

describe("ru.DotDateTime", () => {
  const fixtures = [
    { text: "встреча 15.01.2024 09:30", index: 15, phrase: "15.01.2024 09:30", diff: dateDiff(2024, 1, 15, 9, 30) },
    { text: "05.03.2025 15:00 запланирована встреча", index: 0, phrase: "05.03.2025 15:00", diff: dateDiff(2025, 3, 5, 15, 0) },
    { text: "31.12.2023 23:59", index: 0, phrase: "31.12.2023 23:59", diff: dateDiff(2023, 12, 31, 23, 59) },
  ];

  const parse = when.create({ rules: [dotDateTime("override")] });
  applyFixtures("ru.DotDateTime", parse, fixtures, RU_NULL_TIME);
});

describe("ru.DotDateTime nil", () => {
  const fixtures = [
    { text: "это текст без даты и времени", index: 0, phrase: "", diff: 0 },
    { text: "15.01", index: 0, phrase: "", diff: 0 },
    { text: "32.01.2024 15:00", index: 0, phrase: "", diff: 0 }, // invalid day
    { text: "15.13.2024 15:00", index: 0, phrase: "", diff: 0 }, // invalid month
  ];

  const parse = when.create({ rules: [dotDateTime("override")] });
  applyFixturesNil("ru.DotDateTime nil", parse, fixtures, RU_NULL_TIME);
});
