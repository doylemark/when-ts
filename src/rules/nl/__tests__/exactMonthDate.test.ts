import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR } from "../../../test-utils";
import { when } from "../../../index";
import { exactMonthDate } from "../index";

const NL_NULL_TIME = EN_NULL_TIME;

describe("nl.ExactMonthDate", () => {
  const fixtures = [
    { text: "derde van maart", index: 0, phrase: "derde van maart", diff: 1368 * HOUR },
    { text: "3e van maart", index: 0, phrase: "3e van maart", diff: 1368 * HOUR },
    { text: "1 september", index: 0, phrase: "1 september", diff: 5736 * HOUR },
    { text: "1 sept", index: 0, phrase: "1 sept", diff: 5736 * HOUR },
    { text: "1 sept.", index: 0, phrase: "1 sept.", diff: 5736 * HOUR },
    { text: "1e van september", index: 0, phrase: "1e van september", diff: 5736 * HOUR },
    { text: "twintigste van december", index: 0, phrase: "twintigste van december", diff: 8376 * HOUR },
    { text: "februari", index: 0, phrase: "februari", diff: 744 * HOUR },
    { text: "oktober", index: 0, phrase: "oktober", diff: 6576 * HOUR },
    { text: "jul.", index: 0, phrase: "jul.", diff: 4368 * HOUR },
    { text: "juni", index: 0, phrase: "juni", diff: 3648 * HOUR },
  ];

  const parse = when.create({ rules: [exactMonthDate("override")] });
  applyFixtures("nl.ExactMonthDate", parse, fixtures, NL_NULL_TIME);
});
