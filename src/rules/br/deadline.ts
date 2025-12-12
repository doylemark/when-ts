import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";
import { INTEGER_WORDS, INTEGER_WORDS_PATTERN } from "./constants";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function deadline(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  return createRule(
    new RegExp(
      "(?:\\W|^)(dentro\\sde|em)\\s*" +
        "(?:(" +
        INTEGER_WORDS_PATTERN +
        "|[0-9]+|(?:\\s*pouc[oa](?:s|)?|algu(?:mas|m|ns)?|mei[oa]?))\\s*" +
        "(segundos?|min(?:uto)?s?|horas?|dias?|semanas?|mês|meses|anos?)\\s*)" +
        "(?:\\W|$)",
      "i"
    ),
    (match, context, options, ref) => {
      const numStr = match.captures[1].toLowerCase().trim();

      let num: number;
      let isHalf = false;

      if (numStr in INTEGER_WORDS) {
        num = INTEGER_WORDS[numStr];
      } else if (numStr.includes("pouc") || numStr.includes("algu")) {
        num = 3;
      } else if (numStr.includes("mei")) {
        isHalf = true;
        num = 0; // handled separately below
      } else {
        num = parseInt(numStr, 10);
        if (isNaN(num)) {
          return false;
        }
      }

      const exponent = match.captures[2].toLowerCase().trim();

      if (!isHalf) {
        if (exponent.includes("segundo")) {
          if (context.duration === 0 || overwrite) {
            context.duration = num * SECOND;
          }
        } else if (exponent.includes("min")) {
          if (context.duration === 0 || overwrite) {
            context.duration = num * MINUTE;
          }
        } else if (exponent.includes("hora")) {
          if (context.duration === 0 || overwrite) {
            context.duration = num * HOUR;
          }
        } else if (exponent.includes("dia")) {
          if (context.duration === 0 || overwrite) {
            context.duration = num * DAY;
          }
        } else if (exponent.includes("semana")) {
          if (context.duration === 0 || overwrite) {
            context.duration = num * 7 * DAY;
          }
        } else if (exponent.includes("mês") || exponent.includes("meses")) {
          if (context.month === null || overwrite) {
            context.month = ((ref.getUTCMonth() + 1 + num - 1) % 12) + 1;
          }
        } else if (exponent.includes("ano")) {
          if (context.year === null || overwrite) {
            context.year = ref.getUTCFullYear() + num;
          }
        }
      } else {
        // Handle "half" cases (meia/meio)
        if (exponent.includes("hora")) {
          if (context.duration === 0 || overwrite) {
            context.duration = 30 * MINUTE;
          }
        } else if (exponent.includes("dia")) {
          if (context.duration === 0 || overwrite) {
            context.duration = 12 * HOUR;
          }
        } else if (exponent.includes("semana")) {
          if (context.duration === 0 || overwrite) {
            context.duration = 7 * 12 * HOUR;
          }
        } else if (exponent.includes("mês") || exponent.includes("meses")) {
          if (context.duration === 0 || overwrite) {
            // 2 weeks
            context.duration = 14 * DAY;
          }
        } else if (exponent.includes("ano")) {
          if (context.month === null || overwrite) {
            // 6 months
            context.month = ((ref.getUTCMonth() + 1 + 6 - 1) % 12) + 1;
          }
        }
      }

      return true;
    }
  );
}
