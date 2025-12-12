import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR } from "../../../test-utils";
import { when } from "../../../index";
import { hour } from "../index";

const RU_NULL_TIME = EN_NULL_TIME;

describe("ru.Hour", () => {
  const fixtures = [
    { text: "5вечера", index: 0, phrase: "5вечера", diff: 17 * HOUR },
    { text: "в 5 вечера", index: 3, phrase: "5 вечера", diff: 17 * HOUR },
    { text: "нужно к 5 часам вечера", index: 14, phrase: "5 часам вечера", diff: 17 * HOUR },
    { text: "в три часа дня", index: 3, phrase: "три часа дня", diff: 15 * HOUR },
    { text: "в час дня", index: 3, phrase: "час дня", diff: 13 * HOUR },
    { text: "в одиннадцать часов утра", index: 3, phrase: "одиннадцать часов утра", diff: 11 * HOUR },
    { text: "в семь вечера", index: 3, phrase: "семь вечера", diff: 19 * HOUR },
  ];

  const parse = when.create({ rules: [hour("override")] });
  applyFixtures("ru.Hour", parse, fixtures, RU_NULL_TIME);
});
