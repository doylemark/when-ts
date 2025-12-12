import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, SECOND, MINUTE, HOUR, DAY, WEEK } from "../../../test-utils";
import { when } from "../../../index";
import { deadline } from "../index";

const RU_NULL_TIME = EN_NULL_TIME;

describe("ru.Deadline", () => {
  const fixtures = [
    { text: "нужно сделать это в течении получаса", index: 33, phrase: "в течении получаса", diff: HOUR / 2 },
    { text: "нужно сделать это в течении одного часа", index: 33, phrase: "в течении одного часа", diff: HOUR },
    { text: "нужно сделать это за один час", index: 33, phrase: "за один час", diff: HOUR },
    { text: "за 5 минут", index: 0, phrase: "за 5 минут", diff: 5 * MINUTE },
    { text: "Через 5 минут я пойду домой.", index: 0, phrase: "Через 5 минут", diff: 5 * MINUTE },
    { text: "Нам необходимо сделать это за 10 дней.", index: 50, phrase: "за 10 дней", diff: 10 * DAY },
    { text: "Нам необходимо сделать это за пять дней.", index: 50, phrase: "за пять дней", diff: 5 * DAY },
    { text: "Нам необходимо сделать это через 5 дней.", index: 50, phrase: "через 5 дней", diff: 5 * DAY },
    { text: "Через 5 секунд нужно убрать машину", index: 0, phrase: "Через 5 секунд", diff: 5 * SECOND },
    { text: "за две недели", index: 0, phrase: "за две недели", diff: 2 * WEEK },
    { text: "через месяц", index: 0, phrase: "через месяц", diff: 31 * DAY },
    { text: "за месяц", index: 0, phrase: "за месяц", diff: 31 * DAY },
    { text: "за несколько месяцев", index: 0, phrase: "за несколько месяцев", diff: 91 * DAY },
    { text: "за один год", index: 0, phrase: "за один год", diff: 366 * DAY },
    { text: "за неделю", index: 0, phrase: "за неделю", diff: WEEK },
  ];

  const parse = when.create({ rules: [deadline("skip")] });
  applyFixtures("ru.Deadline", parse, fixtures, RU_NULL_TIME);
});
