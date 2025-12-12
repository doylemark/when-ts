import type { Context } from "./rules/context";
import type { Match } from "./rules/match";

export type Strategy = "skip" | "merge" | "override";

export interface Options {
  afternoon?: number;
  evening?: number;
  morning?: number;
  noon?: number;
  distance?: number;
  matchByOrder?: boolean;
}

export interface Rule {
  find(text: string): Match | null;
}

export interface ParseResult {
  index: number;
  text: string;
  source: string;
  time: Date;
}

export type ParseFn = (text: string, base?: Date) => ParseResult | null;

export interface ParserConfig {
  rules: Rule[];
  middleware?: Array<(text: string) => string>;
  options?: Options;
}

/**
 * The main `when` object provides language-specific date/time parsers.
 *
 * @example
 * ```typescript
 * import { when } from "when-ts";
 *
 * // Use a language-specific parser
 * when.en("tomorrow at 5pm");
 * when.br("amanhã às 17h");
 * when.nl("morgen om 17:00");
 * when.ru("завтра в 17:00");
 * when.zh("明天下午5点");
 *
 * // Create a custom parser
 * const custom = when.create({ rules: [...] });
 * ```
 */
export interface When {
  /** English parser */
  en: ParseFn;
  /** Brazilian Portuguese parser */
  br: ParseFn;
  /** Dutch parser */
  nl: ParseFn;
  /** Russian parser */
  ru: ParseFn;
  /** Chinese parser */
  zh: ParseFn;
  /** Create a custom parser with specific rules */
  create: (config: ParserConfig) => ParseFn;
}

export type Applier = (
  match: Match,
  context: Context,
  options: Options,
  ref: Date
) => boolean;
