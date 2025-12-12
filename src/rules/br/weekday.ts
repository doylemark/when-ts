import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";
import { WEEKDAY_OFFSET, WEEKDAY_OFFSET_PATTERN } from "./constants";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export function weekday(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  // Strip the (?:  prefix from WEEKDAY_OFFSET_PATTERN
  const weekdayPattern = WEEKDAY_OFFSET_PATTERN.slice(3);

  return createRule(
    new RegExp(
      "(?:\\W|^)" +
        "(?:n[ao]\\s*?)?" +
        "(?:(nest[ae]|ess[ae]|últim[a|o]|próxim[ao])\\s*)?" +
        "(" +
        weekdayPattern +
        "(?:\\s*(passad[ao]|que\\svem))?" +
        "(?:\\W|$)",
      "i"
    ),
    (match, context, options, ref) => {
      const day = (match.captures[1] || "").toLowerCase().trim();
      const norm = (
        (match.captures[0] || "") +
        (match.captures[2] || "")
      ).toLowerCase().trim();

      // Default direction if none specified
      const direction = norm === "" ? "próxim" : norm;

      const dayInt = WEEKDAY_OFFSET[day];
      if (dayInt === undefined) {
        return false;
      }

      if (context.duration !== 0 && !overwrite) {
        return false;
      }

      const refWeekday = ref.getUTCDay();

      if (direction.includes("passad") || direction.includes("últim")) {
        const diff = refWeekday - dayInt;
        if (diff > 0) {
          context.duration = -(diff * DAY);
        } else if (diff < 0) {
          context.duration = -((7 + diff) * DAY);
        } else {
          context.duration = -(7 * DAY);
        }
      } else if (direction.includes("próxim") || direction.includes("que vem")) {
        const diff = dayInt - refWeekday;
        if (diff > 0) {
          context.duration = diff * DAY;
        } else if (diff < 0) {
          context.duration = (7 + diff) * DAY;
        } else {
          context.duration = 7 * DAY;
        }
      } else if (direction.includes("nest") || direction.includes("ess")) {
        if (refWeekday < dayInt) {
          const diff = dayInt - refWeekday;
          if (diff > 0) {
            context.duration = diff * DAY;
          } else if (diff < 0) {
            context.duration = (7 + diff) * DAY;
          } else {
            context.duration = 7 * DAY;
          }
        } else if (refWeekday > dayInt) {
          const diff = refWeekday - dayInt;
          if (diff > 0) {
            context.duration = -(diff * DAY);
          } else if (diff < 0) {
            context.duration = -((7 + diff) * DAY);
          } else {
            context.duration = -(7 * DAY);
          }
        }
        // If same day, duration stays 0
      }

      return true;
    }
  );
}
