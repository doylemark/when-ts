import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

export function casualTime(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  return createRule(
    /(?:\W|^)((今天)?\s*(早晨|下午|傍晚|中午|晚上))/i,
    (match, context, options, ref) => {
      const lower = match.text.toLowerCase().trim();

      if ((context.hour !== null || context.minute !== null) && !overwrite) {
        return false;
      }

      if (lower.includes("晚上")) {
        context.hour = options.evening ?? 20;
        context.minute = 0;
        context.second = 0;
      } else if (lower.includes("下午")) {
        context.hour = options.afternoon ?? 15;
        context.minute = 0;
        context.second = 0;
      } else if (lower.includes("傍晚")) {
        context.hour = options.evening ?? 18;
        context.minute = 0;
        context.second = 0;
      } else if (lower.includes("早晨")) {
        context.hour = options.morning ?? 8;
        context.minute = 0;
        context.second = 0;
      } else if (lower.includes("中午")) {
        context.hour = options.noon ?? 12;
        context.minute = 0;
        context.second = 0;
      }

      return true;
    }
  );
}
