import type { Rule } from "../../types";
import { weekday } from "./weekday";
import { casualDate } from "./casualDate";
import { casualTime } from "./casualTime";
import { hourMinute } from "./hourMinute";
import { exactMonthDate } from "./exactMonthDate";
import { traditionHour } from "./traditionHour";
import { afterTime } from "./afterTime";

export { weekday, casualDate, casualTime, hourMinute, exactMonthDate, traditionHour, afterTime };
export * from "./constants";

// Pre-configured rules with default "override" strategy
// Order matches the Go implementation in zh.go
export const all: Rule[] = [
  weekday(),
  casualDate(),
  casualTime(),
  hourMinute(),
  exactMonthDate(),
  traditionHour(),
  afterTime(),
];
