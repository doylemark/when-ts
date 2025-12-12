import { describe } from "bun:test";
import { applyFixtures, applyFixturesNil, COMMON_NULL_TIME, DAY } from "../../../test-utils";
import { when } from "../../../index";
import { slashDMY } from "../index";

describe("common.SlashDMY", () => {
  // Reference: Jul 15, 2016 (Friday), which is day 197 of the year
  // 2016 is a leap year
  const OFFSET = 197;

  const fixtures = [
    { text: "The Deadline is 10/10/2016", index: 16, phrase: "10/10/2016", diff: (284 - OFFSET) * DAY },
    { text: "The Deadline is 1/2/2016", index: 16, phrase: "1/2/2016", diff: (32 - OFFSET) * DAY },
    { text: "The Deadline is 29/2/2016", index: 16, phrase: "29/2/2016", diff: (60 - OFFSET) * DAY },
    // next year
    { text: "The Deadline is 28/2", index: 16, phrase: "28/2", diff: (59 + 366 - OFFSET) * DAY },
    { text: "The Deadline is 28/02/2017", index: 16, phrase: "28/02/2017", diff: (59 + 366 - OFFSET) * DAY },
    // right after w/o a year
    { text: "The Deadline is 28/07", index: 16, phrase: "28/07", diff: (210 - OFFSET) * DAY },
    // before w/o a year
    { text: "The Deadline is 30/06", index: 16, phrase: "30/06", diff: (181 + 366 - OFFSET) * DAY },
    // prev day will be added to the future
    { text: "The Deadline is 14/07", index: 16, phrase: "14/07", diff: (195 + 366 - OFFSET) * DAY },
  ];

  const nilFixtures = [
    { text: "The Deadline is 1/20/2016", index: 16, phrase: "no match for mm/dd/yyyy", diff: 0 },
  ];

  const parse = when.create({ rules: [slashDMY("skip")] });

  applyFixtures("common.SlashDMY", parse, fixtures, COMMON_NULL_TIME);
  applyFixturesNil("common.SlashDMY nil", parse, nilFixtures, COMMON_NULL_TIME);
});
