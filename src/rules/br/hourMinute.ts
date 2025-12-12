import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

export function hourMinute(strategy: Strategy = "override"): Rule {
  return createRule(
    /(?:\W|^)((?:[0-1]?[0-9])|(?:2[0-3]))(?::|：|-|h)((?:[0-5][0-9]))m*(?:\s*(A\.|P\.|A\.M\.|P\.M\.|AM?|PM?))?(?:\W|$)/i,
    (match, context, options, ref) => {
      if ((context.hour !== null || context.minute !== null) && strategy !== "override") {
        return false;
      }

      let hourNum = parseInt(match.captures[0], 10);
      const minutes = parseInt(match.captures[1], 10);

      if (minutes > 59) {
        return false;
      }
      context.minute = minutes;

      if (match.captures[2] !== "") {
        // AM/PM provided
        if (hourNum > 12) {
          return false;
        }
        const meridiem = match.captures[2][0].toUpperCase();
        if (meridiem === "A") {
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
        // No AM/PM, use 24-hour format
        if (hourNum > 23) {
          return false;
        }
        context.hour = hourNum;
      }

      return true;
    }
  );
}
