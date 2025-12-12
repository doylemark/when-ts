import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, SECOND, MINUTE, HOUR, DAY, WEEK } from "../../../test-utils";
import { when } from "../../../index";
import { pastTime } from "../index";

const BR_NULL_TIME = EN_NULL_TIME;

describe("br.PastTime", () => {
  const fixtures = [
    { text: "meia hora atrás", index: 0, phrase: "meia hora atrás", diff: -(HOUR / 2) },
    { text: "1 hora atrás", index: 0, phrase: "1 hora atrás", diff: -HOUR },
    { text: "5 minutos atrás", index: 0, phrase: "5 minutos atrás", diff: -5 * MINUTE },
    { text: "5 minutos atrás eu fui ao zoológico", index: 0, phrase: "5 minutos atrás", diff: -5 * MINUTE },
    { text: "nós fizemos algo 10 dias atrás.", index: 18, phrase: "10 dias atrás", diff: -10 * DAY },
    { text: "nós fizemos algo cinco dias atrás.", index: 18, phrase: "cinco dias atrás", diff: -5 * DAY },
    { text: "fizemos algo 5 dias atrás.", index: 13, phrase: "5 dias atrás", diff: -5 * DAY },
    { text: "5 segundos atrás, um carro foi movido", index: 0, phrase: "5 segundos atrás", diff: -5 * SECOND },
    { text: "duas semanas atrás", index: 0, phrase: "duas semanas atrás", diff: -2 * WEEK },
    { text: "um mês atrás", index: 0, phrase: "um mês atrás", diff: -31 * DAY },
    { text: "uns meses atrás", index: 0, phrase: "uns meses atrás", diff: -92 * DAY },
    { text: "há um ano", index: 4, phrase: "um ano", diff: -365 * DAY },
    { text: "há duas semanas", index: 4, phrase: "duas semanas", diff: -2 * WEEK },
    { text: "poucas semanas atrás", index: 0, phrase: "poucas semanas atrás", diff: -3 * WEEK },
    { text: "há poucas semanas", index: 4, phrase: "poucas semanas", diff: -3 * WEEK },
    { text: "alguns dias atrás", index: 0, phrase: "alguns dias atrás", diff: -3 * DAY },
    { text: "há alguns dias", index: 4, phrase: "alguns dias", diff: -3 * DAY },
  ];

  const parse = when.create({ rules: [pastTime("skip")] });
  applyFixtures("br.PastTime", parse, fixtures, BR_NULL_TIME);
});
