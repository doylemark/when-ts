import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

export function hourMinute(strategy: Strategy = "override"): Rule {
  return createRule(
    /(?:\W|^)(?:\s*((om)?))((?:[0-1]?[0-9])|(?:2[0-3]))(?::|：)((?:[0-5][0-9]))(?:\s*(U\.?|UUR|A\.|P\.|A\.M\.|P\.M\.|AM?|PM?))?(?:\s*((in de|'s) (middags?|avonds?))?)?(?:\W|$)/i,
    (match, context, options, ref) => {
      if (
        (context.hour !== null || context.minute !== null) &&
        strategy !== "override"
      ) {
        return false;
      }

      const lower = match.text.toLowerCase().trim();
      let hour = parseInt(match.captures[2], 10);
      const minutes = parseInt(match.captures[3], 10);

      if (minutes > 59) {
        return false;
      }
      context.minute = minutes;

      if (hour > 23) {
        return false;
      }
      context.hour = hour;

      // Check for PM indicator
      const meridiem = match.captures[4] || "";
      if (/p\.?(m\.?)?/i.test(meridiem.toLowerCase().trim())) {
        if (hour < 12) {
          hour += 12;
        }
        context.hour = hour;
      }

      // Check for afternoon or evening indicator
      if ((lower.includes("middag") || lower.includes("avond")) && hour < 12) {
        hour += 12;
        context.hour = hour;
      }

      context.second = 0;
      return true;
    }
  );
}
