import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export function casualDate(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  return createRule(
    /(?:\P{L}|^)(((?:до|прямо)\s+)?(сейчас|сегодня|завтра|вчера))(?:\P{L}|$)/iu,
    (match, context, options, ref) => {
      const lower = match.captures[0].toLowerCase().trim();

      if (lower.includes("сегодня")) {
        // "today" - doesn't modify anything
      } else if (lower.includes("завтра")) {
        if (context.duration === 0 || overwrite) {
          context.duration += DAY;
        }
      } else if (lower.includes("вчера")) {
        if (context.duration === 0 || overwrite) {
          context.duration -= DAY;
        }
      }
      // "сейчас" (now) doesn't modify anything

      return true;
    }
  );
}
