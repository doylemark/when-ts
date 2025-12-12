import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";
import { DAY_WORDS_PATTERN, compressStr } from "./constants";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export function casualDate(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  return createRule(
    new RegExp(
      "(大前|前|昨|今天|今|明|大后|后|下下|下|上|上上)" +
        "(天|月|个月|年|儿)" +
        "(1[0-9]|2[0-9]|3[0-1]|[1-9]|" +
        DAY_WORDS_PATTERN +
        ")?" +
        "(?:\\s*)?" +
        "(日|号)?",
      "i"
    ),
    (match, context, options, ref) => {
      const lower = compressStr(match.text.trim());

      // Check for day number (captures[2] and captures[3])
      if (lower.includes("号") || lower.includes("日")) {
        const dayStr = match.captures[2];
        const day = parseInt(dayStr, 10);
        if (!isNaN(day)) {
          context.day = day;
        }
      }

      // Process year/month/day modifiers
      if (lower.includes("后年")) {
        context.year = ref.getUTCFullYear() + 2;
      } else if (lower.includes("明年")) {
        context.year = ref.getUTCFullYear() + 1;
      } else if (lower.includes("下下")) {
        const monthInt = ref.getUTCMonth() + 1 + 2; // JS months are 0-indexed, add 2
        context.month = monthInt;
      } else if (lower.includes("下月") || lower.includes("下个月")) {
        const monthInt = ref.getUTCMonth() + 1 + 1; // JS months are 0-indexed, add 1
        context.month = monthInt;
      } else if (lower.includes("上上")) {
        const monthInt = ref.getUTCMonth() + 1 - 2; // JS months are 0-indexed, subtract 2
        context.month = monthInt;
      } else if (lower.includes("上月") || lower.includes("上个月")) {
        const monthInt = ref.getUTCMonth() + 1 - 1; // JS months are 0-indexed, subtract 1
        context.month = monthInt;
      } else if (lower.includes("今晚") || lower.includes("晚上")) {
        if ((context.hour === null && context.minute === null) || overwrite) {
          context.hour = 22;
          context.minute = 0;
          context.second = 0;
        }
      } else if (lower.includes("今天") || lower.includes("今儿")) {
        // No modification needed
      } else if (lower.includes("明天") || lower.includes("明儿")) {
        if (context.duration === 0 || overwrite) {
          context.duration += DAY;
        }
      } else if (lower.includes("昨天")) {
        if (context.duration === 0 || overwrite) {
          context.duration -= DAY;
        }
      } else if (lower.includes("大前天")) {
        if (context.duration === 0 || overwrite) {
          context.duration -= DAY * 3;
        }
      } else if (lower.includes("前天")) {
        if (context.duration === 0 || overwrite) {
          context.duration -= DAY * 2;
        }
      } else if (lower.includes("昨晚")) {
        if ((context.hour === null && context.duration === 0) || overwrite) {
          context.hour = 23;
          context.minute = 0;
          context.second = 0;
          context.duration -= DAY;
        }
      } else if (lower.includes("大后天")) {
        if (context.duration === 0 || overwrite) {
          context.duration += DAY * 3;
        }
      } else if (lower.includes("后天")) {
        if (context.duration === 0 || overwrite) {
          context.duration += DAY * 2;
        }
      }

      return true;
    }
  );
}
