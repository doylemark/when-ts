import type { When, ParseFn, ParserConfig } from "./types";
import { createParser } from "./parser";
import * as en from "./rules/en";
import * as br from "./rules/br";
import * as nl from "./rules/nl";
import * as ru from "./rules/ru";
import * as zh from "./rules/zh";
import * as common from "./rules/common";

// Re-export types and utilities
export type {
  Rule,
  ParseResult,
  ParseFn,
  Options,
  ParserConfig,
  Strategy,
  Applier,
} from "./types";
export { Context } from "./rules/context";
export { Match } from "./rules/match";
export { createRule } from "./rules/factory";
export { createParser } from "./parser";

// Pre-configured language parsers
const enParser = createParser({ rules: [...en.all, ...common.all] });
const brParser = createParser({ rules: [...br.all, ...common.all] });
const nlParser = createParser({ rules: [...nl.all, ...common.all] });
const ruParser = createParser({ rules: [...ru.all, ...common.all] });
const zhParser = createParser({ rules: [...zh.all, ...common.all] });

/**
 * The main `when` object provides language-specific date/time parsers.
 *
 * **Note:** `when` is not callable directly. Use a language-specific parser:
 *
 * @example
 * ```typescript
 * // Correct usage:
 * when.en("tomorrow at 5pm");
 * when.br("amanhã às 17h");
 * when.nl("morgen om 17:00");
 * when.ru("завтра в 17:00");
 * when.zh("明天下午5点");
 *
 * // Create a custom parser:
 * const custom = when.create({ rules: [...] });
 * custom("in 5 days");
 * ```
 */
export const when: When = {
  en: enParser,
  br: brParser,
  nl: nlParser,
  ru: ruParser,
  zh: zhParser,
  create: createParser,
};
