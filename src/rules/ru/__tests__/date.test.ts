import { describe } from "bun:test";
import { applyFixtures, applyFixturesNil, EN_NULL_TIME } from "../../../test-utils";
import { when } from "../../../index";
import { date } from "../index";

const RU_NULL_TIME = EN_NULL_TIME;

// Helper to calculate diff from RU_NULL_TIME (Jan 6, 2016 00:00:00 UTC)
function dateDiff(year: number, month: number, day: number, hour = 0, minute = 0): number {
  const target = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  return target - RU_NULL_TIME.getTime();
}

describe("ru.Date", () => {
  const fixtures = [
    // Simple dates
    { text: "встреча 15 января 2024", index: 15, phrase: "15 января 2024", diff: dateDiff(2024, 1, 15) },
    { text: "5 марта 2025 запланирована встреча", index: 0, phrase: "5 марта 2025", diff: dateDiff(2025, 3, 5) },
    { text: "31 декабря 2023", index: 0, phrase: "31 декабря 2023", diff: dateDiff(2023, 12, 31) },
    // Dates with time
    { text: "15 января 2024 в 9:30", index: 0, phrase: "15 января 2024 в 9:30", diff: dateDiff(2024, 1, 15, 9, 30) },
    { text: "5 марта 2025 в 15:00 запланирована встреча", index: 0, phrase: "5 марта 2025 в 15:00", diff: dateDiff(2025, 3, 5, 15, 0) },
    { text: "31 декабря 2023 в 23:59", index: 0, phrase: "31 декабря 2023 в 23:59", diff: dateDiff(2023, 12, 31, 23, 59) },
  ];

  const parse = when.create({ rules: [date("override")] });
  applyFixtures("ru.Date", parse, fixtures, RU_NULL_TIME);
});

describe("ru.Date nil", () => {
  const fixtures = [
    { text: "это текст без даты", index: 0, phrase: "", diff: 0 },
    { text: "15", index: 0, phrase: "", diff: 0 },
    { text: "15 чего-то", index: 0, phrase: "", diff: 0 },
  ];

  const parse = when.create({ rules: [date("override")] });
  applyFixturesNil("ru.Date nil", parse, fixtures, RU_NULL_TIME);
});
