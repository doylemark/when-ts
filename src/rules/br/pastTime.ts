import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";
import { INTEGER_WORDS, INTEGER_WORDS_PATTERN } from "./constants";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function pastTime(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  return createRule(
    new RegExp(
      "(?:\\W|^)\\s*" +
        "(" +
        INTEGER_WORDS_PATTERN +
        "|[0-9]+|umas|uma|um|uns|pouc[ao]s*|algu(?:ns|m)|mei[oa]?)\\s*" +
        "(segundos?|min(?:uto)?s?|hora?s?|dia?s?|semana?s?|mês?|meses?|ano?s?)(\\satrás)\\s*" +
        "(?:\\W|$)|" +
        "(?:há)\\s*" +
        "(" +
        INTEGER_WORDS_PATTERN +
        "|[0-9]+|umas|uma|um|uns|pouc[ao]s*|algu(?:ns|m)|mei[oa]?)\\s*" +
        "(segundos?|min(?:uto)?s?|hora?s?|dia?s?|semana?s?|mês?|meses?|ano?s?)(\\satrás)*\\s*" +
        "(?:\\W|$)",
      "i"
    ),
    (match, context, options, ref) => {
      // Determine which capture group set to use based on pattern match
      let startIndex = 0;
      if (match.captures[0].trim() === "") {
        startIndex = 3;
      }

      const numStr = match.captures[startIndex + 0].toLowerCase().trim();

      let num: number;
      let isHalf = false;

      if (numStr in INTEGER_WORDS) {
        num = INTEGER_WORDS[numStr];
      } else if (numStr === "um" || numStr === "uma") {
        num = 1;
      } else if (
        numStr === "umas" ||
        numStr === "uns" ||
        numStr.includes("pouc") ||
        numStr.includes("algu")
      ) {
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

      const exponent = match.captures[startIndex + 1].toLowerCase().trim();

      if (!isHalf) {
        if (exponent.includes("segund")) {
          if (context.duration === 0 || overwrite) {
            context.duration = -(num * SECOND);
          }
        } else if (exponent.includes("min")) {
          if (context.duration === 0 || overwrite) {
            context.duration = -(num * MINUTE);
          }
        } else if (exponent.includes("hora")) {
          if (context.duration === 0 || overwrite) {
            context.duration = -(num * HOUR);
          }
        } else if (exponent.includes("dia")) {
          if (context.duration === 0 || overwrite) {
            context.duration = -(num * DAY);
          }
        } else if (exponent.includes("semana")) {
          if (context.duration === 0 || overwrite) {
            context.duration = -(num * 7 * DAY);
          }
        } else if (exponent.includes("mês") || exponent.includes("meses")) {
          if (context.month === null || overwrite) {
            context.month = ((ref.getUTCMonth() + 1 - num - 1) % 12) + 1;
          }
        } else if (exponent.includes("ano")) {
          if (context.year === null || overwrite) {
            context.year = ref.getUTCFullYear() - num;
          }
        }
      } else {
        // Handle "half" cases (meia/meio)
        if (exponent.includes("hora")) {
          if (context.duration === 0 || overwrite) {
            context.duration = -(30 * MINUTE);
          }
        } else if (exponent.includes("dia")) {
          if (context.duration === 0 || overwrite) {
            context.duration = -(12 * HOUR);
          }
        } else if (exponent.includes("semana")) {
          if (context.duration === 0 || overwrite) {
            context.duration = -(7 * 12 * HOUR);
          }
        } else if (exponent.includes("mês") || exponent.includes("meses")) {
          if (context.duration === 0 || overwrite) {
            // 2 weeks
            context.duration = -(14 * DAY);
          }
        } else if (exponent.includes("ano")) {
          if (context.month === null || overwrite) {
            // 6 months
            context.month = ((ref.getUTCMonth() + 1 - 6 - 1) % 12) + 1;
          }
        }
      }

      return true;
    }
  );
}
