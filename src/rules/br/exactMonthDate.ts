import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";
import {
  MONTH_OFFSET,
  MONTH_OFFSET_PATTERN,
  ORDINAL_WORDS,
  ORDINAL_WORDS_PATTERN,
} from "./constants";

export function exactMonthDate(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  // Strip the (?:  prefix from patterns
  const monthPattern = MONTH_OFFSET_PATTERN.slice(3);
  const ordinalPattern = ORDINAL_WORDS_PATTERN.slice(3);

  return createRule(
    new RegExp(
      "(?:\\W|^)" +
        "(?:(?:(\\d{1,2})|(" +
        ordinalPattern +
        ")(?:\\sdia\\sde\\s|\\sde\\s|\\s))*" +
        "(" +
        monthPattern +
        "(?:\\W|$)",
      "i"
    ),
    (match, context, options, ref) => {
      const num = match.captures[0].toLowerCase().trim();
      const ord = match.captures[1].toLowerCase().trim();
      const mon = match.captures[2].toLowerCase().trim();

      const monInt = MONTH_OFFSET[mon];
      if (monInt === undefined) {
        return false;
      }

      context.month = monInt;

      if (ord !== "") {
        const ordInt = ORDINAL_WORDS[ord];
        if (ordInt === undefined) {
          return false;
        }
        context.day = ordInt;
      }

      if (num !== "") {
        const numInt = parseInt(num, 10);
        if (isNaN(numInt)) {
          return false;
        }
        context.day = numInt;
      }

      return true;
    }
  );
}
