import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, SECOND, MINUTE, HOUR, DAY, WEEK } from "../../../test-utils";
import { when } from "../../../index";
import { pastTime } from "../index";

describe("en.PastTime", () => {
  const fixtures = [
    { text: "half an hour ago", index: 0, phrase: "half an hour ago", diff: -(HOUR / 2) },
    { text: "1 hour ago", index: 0, phrase: "1 hour ago", diff: -HOUR },
    { text: "5 minutes ago", index: 0, phrase: "5 minutes ago", diff: -5 * MINUTE },
    { text: "5 minutes ago I went to the zoo", index: 0, phrase: "5 minutes ago", diff: -5 * MINUTE },
    { text: "we did something 10 days ago.", index: 17, phrase: "10 days ago", diff: -10 * DAY },
    { text: "we did something five days ago.", index: 17, phrase: "five days ago", diff: -5 * DAY },
    { text: "we did something 5 days ago.", index: 17, phrase: "5 days ago", diff: -5 * DAY },
    { text: "5 seconds ago a car was moved", index: 0, phrase: "5 seconds ago", diff: -5 * SECOND },
    { text: "two weeks ago", index: 0, phrase: "two weeks ago", diff: -2 * WEEK },
    { text: "a month ago", index: 0, phrase: "a month ago", diff: -31 * DAY },
    { text: "a few months ago", index: 0, phrase: "a few months ago", diff: -92 * DAY },
    { text: "one year ago", index: 0, phrase: "one year ago", diff: -365 * DAY },
    { text: "a week ago", index: 0, phrase: "a week ago", diff: -WEEK },
  ];

  const parse = when.create({ rules: [pastTime("skip")] });
  applyFixtures("en.PastTime", parse, fixtures, EN_NULL_TIME);
});
