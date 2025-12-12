import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";
import { TRADITION_HOUR_WORDS, TRADITION_MINUTE_WORDS, compressStr } from "./constants";

export function traditionHour(strategy: Strategy = "override"): Rule {
  return createRule(
    new RegExp(
      "(?:(子\\s?时|丑\\s?时|寅\\s?时|卯\\s?时|辰\\s?时|巳\\s?时|午\\s?时|未\\s?时|申\\s?时|酉\\s?时|戌\\s?时|亥\\s?时))\\s?" +
        "(?:(一\\s?刻|二\\s?刻|两\\s?刻|三\\s?刻|四\\s?刻|五\\s?刻|六\\s?刻|七\\s?刻|1\\s?刻|2\\s?刻|3\\s?刻|4\\s?刻|5\\s?刻|6\\s?刻|7\\s?刻))?"
    ),
    (match, context, options, ref) => {
      if (context.hour !== null && strategy !== "override") {
        return false;
      }

      const hour = TRADITION_HOUR_WORDS[compressStr(match.captures[0])];
      if (hour === undefined) {
        return false;
      }

      context.hour = hour;
      context.minute = 0;
      context.second = 0;

      const minuteStr = compressStr(match.captures[1]);
      if (minuteStr) {
        let minute = TRADITION_MINUTE_WORDS[minuteStr];
        if (minute !== undefined) {
          if (minute > 60) {
            context.hour = hour + 1;
            context.minute = minute - 60;
          } else {
            context.minute = minute;
          }
        }
      }

      return true;
    }
  );
}
