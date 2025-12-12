import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";
import { INTEGER_WORDS, INTEGER_WORDS_PATTERN } from "./constants";

export function hour(strategy: Strategy = "override"): Rule {
  return createRule(
    new RegExp(
      "(?:\\W|^)" +
        "(" + INTEGER_WORDS_PATTERN + "|\\d{1,2})" +
        "(?:\\s*час(?:а|ов|ам)?)?(?:\\s*(утра|вечера|дня))" +
        "(?:\\P{L}|$)",
      "iu"
    ),
    (match, context, options, ref) => {
      if (context.hour !== null && strategy !== "override") {
        return false;
      }

      let hourNum: number;
      const hourStr = match.captures[0];

      if (INTEGER_WORDS[hourStr]) {
        hourNum = INTEGER_WORDS[hourStr];
      } else {
        hourNum = parseInt(hourStr, 10);
      }

      if (hourNum > 12) {
        return false;
      }

      const meridiem = match.captures[1];

      switch (meridiem) {
        case "утра": // morning (AM)
          context.hour = hourNum;
          break;
        case "вечера": // evening (PM)
        case "дня": // day (PM)
          if (hourNum < 12) {
            context.hour = hourNum + 12;
          } else {
            context.hour = hourNum;
          }
          break;
      }

      context.minute = 0;
      context.second = 0;
      return true;
    }
  );
}
