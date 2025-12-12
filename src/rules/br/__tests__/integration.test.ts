import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR, MINUTE } from "../../../test-utils";
import { when } from "../../../index";
import * as br from "../index";

const BR_NULL_TIME = EN_NULL_TIME;

describe("br.All Integration", () => {
  const fixtures = [
    { text: "hoje de noite às 11:10 pm", index: 0, phrase: "hoje de noite às 11:10 pm", diff: (23 * HOUR) + (10 * MINUTE) },
    { text: "na tarde de sexta", index: 3, phrase: "tarde de sexta", diff: ((2 * 24) + 15) * HOUR },
    { text: "na próxima terça às 14:00", index: 3, phrase: "próxima terça às 14:00", diff: ((6 * 24) + 14) * HOUR },
    { text: "na próxima terça às 2p", index: 3, phrase: "próxima terça às 2p", diff: ((6 * 24) + 14) * HOUR },
    { text: "na próxima quarta-feira às 2:25 p.m.", index: 3, phrase: "próxima quarta-feira às 2:25 p.m.", diff: (((7 * 24) + 14) * HOUR) + (25 * MINUTE) },
    { text: "11 am última terça", index: 0, phrase: "11 am última terça", diff: -13 * HOUR },
  ];

  const parse = when.create({ rules: br.all });
  applyFixtures("br.All", parse, fixtures, BR_NULL_TIME);
});
