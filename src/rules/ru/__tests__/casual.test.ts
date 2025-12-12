import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR, DAY } from "../../../test-utils";
import { when } from "../../../index";
import { casualDate, casualTime } from "../index";

// RU tests use same null time as EN (Jan 6, 2016)
const RU_NULL_TIME = EN_NULL_TIME;

describe("ru.CasualDate", () => {
  // Note: indices are UTF-8 byte positions (Cyrillic chars = 2 bytes each)
  const fixtures = [
    { text: "Это нужно сделать прямо сейчас", index: 33, phrase: "прямо сейчас", diff: 0 },
    { text: "Это нужно сделать сегодня", index: 33, phrase: "сегодня", diff: 0 },
    { text: "Это нужно сделать завтра вечером", index: 33, phrase: "завтра", diff: DAY },
    { text: "Это нужно было сделать вчера вечером", index: 42, phrase: "вчера", diff: -DAY },
    { text: "Это нужно сделать до завтра", index: 33, phrase: "до завтра", diff: DAY },
  ];

  const parse = when.create({ rules: [casualDate("skip")] });
  applyFixtures("ru.CasualDate", parse, fixtures, RU_NULL_TIME);
});

describe("ru.CasualTime", () => {
  // Note: indices are UTF-8 byte positions (Cyrillic chars = 2 bytes each)
  const fixtures = [
    { text: "Это нужно было сделать этим утром ", index: 42, phrase: "этим утром", diff: 8 * HOUR },
    { text: "Это нужно сделать до обеда", index: 33, phrase: "до обеда", diff: 12 * HOUR },
    { text: "Это нужно сделать после обеда", index: 33, phrase: "после обеда", diff: 15 * HOUR },
    { text: "Это нужно сделать к вечеру", index: 33, phrase: "к вечеру", diff: 18 * HOUR },
    { text: "вечером", index: 0, phrase: "вечером", diff: 18 * HOUR },
  ];

  const parse = when.create({ rules: [casualTime("skip")] });
  applyFixtures("ru.CasualTime", parse, fixtures, RU_NULL_TIME);
});

describe("ru.CasualDate|ru.CasualTime", () => {
  // Note: indices are UTF-8 byte positions (Cyrillic chars = 2 bytes each)
  const fixtures = [
    { text: "Это нужно сделать завтра после обеда", index: 33, phrase: "завтра после обеда", diff: (15 + 24) * HOUR },
    { text: "Это нужно сделать завтра утром", index: 33, phrase: "завтра утром", diff: (8 + 24) * HOUR },
    { text: "Это нужно было сделать вчера утром", index: 42, phrase: "вчера утром", diff: (8 - 24) * HOUR },
    { text: "Это нужно было сделать вчера после обеда", index: 42, phrase: "вчера после обеда", diff: (15 - 24) * HOUR },
    { text: "помыть окна до вечера", index: 22, phrase: "до вечера", diff: 18 * HOUR },
    { text: "помыть окна до обеда", index: 22, phrase: "до обеда", diff: 12 * HOUR },
    { text: "сделать это к вечеру", index: 22, phrase: "к вечеру", diff: 18 * HOUR },
    { text: "помыть окна завтра утром", index: 22, phrase: "завтра утром", diff: 32 * HOUR },
    { text: "написать письмо во вторник после обеда", index: 50, phrase: "после обеда", diff: 15 * HOUR },
    { text: "написать письмо до утра ", index: 30, phrase: "до утра", diff: 8 * HOUR },
    { text: "к вечеру", index: 0, phrase: "к вечеру", diff: 18 * HOUR },
  ];

  const parse = when.create({
    rules: [casualDate("skip"), casualTime("override")]
  });
  applyFixtures("ru.CasualDate|ru.CasualTime", parse, fixtures, RU_NULL_TIME);
});
