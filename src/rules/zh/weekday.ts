import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";
import { WEEKDAY_OFFSET } from "./constants";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export function weekday(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  return createRule(
    new RegExp(
      "(?:(本|这|下|上|这个|下个|上个|下下)\\s*)?" +
        "(?:(周|礼拜|星期)\\s*)" +
        "(1|2|3|4|5|6|天|一|二|三|四|五|六|日)" +
        "(?:\\W|$)",
      "i"
    ),
    (match, context, options, ref) => {
      // Check if prefix exists (captures[1] is the "礼拜", "星期" etc part)
      if (match.captures[1].trim() === "") {
        return false;
      }

      const day = match.captures[2].toLowerCase().trim();
      let norm = match.captures[0].toLowerCase().trim();
      if (norm === "") {
        norm = "本";
      }

      const dayInt = WEEKDAY_OFFSET[day];
      if (dayInt === undefined) {
        return false;
      }

      if (context.duration !== 0 && !overwrite) {
        return false;
      }

      const refWeekday = ref.getUTCDay();

      // Convert Sunday from 0 to 7 for Chinese weekday system
      const zhDayInt = dayInt === 0 ? 7 : dayInt;
      const zhRefWeekday = refWeekday === 0 ? 7 : refWeekday;

      if (norm.includes("上")) {
        const diff = zhRefWeekday - zhDayInt;
        context.duration = -(7 + diff) * DAY;
      } else if (norm.includes("下下")) {
        const diff = zhDayInt - zhRefWeekday;
        context.duration = (7 + 7 + diff) * DAY;
      } else if (norm.includes("下")) {
        const diff = zhDayInt - zhRefWeekday;
        context.duration = (7 + diff) * DAY;
      } else if (norm.includes("本") || norm.includes("这")) {
        if (zhRefWeekday < zhDayInt) {
          const diff = zhDayInt - zhRefWeekday;
          if (diff > 0) {
            context.duration = diff * DAY;
          } else if (diff < 0) {
            context.duration = (7 + diff) * DAY;
          } else {
            context.duration = 7 * DAY;
          }
        } else if (zhRefWeekday > zhDayInt) {
          const diff = zhRefWeekday - zhDayInt;
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
