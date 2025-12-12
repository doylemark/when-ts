import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";
import { MONTH_OFFSET, MONTH_OFFSET_PATTERN } from "./constants";

export function date(strategy: Strategy = "override"): Rule {
  return createRule(
    new RegExp(
      "(?:\\b|^)(\\d{1,2})\\s*(" + MONTH_OFFSET_PATTERN + ")(?:\\s*(\\d{4}))?(?:\\s*в\\s*(\\d{1,2}):(\\d{2}))?(?:\\b|$)",
      "iu"
    ),
    (match, context, options, ref) => {
      if ((context.day !== null || context.month !== null || context.year !== null) || strategy !== "override") {
        return false;
      }

      const day = parseInt(match.captures[0], 10);
      const monthStr = match.captures[1].toLowerCase();
      const month = MONTH_OFFSET[monthStr];

      if (!month) {
        return false;
      }

      let year = ref.getUTCFullYear();
      if (match.captures[2] !== "") {
        year = parseInt(match.captures[2], 10);
      }

      let hour = 0;
      let minute = 0;
      if (match.captures[3] !== "" && match.captures[4] !== "") {
        hour = parseInt(match.captures[3], 10);
        minute = parseInt(match.captures[4], 10);
      }

      context.day = day;
      context.month = month;
      context.year = year;
      context.hour = hour;
      context.minute = minute;

      return true;
    }
  );
}
