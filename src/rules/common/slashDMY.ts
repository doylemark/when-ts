import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

// Days in each month (index 0 unused, 1 = January, etc.)
const MONTHS_DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function getDays(year: number, month: number): number {
  // naive leap year check (same as Go implementation)
  if ((year - 2000) % 4 === 0 && month === 2) {
    return 29;
  }
  return MONTHS_DAYS[month];
}

export function slashDMY(strategy: Strategy = "override"): Rule {
  return createRule(
    /(?:\W|^)(0?[1-9]|1[0-9]|2[0-9]|3[01])[\/\\](0?[1-9]|1[0-2])(?:[\/\\]((?:1|2)[0-9]{3})\s*)?(?:\W|$)/i,
    (match, context, options, ref) => {
      if (
        (context.day !== null ||
          context.month !== null ||
          context.year !== null) &&
        strategy !== "override"
      ) {
        return false;
      }

      const day = parseInt(match.captures[0], 10);
      const month = parseInt(match.captures[1], 10);
      let year = match.captures[2] ? parseInt(match.captures[2], 10) : -1;

      if (day === 0) {
        return false;
      }

      // WithYear logic
      const setWithYear = () => {
        if (getDays(year, month) >= day) {
          context.year = year;
          context.month = month;
          context.day = day;
          return true;
        } else {
          return false;
        }
      };

      if (year !== -1) {
        return setWithYear();
      }

      const refMonth = ref.getUTCMonth() + 1; // JS months are 0-indexed
      const refDay = ref.getUTCDate();
      const refYear = ref.getUTCFullYear();

      if (refMonth > month) {
        year = refYear + 1;
        return setWithYear();
      }

      if (refMonth === month) {
        if (getDays(refYear, month) >= day) {
          if (day > refDay) {
            year = refYear;
          } else if (day < refDay) {
            year = refYear + 1;
          } else {
            // Same day - return false (no match for current day)
            return false;
          }
          return setWithYear();
        } else {
          return false;
        }
      }

      // refMonth < month - date is in the future of current year
      year = refYear;
      return setWithYear();
    }
  );
}
