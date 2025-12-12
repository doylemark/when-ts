import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export function casualDate(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  return createRule(
    /(?:\W|^)(now|today|tonight|last\s*night|(?:tomorrow|tmr|yesterday)\s*|tomorrow|tmr|yesterday)(?:\W|$)/i,
    (match, context, options, ref) => {
      const lower = match.text.toLowerCase().trim();

      if (lower.includes("tonight")) {
        if ((context.hour === null && context.minute === null) || overwrite) {
          context.hour = 23;
          context.minute = 0;
          context.second = 0;
        }
      } else if (lower.includes("tomorrow") || lower.includes("tmr")) {
        if (context.duration === 0 || overwrite) {
          context.duration += DAY;
        }
      } else if (lower.includes("yesterday")) {
        if (context.duration === 0 || overwrite) {
          context.duration -= DAY;
        }
      } else if (lower.includes("last night")) {
        if ((context.hour === null && context.duration === 0) || overwrite) {
          context.hour = 23;
          context.minute = 0;
          context.second = 0;
          context.duration -= DAY;
        }
      }
      // "today" and "now" don't modify anything

      return true;
    }
  );
}
