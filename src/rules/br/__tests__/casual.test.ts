import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR, DAY } from "../../../test-utils";
import { when } from "../../../index";
import { casualDate, casualTime } from "../index";

// BR tests use same null time as EN (Jan 6, 2016)
const BR_NULL_TIME = EN_NULL_TIME;

describe("br.CasualDate", () => {
  const fixtures = [
    { text: "O prazo final é agora, ok", index: 17, phrase: "agora", diff: 0 },
    { text: "O prazo final é hoje", index: 17, phrase: "hoje", diff: 0 },
    { text: "O prazo final é esta noite", index: 17, phrase: "esta noite", diff: 23 * HOUR },
    { text: "O prazo final é amanhã à noite", index: 17, phrase: "amanhã ", diff: DAY },
    { text: "O prazo foi ontem à noite", index: 12, phrase: "ontem ", diff: -DAY },
  ];

  const parse = when.create({ rules: [casualDate("skip")] });
  applyFixtures("br.CasualDate", parse, fixtures, BR_NULL_TIME);
});

describe("br.CasualTime", () => {
  const fixtures = [
    { text: "O prazo foi esta manhã ", index: 12, phrase: "esta manhã", diff: 8 * HOUR },
    { text: "O prazo final foi ao meio-dia ", index: 18, phrase: "ao meio-dia", diff: 12 * HOUR },
    { text: "O prazo final foi esta tarde ", index: 18, phrase: "esta tarde", diff: 15 * HOUR },
    { text: "O prazo foi nesta noite ", index: 12, phrase: "nesta noite", diff: 18 * HOUR },
  ];

  const parse = when.create({ rules: [casualTime("skip")] });
  applyFixtures("br.CasualTime", parse, fixtures, BR_NULL_TIME);
});

describe("br.CasualDate|br.CasualTime", () => {
  const fixtures = [
    { text: "O prazo final é amanhã de tarde", index: 17, phrase: "amanhã de tarde", diff: (15 + 24) * HOUR },
  ];

  const parse = when.create({
    rules: [casualDate("skip"), casualTime("override")]
  });
  applyFixtures("br.CasualDate|br.CasualTime", parse, fixtures, BR_NULL_TIME);
});
