import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export function casualTime(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  return createRule(
    /(?:\W|^)((deze|tussen de |maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag| )\s*(ochtend|morgen|middag|avond))/i,
    (match, context, options, ref) => {
      const lower = match.text.toLowerCase().trim();

      if ((context.weekday !== null || context.hour !== null || context.minute !== null) && !overwrite) {
        return false;
      }

      // Handle weekday prefix
      if (/(maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag)/.test(lower)) {
        let weekday = -1;

        if (lower.includes("maandag")) {
          weekday = 1;
        } else if (lower.includes("dinsdag")) {
          weekday = 2;
        } else if (lower.includes("woensdag")) {
          weekday = 3;
        } else if (lower.includes("donderdag")) {
          weekday = 4;
        } else if (lower.includes("vrijdag")) {
          weekday = 5;
        } else if (lower.includes("zaterdag")) {
          weekday = 6;
        } else if (lower.includes("zondag")) {
          weekday = 7;
        }

        if (weekday !== -1) {
          const refWeekday = ref.getUTCDay();
          context.duration += DAY * ((weekday + 7 - refWeekday) % 7);
        }
      }

      // Handle time of day
      if (lower.includes("middag") && !lower.includes("tussen de middag")) {
        context.hour = options.afternoon ?? 15;
        context.minute = 0;
        context.second = 0;
      } else if (lower.includes("avond")) {
        context.hour = options.evening ?? 18;
        context.minute = 0;
        context.second = 0;
      } else if (lower.includes("ochtend") || lower.includes("morgen")) {
        context.hour = options.morning ?? 8;
        context.minute = 0;
        context.second = 0;
      } else if (lower.includes("tussen de middag")) {
        context.hour = 12;
        context.minute = 0;
        context.second = 0;
      }

      return true;
    }
  );
}
