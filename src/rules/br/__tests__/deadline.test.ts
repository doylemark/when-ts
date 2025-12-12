import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, SECOND, MINUTE, HOUR, DAY, WEEK } from "../../../test-utils";
import { when } from "../../../index";
import { deadline } from "../index";

const BR_NULL_TIME = EN_NULL_TIME;

describe("br.Deadline", () => {
  const fixtures = [
    { text: "dentro de meia hora", index: 0, phrase: "dentro de meia hora", diff: HOUR / 2 },
    { text: "dentro de 1 hora", index: 0, phrase: "dentro de 1 hora", diff: HOUR },
    { text: "em 5 minutos", index: 0, phrase: "em 5 minutos", diff: 5 * MINUTE },
    { text: "Em 5 minutos eu irei para casa", index: 0, phrase: "Em 5 minutos", diff: 5 * MINUTE },
    { text: "nós precisamos fazer algo dentro de 10 dias.", index: 27, phrase: "dentro de 10 dias", diff: 10 * DAY },
    { text: "nós temos que fazer algo em cinco dias.", index: 26, phrase: "em cinco dias", diff: 5 * DAY },
    { text: "nós temos que fazer algo em 5 dias.", index: 26, phrase: "em 5 dias", diff: 5 * DAY },
    { text: "Em 5 segundos, um carro precisa se mover", index: 0, phrase: "Em 5 segundos", diff: 5 * SECOND },
    { text: "dentro de duas semanas", index: 0, phrase: "dentro de duas semanas", diff: 2 * WEEK },
    { text: "dentro de um mês", index: 0, phrase: "dentro de um mês", diff: 31 * DAY },
    { text: "dentro de alguns meses", index: 0, phrase: "dentro de alguns meses", diff: 91 * DAY },
    { text: "dentro de poucos meses", index: 0, phrase: "dentro de poucos meses", diff: 91 * DAY },
    { text: "dentro de um ano", index: 0, phrase: "dentro de um ano", diff: 366 * DAY },
    { text: "em uma semana", index: 0, phrase: "em uma semana", diff: WEEK },
  ];

  const parse = when.create({ rules: [deadline("skip")] });
  applyFixtures("br.Deadline", parse, fixtures, BR_NULL_TIME);
});
