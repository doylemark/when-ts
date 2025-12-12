import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

export function dotDateTime(strategy: Strategy = "override"): Rule {
  return createRule(
    /(?:^|\b)(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2}))?(?:\b|$)/iu,
    (match, context, options, ref) => {
      if ((context.day !== null || context.month !== null || context.year !== null || context.hour !== null || context.minute !== null) && strategy !== "override") {
        return false;
      }

      const day = parseInt(match.captures[0], 10);
      const month = parseInt(match.captures[1], 10);
      const year = parseInt(match.captures[2], 10);

      let hour = 0;
      let minute = 0;
      if (match.captures[3] !== "" && match.captures[4] !== "") {
        hour = parseInt(match.captures[3], 10);
        minute = parseInt(match.captures[4], 10);
      }

      // Validate date values
      if (day > 0 && day <= 31 && month > 0 && month <= 12) {
        context.day = day;
        context.month = month;
        context.year = year;
        context.hour = hour;
        context.minute = minute;
        return true;
      }

      return false;
    }
  );
}
