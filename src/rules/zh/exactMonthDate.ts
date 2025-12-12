import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";
import { MON_WORDS, DAY_WORDS, MON_WORDS_PATTERN, DAY_WORDS_PATTERN, compressStr } from "./constants";

export function exactMonthDate(strategy: Strategy = "override"): Rule {
  return createRule(
    new RegExp(
      "(?:\\b|^)" + // can't use \W here due to Chinese characters
        "(?:" +
        "(1[0-2]|[1-9])" +
        "\\s*" +
        "(?:-|/|\\.)" +
        "\\s*" +
        "(1[0-9]|2[0-9]|3[0-1]|[1-9])" +
        "|" +
        "(?:" +
        "(1[0-2]|[1-9]|" +
        MON_WORDS_PATTERN +
        ")" +
        "\\s*" +
        "(月)" +
        "\\s*" +
        ")?" +
        "(?:" +
        "(1[0-9]|2[0-9]|3[0-1]|[1-9]|" +
        DAY_WORDS_PATTERN +
        ")" +
        "\\s*" +
        "(日|号)" +
        ")?" +
        ")"
    ),
    (match, context, options, ref) => {
      // The default value of month is the current month, and the default
      // value of day is the first day of the month, so that we can handle
      // cases like "4月" (Apr 1st) and "12号" (12th this month)
      let monInt = ref.getUTCMonth() + 1; // JS months are 0-indexed
      let dayInt = 1;

      // Check if we have any captures at all
      if (match.captures[0] === "" && match.captures[2] === "" && match.captures[4] === "") {
        return false;
      }

      // Check for month in captures[2] (Chinese month pattern)
      if (match.captures[2] !== "") {
        const monthWord = MON_WORDS[compressStr(match.captures[2])];
        if (monthWord !== undefined) {
          monInt = monthWord;
        } else {
          const mon = parseInt(match.captures[2], 10);
          if (!isNaN(mon)) {
            monInt = mon;
          }
        }
      }

      // Check for day in captures[4] (Chinese day pattern)
      if (match.captures[4] !== "") {
        const dayWord = DAY_WORDS[compressStr(match.captures[4])];
        if (dayWord !== undefined) {
          dayInt = dayWord;
        } else {
          const day = parseInt(match.captures[4], 10);
          if (!isNaN(day)) {
            dayInt = day;
          }
        }
      }

      // Check for slash format: captures[0] = month, captures[1] = day
      if (match.captures[0] !== "" && match.captures[1] !== "") {
        const mon = parseInt(match.captures[0], 10);
        const day = parseInt(match.captures[1], 10);
        if (!isNaN(mon) && !isNaN(day)) {
          monInt = mon;
          dayInt = day;
        }
      }

      context.month = monInt;
      context.day = dayInt;

      return true;
    }
  );
}
