import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR, DAY } from "../../../test-utils";
import { when } from "../../../index";
import { casualDate, casualTime } from "../index";

describe("en.CasualDate", () => {
  const fixtures = [
    { text: "The Deadline is now, ok", index: 16, phrase: "now", diff: 0 },
    { text: "The Deadline is today", index: 16, phrase: "today", diff: 0 },
    { text: "The Deadline is tonight", index: 16, phrase: "tonight", diff: 23 * HOUR },
    { text: "The Deadline is tomorrow evening", index: 16, phrase: "tomorrow", diff: DAY },
    { text: "The Deadline is yesterday evening", index: 16, phrase: "yesterday", diff: -DAY },
  ];

  const parse = when.create({ rules: [casualDate("skip")] });
  applyFixtures("en.CasualDate", parse, fixtures, EN_NULL_TIME);
});

describe("en.CasualTime", () => {
  const fixtures = [
    { text: "The Deadline was this morning ", index: 17, phrase: "this morning", diff: 8 * HOUR },
    { text: "The Deadline was this noon ", index: 17, phrase: "this noon", diff: 12 * HOUR },
    { text: "The Deadline was this afternoon ", index: 17, phrase: "this afternoon", diff: 15 * HOUR },
    { text: "The Deadline was this evening ", index: 17, phrase: "this evening", diff: 18 * HOUR },
  ];

  const parse = when.create({ rules: [casualTime("skip")] });
  applyFixtures("en.CasualTime", parse, fixtures, EN_NULL_TIME);
});

describe("en.CasualDate|en.CasualTime", () => {
  const fixtures = [
    { text: "The Deadline is tomorrow this afternoon ", index: 16, phrase: "tomorrow this afternoon", diff: (15 + 24) * HOUR },
  ];

  const parse = when.create({
    rules: [casualDate("skip"), casualTime("override")]
  });
  applyFixtures("en.CasualDate|en.CasualTime", parse, fixtures, EN_NULL_TIME);
});
