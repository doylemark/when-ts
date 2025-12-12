import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR } from "../../../test-utils";
import { when } from "../../../index";
import { exactMonthDate } from "../index";

const BR_NULL_TIME = EN_NULL_TIME;

describe("br.ExactMonthDate", () => {
  const fixtures = [
    { text: "3 de março", index: 0, phrase: "3 de março", diff: 1368 * HOUR },
    { text: "1 de setembro", index: 0, phrase: "1 de setembro", diff: 5736 * HOUR },
    { text: "1 set", index: 0, phrase: "1 set", diff: 5736 * HOUR },
    { text: "1 set.", index: 0, phrase: "1 set.", diff: 5736 * HOUR },
    { text: "1º de setembro", index: 0, phrase: "1º de setembro", diff: 5736 * HOUR },
    { text: "1º set.", index: 0, phrase: "1º set.", diff: 5736 * HOUR },
    { text: "7 de março", index: 0, phrase: "7 de março", diff: 1464 * HOUR },
    { text: "21 de outubro", index: 0, phrase: "21 de outubro", diff: 6936 * HOUR },
    { text: "vigésimo dia de dezembro", index: 0, phrase: "vigésimo dia de dezembro", diff: 8376 * HOUR },
    { text: "10º dia de março", index: 0, phrase: "10º dia de março", diff: 1536 * HOUR },
    { text: "4 jan.", index: 0, phrase: "4 jan.", diff: -48 * HOUR },
    { text: "fevereiro", index: 0, phrase: "fevereiro", diff: 744 * HOUR },
    { text: "outubro", index: 0, phrase: "outubro", diff: 6576 * HOUR },
    { text: "jul.", index: 0, phrase: "jul.", diff: 4368 * HOUR },
    { text: "junho", index: 0, phrase: "junho", diff: 3648 * HOUR },
  ];

  const parse = when.create({ rules: [exactMonthDate("override")] });
  applyFixtures("br.ExactMonthDate", parse, fixtures, BR_NULL_TIME);
});
