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
        "(?:on\\s*?)?" +
        "(?:(this|last|past|next)\\s*)?" +
        "(" +
        weekdayPattern +
        "(?:\\s*(this|last|past|next)\\s*week)?" +
        "(?:\\W|$)",
      "i"
    ),
    (match, context, options, ref) => {
      const day = (match.captures[1] || "").toLowerCase().trim();
      const norm = (
        (match.captures[0] || "") + (match.captures[2] || "")
      ).toLowerCase().trim();
      const direction = norm === "" ? "next" : norm;

      const dayInt = WEEKDAY_OFFSET[day];
      if (dayInt === undefined) {
        return false;
      }

      if (context.duration !== 0 && !overwrite) {
        return false;
      }

      const refWeekday = ref.getUTCDay();

      if (direction.includes("past") || direction.includes("last")) {
        const diff = refWeekday - dayInt;
        if (diff > 0) {
          context.duration = -(diff * DAY);
        } else if (diff < 0) {
          context.duration = -((7 + diff) * DAY);
        } else {
          context.duration = -(7 * DAY);
        }
      } else if (direction.includes("next")) {
        const diff = dayInt - refWeekday;
        if (diff > 0) {
          context.duration = diff * DAY;
        } else if (diff < 0) {
          context.duration = (7 + diff) * DAY;
        } else {
          context.duration = 7 * DAY;
        }
      } else if (direction.includes("this")) {
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
