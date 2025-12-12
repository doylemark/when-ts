import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

export function hourMinute(strategy: Strategy = "override"): Rule {
  return createRule(
    /(?:\W|^)((?:[0-1]?[0-9])|(?:2[0-3]))(?::|：|-)([0-5][0-9])(?:\s*(A\.|P\.|A\.M\.|P\.M\.|AM?|PM?))?(?:\W|$)/i,
    (match, context, options, ref) => {
      if (
        (context.hour !== null || context.minute !== null) &&
        strategy !== "override"
      ) {
        return false;
      }

      let hourNum = parseInt(match.captures[0], 10);
      const minutes = parseInt(match.captures[1], 10);

      if (minutes > 59) {
        return false;
      }
      context.minute = minutes;

      const meridiem = match.captures[2];
      if (meridiem && meridiem.length > 0) {
        if (hourNum > 12) {
          return false;
        }
        const first = meridiem[0].toUpperCase();
        if (first === "A") {
          // AM
          context.hour = hourNum;
        } else {
          // PM
          if (hourNum < 12) {
            hourNum += 12;
          }
          context.hour = hourNum;
        }
      } else {
        if (hourNum > 23) {
          return false;
        }
        context.hour = hourNum;
      }

      context.second = 0;
      return true;
    }
  );
}
