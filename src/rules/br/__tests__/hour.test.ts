import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR } from "../../../test-utils";
import { when } from "../../../index";
import { hour } from "../index";

const BR_NULL_TIME = EN_NULL_TIME;

describe("br.Hour", () => {
  const fixtures = [
    { text: "5pm", index: 0, phrase: "5pm", diff: 17 * HOUR },
    { text: "at 5 pm", index: 3, phrase: "5 pm", diff: 17 * HOUR },
    { text: "at 5 P.", index: 3, phrase: "5 P.", diff: 17 * HOUR },
    { text: "at 12 P.", index: 3, phrase: "12 P.", diff: 12 * HOUR },
    { text: "at 1 P.", index: 3, phrase: "1 P.", diff: 13 * HOUR },
    { text: "at 5 am", index: 3, phrase: "5 am", diff: 5 * HOUR },
    { text: "at 5A", index: 3, phrase: "5A", diff: 5 * HOUR },
    { text: "at 5A.", index: 3, phrase: "5A.", diff: 5 * HOUR },
    { text: "5A.", index: 0, phrase: "5A.", diff: 5 * HOUR },
    { text: "11 P.M.", index: 0, phrase: "11 P.M.", diff: 23 * HOUR },
  ];

  const parse = when.create({ rules: [hour("override")] });
  applyFixtures("br.Hour", parse, fixtures, BR_NULL_TIME);
});
