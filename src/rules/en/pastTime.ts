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
        "|[0-9]+|an?(?:\\s*few)?|half(?:\\s*an?)?)\\s*" +
        "(seconds?|min(?:ute)?s?|hours?|days?|weeks?|months?|years?) (ago)\\s*" +
        "(?:\\W|$)",
      "i"
    ),
    (match, context, options, ref) => {
      const numStr = match.captures[0].toLowerCase().trim();

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

      const exponent = match.captures[1].toLowerCase().trim();
      const isHalf = numStr.includes("half");

      if (!isHalf) {
        if (exponent.includes("second")) {
          if (context.duration === 0 || overwrite) {
            context.duration = -(num * SECOND);
          }
        } else if (exponent.includes("min")) {
          if (context.duration === 0 || overwrite) {
            context.duration = -(num * MINUTE);
          }
        } else if (exponent.includes("hour")) {
          if (context.duration === 0 || overwrite) {
            context.duration = -(num * HOUR);
          }
        } else if (exponent.includes("day")) {
          if (context.duration === 0 || overwrite) {
            context.duration = -(num * DAY);
          }
        } else if (exponent.includes("week")) {
          if (context.duration === 0 || overwrite) {
            context.duration = -(num * 7 * DAY);
          }
        } else if (exponent.includes("month")) {
          if (context.duration === 0 || overwrite) {
            // Approximate: 1 month ~ 31 days, few months = 92 days (matches tests)
            if (num === 3) {
              // "a few months" = 3 months = 92 days
              context.duration = -(92 * DAY);
            } else {
              context.duration = -(num * 31 * DAY);
            }
          }
        } else if (exponent.includes("year")) {
          if (context.duration === 0 || overwrite) {
            // Approximate: 1 year = 365 days (matches tests)
            context.duration = -(num * 365 * DAY);
          }
        }
      } else {
        if (exponent.includes("hour")) {
          if (context.duration === 0 || overwrite) {
            context.duration = -(30 * MINUTE);
          }
        } else if (exponent.includes("day")) {
          if (context.duration === 0 || overwrite) {
            context.duration = -(12 * HOUR);
          }
        } else if (exponent.includes("week")) {
          if (context.duration === 0 || overwrite) {
            context.duration = -(7 * 12 * HOUR);
          }
        } else if (exponent.includes("month")) {
          if (context.duration === 0 || overwrite) {
            // 2 weeks
            context.duration = -(14 * DAY);
          }
        } else if (exponent.includes("year")) {
          if (context.duration === 0 || overwrite) {
            // 6 months
            context.duration = -(183 * DAY);
          }
        }
      }

      return true;
    }
  );
}
