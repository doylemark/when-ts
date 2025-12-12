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
        "(?:op\\s*?)?" +
        "(?:(deze|vorige|vorige week|afgelopen|volgende|volgende week|komende|komende week)\\s*)?" +
        "(" +
        weekdayPattern +
        "(?:\\s*(deze|vorige|afgelopen|volgende|komende)\\s*week)?" +
        "(?:\\W|$)",
      "i"
    ),
    (match, context, options, ref) => {
      const day = (match.captures[1] || "").toLowerCase().trim();
      const norm = (
        (match.captures[0] || "") + (match.captures[2] || "")
      ).toLowerCase().trim();
      const direction = norm === "" ? "volgende" : norm;

      let dayInt = WEEKDAY_OFFSET[day];
      if (dayInt === undefined) {
        return false;
      }

      if (context.duration !== 0 && !overwrite) {
        return false;
      }

      const refWeekday = ref.getUTCDay();

      // Handle "vorige week" (last week)
      if (direction.includes("vorige week")) {
        if (dayInt === 6) {
          dayInt = -1;
        }
        const diff = refWeekday - dayInt;
        if (diff !== 0 && dayInt <= 0) {
          context.duration = -(diff * DAY);
        } else if (diff !== 0) {
          context.duration = -((7 + diff) * DAY);
        } else {
          context.duration = -(7 * DAY);
        }
      }
      // Handle "afgelopen" or "vorige" (past/last)
      else if (direction.includes("afgelopen") || direction.includes("vorige")) {
        const diff = refWeekday - dayInt;
        if (diff > 0) {
          context.duration = -(diff * DAY);
        } else if (diff < 0) {
          context.duration = -((7 + diff) * DAY);
        } else {
          context.duration = -(7 * DAY);
        }
      }
      // Handle "volgende week" (next week)
      else if (direction.includes("volgende week")) {
        if (dayInt === 0) {
          dayInt = 7;
        }
        const diff = dayInt - refWeekday;
        context.duration = (7 + diff) * DAY;
      }
      // Handle "volgende" or "komende" (next/upcoming)
      else if (direction.includes("volgende") || direction.includes("komende")) {
        const diff = dayInt - refWeekday;
        if (diff > 0) {
          context.duration = diff * DAY;
        } else if (diff < 0) {
          context.duration = (7 + diff) * DAY;
        } else {
          context.duration = 7 * DAY;
        }
      }
      // Handle "deze" (this)
      else if (direction.includes("deze")) {
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
