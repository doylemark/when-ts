import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR, MINUTE } from "../../../test-utils";
import { when } from "../../../index";
import * as en from "../index";

describe("en.All Integration", () => {
  // Complex cases that test multiple rules together
  const fixtures = [
    { text: "tonight at 11:10 pm", index: 0, phrase: "tonight at 11:10 pm", diff: (23 * HOUR) + (10 * MINUTE) },
    { text: "at Friday afternoon", index: 3, phrase: "Friday afternoon", diff: ((2 * 24) + 15) * HOUR },
    { text: "in next tuesday at 14:00", index: 3, phrase: "next tuesday at 14:00", diff: ((6 * 24) + 14) * HOUR },
    { text: "in next tuesday at 2p", index: 3, phrase: "next tuesday at 2p", diff: ((6 * 24) + 14) * HOUR },
    { text: "in next wednesday at 2:25 p.m.", index: 3, phrase: "next wednesday at 2:25 p.m.", diff: (((7 * 24) + 14) * HOUR) + (25 * MINUTE) },
    { text: "at 11 am past tuesday", index: 3, phrase: "11 am past tuesday", diff: -13 * HOUR },
  ];

  const parse = when.create({ rules: en.all });
  applyFixtures("en.All", parse, fixtures, EN_NULL_TIME);
});
