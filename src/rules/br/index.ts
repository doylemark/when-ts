import type { Rule } from "../../types";
import { casualDate } from "./casualDate";
import { casualTime } from "./casualTime";
import { hour } from "./hour";
import { hourMinute } from "./hourMinute";
import { deadline } from "./deadline";
import { pastTime } from "./pastTime";
import { exactMonthDate } from "./exactMonthDate";
import { weekday } from "./weekday";

export {
  casualDate,
  casualTime,
  hour,
  hourMinute,
  deadline,
  pastTime,
  exactMonthDate,
  weekday,
};
export * from "./constants";

// Pre-configured rules with default "override" strategy
export const all: Rule[] = [
  weekday(),
  casualDate(),
  casualTime(),
  hour(),
  hourMinute(),
  deadline(),
  pastTime(),
  exactMonthDate(),
];
