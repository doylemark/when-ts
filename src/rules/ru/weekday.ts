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
      "(?:\\P{L}|^)" +
        "(?:(на|во?|ко?|до|эт(?:от|ой|у|а)?|прошл(?:ую|ый|ая)|последн(?:юю|ий|ее|ая)|следующ(?:ую|ее|ая|ий))\\s*)?" +
        "(" + weekdayPattern +
        "(?:\\s*на\\s*(этой|прошлой|следующей)\\s*неделе)?" +
        "(?:\\P{L}|$)",
      "iu"
    ),
    (match, context, options, ref) => {
      const day = (match.captures[1] || "").toLowerCase().trim();
      const norm = (match.captures[2] || match.captures[0] || "").toLowerCase().trim();
      const direction = norm === "" ? "следующ" : norm;

      const dayInt = WEEKDAY_OFFSET[day];
      if (dayInt === undefined) {
        return false;
      }

      if (context.duration !== 0 && !overwrite) {
        return false;
      }

      const refWeekday = ref.getUTCDay();

      if (direction.includes("прошл") || direction.includes("последн")) {
        // Last/past week
        const diff = refWeekday - dayInt;
        if (diff > 0) {
          context.duration = -(diff * DAY);
        } else if (diff < 0) {
          context.duration = -((7 + diff) * DAY);
        } else {
          context.duration = -(7 * DAY);
        }
      } else if (
        direction.includes("следующ") ||
        direction === "в" ||
        direction === "к" ||
        direction.includes("во") ||
        direction.includes("ко") ||
        direction.includes("до")
      ) {
        // Next week
        const diff = dayInt - refWeekday;
        if (diff > 0) {
          context.duration = diff * DAY;
        } else if (diff < 0) {
          context.duration = (7 + diff) * DAY;
        } else {
          context.duration = 7 * DAY;
        }
      } else if (direction.includes("эт")) {
        // This week
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
