import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";
import { INTEGER_WORDS, INTEGER_WORDS_PATTERN, compressStr } from "./constants";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

export function afterTime(strategy: Strategy = "override"): Rule {
  return createRule(
    new RegExp(
      "((?:[0-9]{0,3}))?" +
        "(" +
        INTEGER_WORDS_PATTERN.slice(3) + // Remove leading "(?:"
        "?" +
        "\\s*" +
        "(?:(分|分钟|小时|天|周|月)\\s*)" +
        "(后)" +
        "(?:\\W|$)",
      "i"
    ),
    (match, context, options, ref) => {
      if (context.hour !== null && strategy !== "override") {
        return false;
      }

      let duration = parseInt(match.captures[0], 10);
      if (isNaN(duration)) {
        duration = 0;
      }

      const integerWord = INTEGER_WORDS[compressStr(match.captures[1])];
      if (integerWord !== undefined) {
        duration = integerWord;
      }

      // Special case: "半小时"
      if (match.captures[1] === "半" && match.captures[2] === "小时") {
        context.duration = 30 * MINUTE;
        return true;
      }

      const unit = match.captures[2];
      switch (unit) {
        case "分钟":
        case "分":
          context.duration = duration * MINUTE;
          break;
        case "小时":
          context.duration = duration * HOUR;
          break;
        case "天":
          context.duration = duration * DAY;
          break;
        case "周":
          context.duration = duration * WEEK;
          break;
        case "月":
          // For months, we need to add months to the reference time
          // JS doesn't have a direct month duration, so we approximate
          // This is handled by adding to the month field instead
          const newMonth = ref.getUTCMonth() + 1 + duration; // JS months are 0-indexed
          context.month = newMonth;
          break;
      }

      return true;
    }
  );
}
