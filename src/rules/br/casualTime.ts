import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

export function casualTime(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  return createRule(
    /(?:\W|^)(((?:nesta|esta|ao|à))?\s*(manhã|tarde|noite|meio[- ]dia))/i,
    (match, context, options, ref) => {
      const lower = match.text.toLowerCase().trim();

      if ((context.hour !== null || context.minute !== null) && !overwrite) {
        return false;
      }

      if (lower.includes("tarde")) {
        context.hour = options.afternoon ?? 15;
        context.minute = 0;
        context.second = 0;
      } else if (lower.includes("noite")) {
        context.hour = options.evening ?? 18;
        context.minute = 0;
        context.second = 0;
      } else if (lower.includes("manhã")) {
        context.hour = options.morning ?? 8;
        context.minute = 0;
        context.second = 0;
      } else if (lower.includes("meio-dia") || lower.includes("meio dia")) {
        context.hour = options.noon ?? 12;
        context.minute = 0;
        context.second = 0;
      }

      return true;
    }
  );
}
