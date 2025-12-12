import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

export function casualTime(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  return createRule(
    /(?:\P{L}|^)(((это|этим|этот|этим|до|к|после)?\s*(утр(?:ом|а|у)|вечер(?:у|ом|а)|обеда?)))(?:\P{L}|$)/iu,
    (match, context, options, ref) => {
      const lower = match.captures[0].toLowerCase().trim();

      if ((context.hour !== null || context.minute !== null) && !overwrite) {
        return false;
      }

      if (lower.includes("после обеда")) {
        context.hour = options.afternoon ?? 15;
        context.minute = 0;
        context.second = 0;
      } else if (lower.includes("вечер")) {
        context.hour = options.evening ?? 18;
        context.minute = 0;
        context.second = 0;
      } else if (lower.includes("утр")) {
        context.hour = options.morning ?? 8;
        context.minute = 0;
        context.second = 0;
      } else if (lower.includes("обед")) {
        context.hour = options.noon ?? 12;
        context.minute = 0;
        context.second = 0;
      }

      return true;
    }
  );
}
