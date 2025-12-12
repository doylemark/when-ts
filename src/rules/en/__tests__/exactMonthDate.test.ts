import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR } from "../../../test-utils";
import { when } from "../../../index";
import { exactMonthDate } from "../index";

describe("en.ExactMonthDate", () => {
  // Reference: Jan 6, 2016 (Wednesday)
  const fixtures = [
    { text: "third of march", index: 0, phrase: "third of march", diff: 1368 * HOUR },
    { text: "march third", index: 0, phrase: "march third", diff: 1368 * HOUR },
    { text: "march 3rd", index: 0, phrase: "march 3rd", diff: 1368 * HOUR },
    { text: "3rd march", index: 0, phrase: "3rd march", diff: 1368 * HOUR },
    { text: "march 3", index: 0, phrase: "march 3", diff: 1368 * HOUR },
    { text: "1 september", index: 0, phrase: "1 september", diff: 5736 * HOUR },
    { text: "1 sept", index: 0, phrase: "1 sept", diff: 5736 * HOUR },
    { text: "1 sept.", index: 0, phrase: "1 sept.", diff: 5736 * HOUR },
    { text: "1st of september", index: 0, phrase: "1st of september", diff: 5736 * HOUR },
    { text: "sept. 1st", index: 0, phrase: "sept. 1st", diff: 5736 * HOUR },
    { text: "march 7th", index: 0, phrase: "march 7th", diff: 1464 * HOUR },
    { text: "october 21st", index: 0, phrase: "october 21st", diff: 6936 * HOUR },
    { text: "twentieth of december", index: 0, phrase: "twentieth of december", diff: 8376 * HOUR },
    { text: "march 10th", index: 0, phrase: "march 10th", diff: 1536 * HOUR },
    { text: "jan. 4", index: 0, phrase: "jan. 4", diff: -48 * HOUR },
    { text: "february", index: 0, phrase: "february", diff: 744 * HOUR },
    { text: "october", index: 0, phrase: "october", diff: 6576 * HOUR },
    { text: "jul.", index: 0, phrase: "jul.", diff: 4368 * HOUR },
    { text: "june", index: 0, phrase: "june", diff: 3648 * HOUR },
  ];

  const parse = when.create({ rules: [exactMonthDate("override")] });
  applyFixtures("en.ExactMonthDate", parse, fixtures, EN_NULL_TIME);
});
