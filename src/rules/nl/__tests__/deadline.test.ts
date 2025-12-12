import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, SECOND, MINUTE, HOUR, DAY, WEEK } from "../../../test-utils";
import { when } from "../../../index";
import { deadline } from "../index";

const NL_NULL_TIME = EN_NULL_TIME;

describe("nl.Deadline", () => {
  const fixtures = [
    { text: "binnen een half uur", index: 0, phrase: "binnen een half uur", diff: HOUR / 2 },
    { text: "binnen 1 uur", index: 0, phrase: "binnen 1 uur", diff: HOUR },
    { text: "in 5 minuten", index: 0, phrase: "in 5 minuten", diff: 5 * MINUTE },
    { text: "Binnen 5 minuten ga ik naar huis", index: 0, phrase: "Binnen 5 minuten", diff: 5 * MINUTE },
    { text: "we moeten binnen 10 dagen iets doen", index: 10, phrase: "binnen 10 dagen", diff: 10 * DAY },
    { text: "we moeten binnen vijf dagen iets doen", index: 10, phrase: "binnen vijf dagen", diff: 5 * DAY },
    { text: "we moeten over 5 dagen iets doen", index: 10, phrase: "over 5 dagen", diff: 5 * DAY },
    { text: "In 5 seconde moet een auto verplaatsen", index: 0, phrase: "In 5 seconde", diff: 5 * SECOND },
    { text: "binnen twee weken", index: 0, phrase: "binnen twee weken", diff: 2 * WEEK },
    { text: "binnen een maand", index: 0, phrase: "binnen een maand", diff: 31 * DAY },
    { text: "na een maand", index: 0, phrase: "na een maand", diff: 31 * DAY },
    { text: "binnen een paar maanden", index: 0, phrase: "binnen een paar maanden", diff: 91 * DAY },
    { text: "binnen een jaar", index: 0, phrase: "binnen een jaar", diff: 366 * DAY },
    { text: "in een week", index: 0, phrase: "in een week", diff: WEEK },
  ];

  const parse = when.create({ rules: [deadline("skip")] });
  applyFixtures("nl.Deadline", parse, fixtures, NL_NULL_TIME);
});
