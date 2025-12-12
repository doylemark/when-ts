import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";
import { INTEGER_WORDS, INTEGER_WORDS_PATTERN, compressStr } from "./constants";

export function hourMinute(strategy: Strategy = "override"): Rule {
  return createRule(
    new RegExp(
      "(?:(凌\\s*晨|早\\s*晨|早\\s*上|上\\s*午|下\\s*午|晚\\s*上|今晚)?\\s*)" +
        "((?:[0-1]{0,1}[0-9])|(?:2[0-3]))?" +
        "(?:\\s*)" +
        "(" +
        INTEGER_WORDS_PATTERN.slice(3) + // Remove leading "(?:"
        "?" +
        "(:|：|-|点)" +
        "((?:[0-5][0-9]))?" +
        "(" +
        INTEGER_WORDS_PATTERN +
        "+)?" +
        "(?:\\W|$)",
      "i"
    ),
    (match, context, options, ref) => {
      if ((context.hour !== null || context.minute !== null) && strategy !== "override") {
        return false;
      }

      // Try to get hour from Chinese words (captures[2]) or digits (captures[1])
      let hour = INTEGER_WORDS[match.captures[2]];
      if (hour === undefined) {
        hour = parseInt(match.captures[1], 10);
        if (isNaN(hour)) {
          hour = 0;
        }
      }

      if (hour > 24) {
        return false;
      }

      // Try to get minutes from Chinese words (captures[5]) or digits (captures[4])
      let minutes = INTEGER_WORDS[match.captures[5]];
      if (minutes === undefined) {
        minutes = parseInt(match.captures[4], 10);
        if (isNaN(minutes)) {
          minutes = 0;
        }
      }

      if (minutes > 59) {
        return false;
      }

      context.minute = minutes;

      const lower = compressStr(match.captures[0]);
      switch (lower) {
        case "上午":
        case "凌晨":
        case "早晨":
        case "早上":
          context.hour = hour;
          break;
        case "下午":
        case "晚上":
        case "今晚":
          if (hour < 12) {
            hour += 12;
          }
          context.hour = hour;
          break;
        case "":
          if (hour > 23) {
            return false;
          }
          context.hour = hour;
          break;
        default:
          context.hour = hour;
      }

      return true;
    }
  );
}
