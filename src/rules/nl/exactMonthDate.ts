import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";
import {
  MONTH_OFFSET,
  MONTH_OFFSET_PATTERN,
  ORDINAL_WORDS,
  ORDINAL_WORDS_PATTERN,
} from "./constants";

export function exactMonthDate(strategy: Strategy = "override"): Rule {
  // Build regex - match patterns like:
  // "derde van maart", "maart derde", "maart 3e", "3e maart", "maart 3"
  // "1e van september", "sept. 1e", "maart 7e", "oktober 21e"
  // "twintigste van december", "maart 10e", "jan. 6"
  // "februari", "oktober", "jul.", "juni"

  // Groups:
  // 1. ordinal day before month (like "derde van" or "3e")
  // 2. numeric day before month
  // 3. month
  // 4. ordinal day after month
  // 5. numeric day after month

  // Strip the (?:  prefix from ORDINAL_WORDS_PATTERN and MONTH_OFFSET_PATTERN
  const ordinalPattern = ORDINAL_WORDS_PATTERN.slice(3);
  const monthPattern = MONTH_OFFSET_PATTERN.slice(3);

  return createRule(
    new RegExp(
      "(?:\\W|^)" +
        "(?:(?:(" +
        ordinalPattern +
        "(?:\\s+van)?|([0-9]+))\\s*)?" +
        "(" +
        monthPattern +
        "(?:\\s*(?:(" +
        ordinalPattern +
        "|([0-9]+)))?" +
        "(?:\\W|$)",
      "i"
    ),
    (match, context, options, ref) => {
      const ord1 = (match.captures[0] || "").toLowerCase().trim();
      const num1 = (match.captures[1] || "").toLowerCase().trim();
      const mon = (match.captures[2] || "").toLowerCase().trim();
      const ord2 = (match.captures[3] || "").toLowerCase().trim();
      const num2 = (match.captures[4] || "").toLowerCase().trim();

      const monInt = MONTH_OFFSET[mon];
      if (monInt === undefined) {
        return false;
      }

      context.month = monInt;

      // Check ordinal before month (strip " van" suffix if present)
      if (ord1 !== "") {
        const cleanOrd = ord1.replace(/\s+van$/, "");
        const ordInt = ORDINAL_WORDS[cleanOrd];
        if (ordInt === undefined) {
          return false;
        }
        context.day = ordInt;
      }

      // Check numeric before month
      if (num1 !== "") {
        const n = parseInt(num1, 10);
        if (isNaN(n)) {
          return false;
        }
        context.day = n;
      }

      // Check ordinal after month
      if (ord2 !== "") {
        const ordInt = ORDINAL_WORDS[ord2];
        if (ordInt === undefined) {
          return false;
        }
        context.day = ordInt;
      }

      // Check numeric after month
      if (num2 !== "") {
        const n = parseInt(num2, 10);
        if (isNaN(n)) {
          return false;
        }
        context.day = n;
      }

      return true;
    }
  );
}
