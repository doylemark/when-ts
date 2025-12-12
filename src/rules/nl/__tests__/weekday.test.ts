import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, DAY } from "../../../test-utils";
import { when } from "../../../index";
import { weekday } from "../index";

const NL_NULL_TIME = EN_NULL_TIME;

describe("nl.Weekday", () => {
  // Jan 6, 2016 is Wednesday
  const fixtures = [
    // past week
    { text: "vorige week maandag", index: 0, phrase: "vorige week maandag", diff: -9 * DAY },
    { text: "vorige week dinsdag", index: 0, phrase: "vorige week dinsdag", diff: -8 * DAY },
    { text: "vorige week woensdag", index: 0, phrase: "vorige week woensdag", diff: -7 * DAY },
    { text: "vorige week donderdag", index: 0, phrase: "vorige week donderdag", diff: -6 * DAY },
    { text: "vorige week vrijdag", index: 0, phrase: "vorige week vrijdag", diff: -5 * DAY },
    { text: "vorige week zaterdag", index: 0, phrase: "vorige week zaterdag", diff: -4 * DAY },
    { text: "vorige week zondag", index: 0, phrase: "vorige week zondag", diff: -3 * DAY },
    // past/last
    { text: "doe het voor afgelopen maandag", index: 13, phrase: "afgelopen maandag", diff: -2 * DAY },
    { text: "afgelopen zaterdag", index: 0, phrase: "afgelopen zaterdag", diff: -4 * DAY },
    { text: "afgelopen vrijdag", index: 0, phrase: "afgelopen vrijdag", diff: -5 * DAY },
    { text: "afgelopen woensdag", index: 0, phrase: "afgelopen woensdag", diff: -7 * DAY },
    { text: "afgelopen dinsdag", index: 0, phrase: "afgelopen dinsdag", diff: -DAY },
    // next week
    { text: "volgende week maandag", index: 0, phrase: "volgende week maandag", diff: 5 * DAY },
    { text: "volgende week dinsdag", index: 0, phrase: "volgende week dinsdag", diff: 6 * DAY },
    { text: "volgende week woensdag", index: 0, phrase: "volgende week woensdag", diff: 7 * DAY },
    { text: "volgende week donderdag", index: 0, phrase: "volgende week donderdag", diff: 8 * DAY },
    { text: "volgende week vrijdag", index: 0, phrase: "volgende week vrijdag", diff: 9 * DAY },
    { text: "volgende week zaterdag", index: 0, phrase: "volgende week zaterdag", diff: 10 * DAY },
    { text: "volgende week zondag", index: 0, phrase: "volgende week zondag", diff: 11 * DAY },
    // next
    { text: "komende dinsdag", index: 0, phrase: "komende dinsdag", diff: 6 * DAY },
    { text: "stuur me een bericht komende woensdag", index: 21, phrase: "komende woensdag", diff: 7 * DAY },
    { text: "komende zaterdag", index: 0, phrase: "komende zaterdag", diff: 3 * DAY },
    { text: "volgende dinsdag", index: 0, phrase: "volgende dinsdag", diff: 6 * DAY },
    { text: "stuur me een bericht volgende woensdag", index: 21, phrase: "volgende woensdag", diff: 7 * DAY },
    { text: "volgende zaterdag", index: 0, phrase: "volgende zaterdag", diff: 3 * DAY },
    // this
    { text: "deze dinsdag", index: 0, phrase: "deze dinsdag", diff: -DAY },
    { text: "stuur me een bericht deze woensdag", index: 21, phrase: "deze woensdag", diff: 0 },
    { text: "deze zaterdag", index: 0, phrase: "deze zaterdag", diff: 3 * DAY },
  ];

  const parse = when.create({ rules: [weekday("override")] });
  applyFixtures("nl.Weekday", parse, fixtures, NL_NULL_TIME);
});
