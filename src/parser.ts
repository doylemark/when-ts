import type {
  Rule,
  ParseResult,
  Options,
  ParserConfig,
  ParseFn,
} from "./types";
import { Context } from "./rules/context";
import { Match } from "./rules/match";
import { sortByIndex, sortByOrder } from "./rules/sort";

const DEFAULT_OPTIONS: Options = {
  distance: 5,
  matchByOrder: true,
};

// Convert byte index to character index (for UTF-8)
function byteIndexToCharIndex(text: string, byteIndex: number): number {
  const bytes = Buffer.from(text, "utf8");
  let charIndex = 0;
  let currentByteIndex = 0;

  while (currentByteIndex < byteIndex && charIndex < text.length) {
    const charBytes = Buffer.byteLength(text[charIndex], "utf8");
    currentByteIndex += charBytes;
    charIndex++;
  }

  return charIndex;
}

export function createParser(config: ParserConfig): ParseFn {
  const rules = config.rules;
  const middleware = config.middleware ?? [];
  const options = { ...DEFAULT_OPTIONS, ...config.options };

  return function parse(text: string, base?: Date): ParseResult | null {
    const baseTime = base ?? new Date();
    const result: ParseResult = {
      source: text,
      time: baseTime,
      index: -1,
      text: "",
    };

    // Apply middleware
    for (const fn of middleware) {
      text = fn(text);
    }

    // Find all matches
    const matches: Match[] = [];
    let order = 0;
    for (const rule of rules) {
      const match = rule.find(text);
      if (match) {
        match.order = order++;
        matches.push(match);
      }
    }

    // Not found
    if (matches.length === 0) {
      return null;
    }

    // Sort by position and find cluster
    const sorted = sortByIndex(matches);
    let end = sorted[0].right;
    result.index = sorted[0].left;

    const distance = options.distance ?? 5;
    const clustered: Match[] = [];

    for (const match of sorted) {
      if (match.left <= end + distance) {
        clustered.push(match);
        if (match.right > end) {
          end = match.right;
        }
      } else {
        break;
      }
    }

    // Convert byte indices to character indices for slicing
    const startCharIndex = byteIndexToCharIndex(text, result.index);
    const endCharIndex = byteIndexToCharIndex(text, end);
    result.text = text.slice(startCharIndex, endCharIndex);

    // Apply rules
    const toApply = options.matchByOrder ? sortByOrder(clustered) : clustered;

    const context = new Context();
    context.text = result.text;

    let applied = false;
    for (const match of toApply) {
      const ok = match.apply(context, options, result.time);
      applied = ok || applied;
    }

    if (!applied) {
      return null;
    }

    result.time = context.time(result.time);
    return result;
  };
}
