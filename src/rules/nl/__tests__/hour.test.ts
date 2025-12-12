import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR } from "../../../test-utils";
import { when } from "../../../index";
import { hour } from "../index";

const NL_NULL_TIME = EN_NULL_TIME;

describe("nl.Hour", () => {
  const fixtures = [
    { text: "5pm", index: 0, phrase: "5pm", diff: 17 * HOUR },
    { text: "5 uur in de avond", index: 0, phrase: "5 uur in de avond", diff: 17 * HOUR },
    { text: "5 uur 's avonds", index: 0, phrase: "5 uur 's avonds", diff: 17 * HOUR },
    { text: "om 17 uur", index: 3, phrase: "17 uur", diff: 17 * HOUR },
    { text: "om 5 P.", index: 3, phrase: "5 P.", diff: 17 * HOUR },
    { text: "om 12 P.", index: 3, phrase: "12 P.", diff: 12 * HOUR },
    { text: "om 1 P.", index: 3, phrase: "1 P.", diff: 13 * HOUR },
    { text: "om 5 am", index: 3, phrase: "5 am", diff: 5 * HOUR },
    { text: "om 5A", index: 3, phrase: "5A", diff: 5 * HOUR },
    { text: "om 5A.", index: 3, phrase: "5A.", diff: 5 * HOUR },
    { text: "5A.", index: 0, phrase: "5A.", diff: 5 * HOUR },
    { text: "11 P.M.", index: 0, phrase: "11 P.M.", diff: 23 * HOUR },
  ];

  const parse = when.create({ rules: [hour("override")] });
  applyFixtures("nl.Hour", parse, fixtures, NL_NULL_TIME);
});
