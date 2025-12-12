import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

export function hourMinute(strategy: Strategy = "override"): Rule {
  return createRule(
    /(?:^|\s|[^0-9])((?:[0-1]?[0-9])|(?:2[0-3]))(?::|：|-|\.)((?:[0-5][0-9]))(?:\s*(утра|вечера|дня))?(?:\s|[^0-9]|$)/iu,
    (match, context, options, ref) => {
      if ((context.hour !== null || context.minute !== null) && strategy !== "override") {
        return false;
      }

      let hourNum = parseInt(match.captures[0], 10);
      const minuteNum = parseInt(match.captures[1], 10);
      const meridiem = match.captures[2];

      context.minute = minuteNum;

      if (meridiem !== "") {
        if (hourNum > 12) {
          return false;
        }

        switch (meridiem) {
          case "утра": // morning (AM)
            context.hour = hourNum;
            break;
          case "вечера": // evening (PM)
          case "дня": // day (PM)
            if (hourNum < 12) {
              hourNum += 12;
            }
            context.hour = hourNum;
            break;
        }
      } else {
        context.hour = hourNum;
      }

      return true;
    }
  );
}
