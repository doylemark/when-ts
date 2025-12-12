import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

export function casualTime(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  return createRule(
    /(?:\W|^)((this)?\s*(morning|afternoon|evening|noon))/i,
    (match, context, options, ref) => {
      const lower = match.text.toLowerCase().trim();

      if ((context.hour !== null || context.minute !== null) && !overwrite) {
        return false;
      }

      if (lower.includes("afternoon")) {
        context.hour = options.afternoon ?? 15;
        context.minute = 0;
        context.second = 0;
      } else if (lower.includes("evening")) {
        context.hour = options.evening ?? 18;
        context.minute = 0;
        context.second = 0;
      } else if (lower.includes("morning")) {
        context.hour = options.morning ?? 8;
        context.minute = 0;
        context.second = 0;
      } else if (lower.includes("noon")) {
        context.hour = options.noon ?? 12;
        context.minute = 0;
        context.second = 0;
      }

      return true;
    }
  );
}
