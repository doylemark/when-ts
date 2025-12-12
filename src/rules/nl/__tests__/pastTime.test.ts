import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, SECOND, MINUTE, HOUR, DAY, WEEK } from "../../../test-utils";
import { when } from "../../../index";
import { pastTime } from "../index";

const NL_NULL_TIME = EN_NULL_TIME;

describe("nl.PastTime", () => {
  const fixtures = [
    { text: "een half uur geleden", index: 0, phrase: "een half uur geleden", diff: -(HOUR / 2) },
    { text: "1 uur geleden", index: 0, phrase: "1 uur geleden", diff: -HOUR },
    { text: "5 minuten geleden", index: 0, phrase: "5 minuten geleden", diff: -5 * MINUTE },
    { text: "5 minuten geleden ging ik naar de dierentuin", index: 0, phrase: "5 minuten geleden", diff: -5 * MINUTE },
    { text: "we deden iets 10 dagen geleden", index: 14, phrase: "10 dagen geleden", diff: -10 * DAY },
    { text: "we deden iets vijf dagen geleden", index: 14, phrase: "vijf dagen geleden", diff: -5 * DAY },
    { text: "we deden iets 5 dagen geleden", index: 14, phrase: "5 dagen geleden", diff: -5 * DAY },
    { text: "5 seconden geleden werd een auto weggesleept", index: 0, phrase: "5 seconden geleden", diff: -5 * SECOND },
    { text: "twee weken geleden", index: 0, phrase: "twee weken geleden", diff: -2 * WEEK },
    { text: "een maand geleden", index: 0, phrase: "een maand geleden", diff: -31 * DAY },
    { text: "een paar maanden geleden", index: 0, phrase: "een paar maanden geleden", diff: -92 * DAY },
    { text: "een jaar geleden", index: 0, phrase: "een jaar geleden", diff: -365 * DAY },
    { text: "een week geleden", index: 0, phrase: "een week geleden", diff: -WEEK },
  ];

  const parse = when.create({ rules: [pastTime("skip")] });
  applyFixtures("nl.PastTime", parse, fixtures, NL_NULL_TIME);
});
