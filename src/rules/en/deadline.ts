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
      "(?:\\W|^)(within|in)\\s*" +
        "(" +
        INTEGER_WORDS_PATTERN +
        "|[0-9]+|an?(?:\\s*few)?|half(?:\\s*an?)?)\\s*" +
        "(seconds?|min(?:ute)?s?|hours?|days?|weeks?|months?|years?)\\s*" +
        "(?:\\W|$)",
      "i"
    ),
    (match, context, options, ref) => {
      const numStr = match.captures[1].toLowerCase().trim();

      let num: number;

      if (numStr in INTEGER_WORDS) {
        num = INTEGER_WORDS[numStr];
      } else if (numStr === "a" || numStr === "an") {
        num = 1;
      } else if (numStr.includes("few")) {
        num = 3;
      } else if (numStr.includes("half")) {
        num = 0; // handled separately below
      } else {
        num = parseInt(numStr, 10);
        if (isNaN(num)) {
          return false;
        }
      }

      const exponent = match.captures[2].toLowerCase().trim();
      const isHalf = numStr.includes("half");

      if (!isHalf) {
        if (exponent.includes("second")) {
          if (context.duration === 0 || overwrite) {
            context.duration = num * SECOND;
          }
        } else if (exponent.includes("min")) {
          if (context.duration === 0 || overwrite) {
            context.duration = num * MINUTE;
          }
        } else if (exponent.includes("hour")) {
          if (context.duration === 0 || overwrite) {
            context.duration = num * HOUR;
          }
        } else if (exponent.includes("day")) {
          if (context.duration === 0 || overwrite) {
            context.duration = num * DAY;
          }
        } else if (exponent.includes("week")) {
          if (context.duration === 0 || overwrite) {
            context.duration = num * 7 * DAY;
          }
        } else if (exponent.includes("month")) {
          if (context.month === null || overwrite) {
            // Set month relative to reference (Go behavior: (ref.Month() + num) % 12)
            context.month = ((ref.getUTCMonth() + 1 + num - 1) % 12) + 1;
          }
        } else if (exponent.includes("year")) {
          if (context.year === null || overwrite) {
            context.year = ref.getUTCFullYear() + num;
          }
        }
      } else {
        if (exponent.includes("hour")) {
          if (context.duration === 0 || overwrite) {
            context.duration = 30 * MINUTE;
          }
        } else if (exponent.includes("day")) {
          if (context.duration === 0 || overwrite) {
            context.duration = 12 * HOUR;
          }
        } else if (exponent.includes("week")) {
          if (context.duration === 0 || overwrite) {
            context.duration = 7 * 12 * HOUR;
          }
        } else if (exponent.includes("month")) {
          if (context.duration === 0 || overwrite) {
            // 2 weeks
            context.duration = 14 * DAY;
          }
        } else if (exponent.includes("year")) {
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
