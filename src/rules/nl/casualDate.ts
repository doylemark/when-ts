import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export function casualDate(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  return createRule(
    /(?:\W|^)(nu|vandaag|vanavond|vannacht|afgelopen\s*nacht|morgen|gister|gisteren)(ochtend|morgen|middag|avond)?(?:\W|$)/i,
    (match, context, options, ref) => {
      const lower = match.text.toLowerCase().trim();

      // Handle time of day modifiers (ochtend, morgen, middag, avond)
      if (/ochtend|\s*morgen|middag|avond/.test(lower)) {
        if (/ochtend/.test(lower) || /(?:\W|^)(\s*morgen)(?:\W|$)/i.test(lower)) {
          context.hour = options.morning ?? 8;
        } else if (lower.includes("middag")) {
          context.hour = options.afternoon ?? 15;
        } else if (lower.includes("avond")) {
          context.hour = options.evening ?? 18;
        }
      }

      // Handle day references
      if (lower.includes("vannacht")) {
        if ((context.hour === null && context.minute === null) || overwrite) {
          context.hour = 23;
          context.minute = 0;
          context.second = 0;
        }
      } else if (lower.includes("morgen")) {
        if (context.duration === 0 || overwrite) {
          context.duration += DAY;
        }
      } else if (lower.includes("gister")) {
        if (context.duration === 0 || overwrite) {
          context.duration -= DAY;
        }
      } else if (lower.includes("afgelopen nacht")) {
        if ((context.hour === null && context.duration === 0) || overwrite) {
          context.hour = 23;
          context.minute = 0;
          context.second = 0;
          context.duration -= DAY;
        }
      }
      // "vandaag", "nu", and "vanavond" handled by time of day or don't modify

      return true;
    }
  );
}
