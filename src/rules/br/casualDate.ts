import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export function casualDate(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  return createRule(
    /(?:\W|^)(agora|hoje|(?:de\s|nesta\s|esta\s)noite|última(?:s|)\s*noite|(?:amanhã|ontem)\s*|amanhã|ontem)(?:\W|$)/i,
    (match, context, options, ref) => {
      const lower = match.captures[0].toLowerCase().trim();

      // Check for various "tonight" patterns
      if (/(nesta|esta|hoje)(\s|\s([aà]|de)\s)noite/.test(lower)) {
        if ((context.hour === null && context.minute === null) || overwrite) {
          context.hour = 23;
          context.minute = 0;
          context.second = 0;
        }
      } else if (lower.includes("hoje")) {
        // "today" doesn't modify anything (commented in Go as well)
        // context.hour = 18;
      } else if (lower.includes("amanhã")) {
        if (context.duration === 0 || overwrite) {
          context.duration += DAY;
        }
      } else if (lower.includes("ontem")) {
        if (context.duration === 0 || overwrite) {
          context.duration -= DAY;
        }
      } else if (/(ontem|última)(\s|\s([aà]|de)\s)noite/.test(lower)) {
        if ((context.hour === null && context.duration === 0) || overwrite) {
          context.hour = 23;
          context.minute = 0;
          context.second = 0;
          context.duration -= DAY;
        }
      }
      // "agora" (now) doesn't modify anything

      return true;
    }
  );
}
