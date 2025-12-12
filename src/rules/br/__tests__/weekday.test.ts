import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, DAY } from "../../../test-utils";
import { when } from "../../../index";
import { weekday } from "../index";

const BR_NULL_TIME = EN_NULL_TIME;

describe("br.Weekday", () => {
  // Jan 6, 2016 is Wednesday
  const fixtures = [
    // past/last
    { text: "faça isto para a Segunda passada", index: 18, phrase: "Segunda passada", diff: -2 * DAY },
    { text: "sábado passado", index: 0, phrase: "sábado passado", diff: -4 * DAY },
    { text: "sexta-feira passada", index: 0, phrase: "sexta-feira passada", diff: -5 * DAY },
    { text: "quarta-feira passada", index: 0, phrase: "quarta-feira passada", diff: -7 * DAY },
    { text: "terça passada", index: 0, phrase: "terça passada", diff: -DAY },
    // next
    { text: "na próxima terça-feira", index: 3, phrase: "próxima terça-feira", diff: 6 * DAY },
    { text: "me ligue na próxima quarta", index: 12, phrase: "próxima quarta", diff: 7 * DAY },
    { text: "sábado que vem", index: 0, phrase: "sábado que vem", diff: 3 * DAY },
    // this
    { text: "essa terça-feira", index: 0, phrase: "essa terça-feira", diff: -DAY },
    { text: "liga pra mim nesta quarta", index: 13, phrase: "nesta quarta", diff: 0 },
    { text: "neste sábado", index: 0, phrase: "neste sábado", diff: 3 * DAY },
  ];

  const parse = when.create({ rules: [weekday("override")] });
  applyFixtures("br.Weekday", parse, fixtures, BR_NULL_TIME);
});
