import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR, MINUTE, DAY } from "../../../test-utils";
import { when } from "../../../index";
import * as nl from "../index";

const NL_NULL_TIME = EN_NULL_TIME;

describe("nl.All Integration", () => {
  const fixtures = [
    { text: "vorige week zondag om 10:00", index: 0, phrase: "vorige week zondag om 10:00", diff: ((-3 * 24) + 10) * HOUR },
    { text: "vanavond om 23:10", index: 0, phrase: "vanavond om 23:10", diff: (23 * HOUR) + (10 * MINUTE) },
    { text: "op vrijdagmiddag", index: 3, phrase: "vrijdagmiddag", diff: ((2 * 24) + 15) * HOUR },
    { text: "komende dinsdag om 14:00", index: 0, phrase: "komende dinsdag om 14:00", diff: ((6 * 24) + 14) * HOUR },
    { text: "komende dinsdag 2 uur 's middags", index: 0, phrase: "komende dinsdag 2 uur 's middags", diff: ((6 * 24) + 14) * HOUR },
    { text: "komende woensdag om 14:25", index: 0, phrase: "komende woensdag om 14:25", diff: (((7 * 24) + 14) * HOUR) + (25 * MINUTE) },
    { text: "om 11 uur afgelopen dinsdag", index: 3, phrase: "11 uur afgelopen dinsdag", diff: -13 * HOUR },
    { text: "volgende week dinsdag om 18:15", index: 0, phrase: "volgende week dinsdag om 18:15", diff: (((6 * 24) + 18) * HOUR) + (15 * MINUTE) },
    { text: "volgende week vrijdag", index: 0, phrase: "volgende week vrijdag", diff: 9 * DAY },
  ];

  const parse = when.create({ rules: nl.all });
  applyFixtures("nl.All", parse, fixtures, NL_NULL_TIME);
});
