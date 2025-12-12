import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";
import { INTEGER_WORDS, INTEGER_WORDS_PATTERN } from "./constants";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

export function deadline(strategy: Strategy = "override"): Rule {
  return createRule(
    new RegExp(
      "(?:\\P{L}|^)" +
        "(в\\s+течении|за|через)\\s*" +
        "(" + INTEGER_WORDS_PATTERN + "|[0-9]+|полу?|несколько|нескольких)?\\s*" +
        "(секунд(?:у|ы)?|минут(?:у|ы)?|час(?:а|ов)?|день|дня|дней|недел(?:я|ь|и|ю)|месяц(?:а|ев)?|год(?:а)?|лет)\\s*" +
        "(?:\\P{L}|$)",
      "iu"
    ),
    (match, context, options, ref) => {
      if (context.duration !== 0 && strategy !== "override") {
        return false;
      }

      const numStr = match.captures[1].trim();
      const exponent = match.captures[2].trim();

      let num: number;

      if (INTEGER_WORDS[numStr]) {
        num = INTEGER_WORDS[numStr];
      } else if (numStr === "") {
        num = 1;
      } else if (numStr.includes("неск")) {
        num = 3;
      } else if (numStr.includes("пол")) {
        // Handle "half" separately
        num = 0; // Will be handled specially
      } else {
        num = parseInt(numStr, 10);
      }

      // Handle "half" (пол/полу) cases
      if (numStr.includes("пол")) {
        if (exponent.includes("час")) {
          context.duration = 30 * MINUTE;
        } else if (exponent.includes("дн") || exponent.includes("день")) {
          context.duration = 12 * HOUR;
        } else if (exponent.includes("недел")) {
          context.duration = 7 * 12 * HOUR; // half week
        } else if (exponent.includes("месяц")) {
          context.duration = 14 * DAY; // 2 weeks
        } else if (exponent.includes("год") || exponent.includes("лет")) {
          // Half a year - 6 months
          const currentMonth = ref.getUTCMonth();
          context.month = ((currentMonth + 6) % 12) + 1;
        }
      } else {
        // Regular cases
        if (exponent.includes("секунд")) {
          context.duration = num * SECOND;
        } else if (exponent.includes("мин")) {
          context.duration = num * MINUTE;
        } else if (exponent.includes("час")) {
          context.duration = num * HOUR;
        } else if (exponent.includes("дн") || exponent.includes("день")) {
          context.duration = num * DAY;
        } else if (exponent.includes("недел")) {
          context.duration = num * WEEK;
        } else if (exponent.includes("месяц")) {
          const currentMonth = ref.getUTCMonth();
          context.month = ((currentMonth + num) % 12) + 1;
        } else if (exponent.includes("год") || exponent.includes("лет")) {
          context.year = ref.getUTCFullYear() + num;
        }
      }

      return true;
    }
  );
}
