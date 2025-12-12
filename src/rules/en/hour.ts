import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

export function hour(strategy: Strategy = "override"): Rule {
  return createRule(
    /(?:\W|^)(\d{1,2})(?:\s*(A\.|P\.|A\.M\.|P\.M\.|AM?|PM?))(?:\W|$)/i,
    (match, context, options, ref) => {
      if (context.hour !== null && strategy !== "override") {
        return false;
      }

      const hourNum = parseInt(match.captures[0], 10);
      if (hourNum > 12) {
        return false;
      }

      const meridiem = match.captures[1][0].toUpperCase();
      if (meridiem === "A") {
        // AM
        context.hour = hourNum;
      } else {
        // PM
        if (hourNum < 12) {
          context.hour = hourNum + 12;
        } else {
          context.hour = hourNum;
        }
      }

      context.minute = 0;
      context.second = 0;
      return true;
    }
  );
}
