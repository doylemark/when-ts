import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, SECOND, MINUTE, HOUR, DAY, WEEK } from "../../../test-utils";
import { when } from "../../../index";
import { deadline } from "../index";

describe("en.Deadline", () => {
  const fixtures = [
    { text: "within half an hour", index: 0, phrase: "within half an hour", diff: HOUR / 2 },
    { text: "within 1 hour", index: 0, phrase: "within 1 hour", diff: HOUR },
    { text: "in 5 minutes", index: 0, phrase: "in 5 minutes", diff: 5 * MINUTE },
    { text: "In 5 minutes I will go home", index: 0, phrase: "In 5 minutes", diff: 5 * MINUTE },
    { text: "we have to do something within 10 days.", index: 24, phrase: "within 10 days", diff: 10 * DAY },
    { text: "we have to do something in five days.", index: 24, phrase: "in five days", diff: 5 * DAY },
    { text: "we have to do something in 5 days.", index: 24, phrase: "in 5 days", diff: 5 * DAY },
    { text: "In 5 seconds A car need to move", index: 0, phrase: "In 5 seconds", diff: 5 * SECOND },
    { text: "within two weeks", index: 0, phrase: "within two weeks", diff: 2 * WEEK },
    { text: "within a month", index: 0, phrase: "within a month", diff: 31 * DAY },
    { text: "within a few months", index: 0, phrase: "within a few months", diff: 91 * DAY },
    { text: "within one year", index: 0, phrase: "within one year", diff: 366 * DAY },
    { text: "in a week", index: 0, phrase: "in a week", diff: WEEK },
  ];

  const parse = when.create({ rules: [deadline("skip")] });
  applyFixtures("en.Deadline", parse, fixtures, EN_NULL_TIME);
});
