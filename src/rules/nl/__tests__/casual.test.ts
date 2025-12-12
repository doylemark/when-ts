import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR, DAY } from "../../../test-utils";
import { when } from "../../../index";
import { casualDate, casualTime } from "../index";

// NL tests use same null time as EN (Jan 6, 2016)
const NL_NULL_TIME = EN_NULL_TIME;

describe("nl.CasualDate", () => {
  const fixtures = [
    { text: "De deadline is nu, ok", index: 15, phrase: "nu", diff: 0 },
    { text: "De deadline is vandaag", index: 15, phrase: "vandaag", diff: 0 },
    { text: "De deadline is vannacht", index: 15, phrase: "vannacht", diff: 23 * HOUR },
    { text: "De deadline is morgenavond", index: 15, phrase: "morgenavond", diff: (18 + 24) * HOUR },
    { text: "De deadline is gisteravond", index: 15, phrase: "gisteravond", diff: -((24 - 18) * HOUR) },
    { text: "De deadline is gisteren", index: 15, phrase: "gisteren", diff: -DAY },
  ];

  const parse = when.create({ rules: [casualDate("skip")] });
  applyFixtures("nl.CasualDate", parse, fixtures, NL_NULL_TIME);
});

describe("nl.CasualTime", () => {
  const fixtures = [
    { text: "De deadline was deze morgen", index: 16, phrase: "deze morgen", diff: 8 * HOUR },
    { text: "De deadline was tussen de middag", index: 16, phrase: "tussen de middag", diff: 12 * HOUR },
    { text: "De deadline was deze middag", index: 16, phrase: "deze middag", diff: 15 * HOUR },
    { text: "De deadline was deze avond", index: 16, phrase: "deze avond", diff: 18 * HOUR },
    { text: "De deadline is donderdagavond", index: 15, phrase: "donderdagavond", diff: (18 + 24) * HOUR },
    { text: "De deadline is vrijdagavond", index: 15, phrase: "vrijdagavond", diff: (18 + 24 * 2) * HOUR },
  ];

  const parse = when.create({ rules: [casualTime("skip")] });
  applyFixtures("nl.CasualTime", parse, fixtures, NL_NULL_TIME);
});

describe("nl.CasualDate|nl.CasualTime", () => {
  const fixtures = [
    { text: "De deadline is morgenmiddag", index: 15, phrase: "morgenmiddag", diff: (15 + 24) * HOUR },
    { text: "De deadline is morgenavond", index: 15, phrase: "morgenavond", diff: (18 + 24) * HOUR },
  ];

  const parse = when.create({
    rules: [casualDate("skip"), casualTime("override")]
  });
  applyFixtures("nl.CasualDate|nl.CasualTime", parse, fixtures, NL_NULL_TIME);
});
