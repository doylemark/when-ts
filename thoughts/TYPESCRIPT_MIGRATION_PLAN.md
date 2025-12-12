# when.ts - TypeScript Migration Implementation Plan

## Overview

Rewrite the `when` natural language date/time parser library from Go to TypeScript using Bun as the runtime and test framework. The approach is **test-driven**: write the complete test suite first, then implement rules, and finally the parser.

## Current State Analysis

### Go Library Structure
- **Parser**: `when.go` - Main entry point with `Parser` struct
- **Rule System**: `rules/rules.go` - Core `Rule` interface, `Match`, `F` factory
- **Context**: `rules/context.go` - Accumulates parsed time components
- **Languages**: 5 language packs (en, br, nl, ru, zh) + common rules
- **Total Rules**: 39 individual rules across all languages
- **Test Cases**: ~392 test cases across 40 test files

### Key Discoveries:
- Rules use regex patterns with applier functions (`rules/rules.go:45-48`)
- Context uses nullable pointers to distinguish unset vs zero values (`rules/context.go:12`)
- Parser clusters nearby matches within configurable distance (`when.go:81-88`)
- Strategy enum controls how rules interact: Skip, Merge, Override (`rules/rules.go:8-14`)

## Desired End State

A fully functional TypeScript/Bun library with:
- 100% test parity with the Go implementation
- Idiomatic functional TypeScript API
- All 5 language packs + common rules
- Published as an npm package

### Target API:

```typescript
import { when } from "when-ts";

// Pre-configured language parsers
when.en("tomorrow at 5pm");
when.br("amanhã às 17h");
when.nl("morgen om 17:00");
when.ru("завтра в 17:00");
when.zh("明天下午5点");

// With explicit base time
when.en("next friday", new Date());

// Custom parser
import { casualDate, deadline } from "when-ts/rules/en";
import { slashDMY } from "when-ts/rules/common";

const custom = when.create({
  rules: [casualDate(), deadline(), slashDMY()]
});
custom("in 5 days");
```

### Verification:
- All ~392 test cases pass with `bun test`
- API is intuitive for TypeScript developers
- Bundle size is reasonable (<50KB minified)

## What We're NOT Doing

- Adding new features beyond the Go library
- Changing rule behavior (exact parity required)
- Supporting Node.js directly (Bun-first, though compatible)
- Implementing additional languages
- Breaking changes to the parsing algorithm

## Implementation Approach

**Test-Driven Development**: Write all tests first, watch them fail, then implement until they pass.

## Phase 1: Project Setup & Test Infrastructure

### Overview
Initialize the Bun/TypeScript project and establish the test infrastructure that mirrors the Go test patterns.

### Changes Required:

#### 1. Initialize Project
**File**: `package.json`
```json
{
  "name": "when-ts",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./rules/en": {
      "import": "./dist/rules/en/index.js",
      "types": "./dist/rules/en/index.d.ts"
    },
    "./rules/br": {
      "import": "./dist/rules/br/index.js",
      "types": "./dist/rules/br/index.d.ts"
    },
    "./rules/nl": {
      "import": "./dist/rules/nl/index.js",
      "types": "./dist/rules/nl/index.d.ts"
    },
    "./rules/ru": {
      "import": "./dist/rules/ru/index.js",
      "types": "./dist/rules/ru/index.d.ts"
    },
    "./rules/zh": {
      "import": "./dist/rules/zh/index.js",
      "types": "./dist/rules/zh/index.d.ts"
    },
    "./rules/common": {
      "import": "./dist/rules/common/index.js",
      "types": "./dist/rules/common/index.d.ts"
    }
  },
  "scripts": {
    "test": "bun test",
    "build": "bun build ./src/index.ts --outdir ./dist --target bun",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.3.0"
  }
}
```

**File**: `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 2. Directory Structure
```
src/
├── index.ts                    # Main exports (when object)
├── parser.ts                   # createParser function
├── types.ts                    # Core types (Rule, Match, Context, etc.)
├── rules/
│   ├── index.ts               # Rules exports
│   ├── context.ts             # Context type and functions
│   ├── match.ts               # Match type
│   ├── sort.ts                # Sorting utilities
│   ├── common/
│   │   ├── index.ts
│   │   ├── slashDMY.ts
│   │   └── __tests__/
│   │       └── slashDMY.test.ts
│   ├── en/
│   │   ├── index.ts           # Exports all rules + all array
│   │   ├── constants.ts       # WEEKDAY_OFFSET, MONTH_OFFSET, etc.
│   │   ├── casualDate.ts
│   │   ├── casualTime.ts
│   │   ├── hour.ts
│   │   ├── hourMinute.ts
│   │   ├── deadline.ts
│   │   ├── pastTime.ts
│   │   ├── exactMonthDate.ts
│   │   ├── weekday.ts
│   │   └── __tests__/
│   │       ├── casual.test.ts
│   │       ├── hour.test.ts
│   │       ├── hourMinute.test.ts
│   │       ├── deadline.test.ts
│   │       ├── pastTime.test.ts
│   │       ├── exactMonthDate.test.ts
│   │       ├── weekday.test.ts
│   │       └── integration.test.ts
│   ├── br/                    # Same structure as en/
│   ├── nl/                    # Same structure as en/
│   ├── ru/                    # Same structure as en/
│   └── zh/                    # Same structure as en/
```

#### 3. Test Helper Infrastructure
**File**: `src/test-utils.ts`
```typescript
import { expect, describe, it } from "bun:test";
import type { ParseFn } from "./types";

export interface Fixture {
  text: string;
  index: number;
  phrase: string;
  diff: number; // milliseconds
}

export function applyFixtures(
  name: string,
  parse: ParseFn,
  fixtures: Fixture[],
  baseTime: Date
) {
  describe(name, () => {
    fixtures.forEach((fixture, i) => {
      it(`should parse "${fixture.text}"`, () => {
        const result = parse(fixture.text, baseTime);
        expect(result).not.toBeNull();
        expect(result!.index).toBe(fixture.index);
        expect(result!.text).toBe(fixture.phrase);
        expect(result!.time.getTime() - baseTime.getTime()).toBe(fixture.diff);
      });
    });
  });
}

export function applyFixturesNil(
  name: string,
  parse: ParseFn,
  fixtures: Fixture[],
  baseTime: Date
) {
  describe(name, () => {
    fixtures.forEach((fixture, i) => {
      it(`should not parse "${fixture.text}"`, () => {
        const result = parse(fixture.text, baseTime);
        expect(result).toBeNull();
      });
    });
  });
}

// Reference times matching Go tests
export const EN_NULL_TIME = new Date(Date.UTC(2016, 0, 6, 0, 0, 0)); // Jan 6, 2016 (Wednesday)
export const ZH_NULL_TIME = new Date(Date.UTC(2022, 2, 14, 0, 0, 0)); // Mar 14, 2022 (Monday)
export const COMMON_NULL_TIME = new Date(Date.UTC(2016, 6, 15, 0, 0, 0)); // Jul 15, 2016 (Friday)

// Time constants in milliseconds
export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
```

### Success Criteria:

#### Automated Verification:
- [x] `bun install` completes without errors
- [x] `bun run typecheck` passes (once stub types are in place)
- [x] Project structure matches specification

#### Manual Verification:
- [x] Directory structure is correct
- [x] Test utilities are properly typed

---

## Phase 2: Write Complete Test Suite

### Overview
Port all ~392 test cases from Go to TypeScript/Bun tests. Tests will fail initially (TDD red phase).

### Changes Required:

#### 1. English Test Files

**File**: `src/rules/en/__tests__/casual.test.ts`
```typescript
import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR, DAY } from "../../../test-utils";
import { when } from "../../../index";
import { casualDate, casualTime } from "../index";

describe("en.CasualDate", () => {
  const fixtures = [
    { text: "The Deadline is now, ok", index: 16, phrase: "now", diff: 0 },
    { text: "The Deadline is today", index: 16, phrase: "today", diff: 0 },
    { text: "The Deadline is tonight", index: 16, phrase: "tonight", diff: 23 * HOUR },
    { text: "The Deadline is tomorrow evening", index: 16, phrase: "tomorrow", diff: DAY },
    { text: "The Deadline is yesterday evening", index: 16, phrase: "yesterday", diff: -DAY },
  ];

  const parse = when.create({ rules: [casualDate("skip")] });
  applyFixtures("en.CasualDate", parse, fixtures, EN_NULL_TIME);
});

describe("en.CasualTime", () => {
  const fixtures = [
    { text: "The Deadline was this morning ", index: 17, phrase: "this morning", diff: 8 * HOUR },
    { text: "The Deadline was this noon ", index: 17, phrase: "this noon", diff: 12 * HOUR },
    { text: "The Deadline was this afternoon ", index: 17, phrase: "this afternoon", diff: 15 * HOUR },
    { text: "The Deadline was this evening ", index: 17, phrase: "this evening", diff: 18 * HOUR },
  ];

  const parse = when.create({ rules: [casualTime("skip")] });
  applyFixtures("en.CasualTime", parse, fixtures, EN_NULL_TIME);
});

describe("en.CasualDate|en.CasualTime", () => {
  const fixtures = [
    { text: "The Deadline is tomorrow this afternoon ", index: 16, phrase: "tomorrow this afternoon", diff: (15 + 24) * HOUR },
  ];

  const parse = when.create({
    rules: [casualDate("skip"), casualTime("override")]
  });
  applyFixtures("en.CasualDate|en.CasualTime", parse, fixtures, EN_NULL_TIME);
});
```

**File**: `src/rules/en/__tests__/deadline.test.ts`
```typescript
import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, SECOND, MINUTE, HOUR, DAY, WEEK } from "../../../test-utils";
import { when } from "../../../index";
import { deadline } from "../index";

describe("en.Deadline", () => {
  const fixtures = [
    { text: "within half an hour", index: 0, phrase: "within half an hour", diff: HOUR / 2 },
    { text: "within 1 hour", index: 0, phrase: "within 1 hour", diff: HOUR },
    { text: "in 5 minutes", index: 0, phrase: "in 5 minutes", diff: 5 * MINUTE },
    { text: "In 5 minutes I will go home", index: 0, phrase: "In 5 minutes", diff: 5 * MINUTE },
    { text: "we have to do something within 10 days.", index: 24, phrase: "within 10 days", diff: 10 * DAY },
    { text: "we have to do something in five days.", index: 24, phrase: "in five days", diff: 5 * DAY },
    { text: "we have to do something in 5 days.", index: 24, phrase: "in 5 days", diff: 5 * DAY },
    { text: "In 5 seconds A car need to move", index: 0, phrase: "In 5 seconds", diff: 5 * SECOND },
    { text: "within two weeks", index: 0, phrase: "within two weeks", diff: 2 * WEEK },
    { text: "within a month", index: 0, phrase: "within a month", diff: 31 * DAY },
    { text: "within a few months", index: 0, phrase: "within a few months", diff: 91 * DAY },
    { text: "within one year", index: 0, phrase: "within one year", diff: 366 * DAY },
    { text: "in a week", index: 0, phrase: "in a week", diff: WEEK },
  ];

  const parse = when.create({ rules: [deadline("skip")] });
  applyFixtures("en.Deadline", parse, fixtures, EN_NULL_TIME);
});
```

**File**: `src/rules/en/__tests__/hour.test.ts`
```typescript
import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR, MINUTE } from "../../../test-utils";
import { when } from "../../../index";
import { hour } from "../index";

describe("en.Hour", () => {
  const fixtures = [
    { text: "5pm", index: 0, phrase: "5pm", diff: 17 * HOUR },
    { text: "5 pm", index: 0, phrase: "5 pm", diff: 17 * HOUR },
    { text: "5am", index: 0, phrase: "5am", diff: 5 * HOUR },
    { text: "5 am", index: 0, phrase: "5 am", diff: 5 * HOUR },
    { text: "at 5 am", index: 3, phrase: "5 am", diff: 5 * HOUR },
    { text: "5 A.M.", index: 0, phrase: "5 A.M.", diff: 5 * HOUR },
    { text: "5 P.M.", index: 0, phrase: "5 P.M.", diff: 17 * HOUR },
    { text: "11 P.M.", index: 0, phrase: "11 P.M.", diff: 23 * HOUR },
    { text: "11 PM.", index: 0, phrase: "11 PM", diff: 23 * HOUR },
  ];

  const parse = when.create({ rules: [hour("skip")] });
  applyFixtures("en.Hour", parse, fixtures, EN_NULL_TIME);
});
```

**File**: `src/rules/en/__tests__/hourMinute.test.ts`
```typescript
import { describe } from "bun:test";
import { applyFixtures, applyFixturesNil, EN_NULL_TIME, HOUR, MINUTE } from "../../../test-utils";
import { when } from "../../../index";
import { hourMinute, hour } from "../index";

describe("en.HourMinute", () => {
  const fixtures = [
    { text: "5:30pm", index: 0, phrase: "5:30pm", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "5:30 pm", index: 0, phrase: "5:30 pm", diff: (17 * HOUR) + (30 * MINUTE) },
    { text: "5:30", index: 0, phrase: "5:30", diff: (5 * HOUR) + (30 * MINUTE) },
    { text: "05:30", index: 0, phrase: "05:30", diff: (5 * HOUR) + (30 * MINUTE) },
    { text: "5:59", index: 0, phrase: "5:59", diff: (5 * HOUR) + (59 * MINUTE) },
    { text: "5-30", index: 0, phrase: "5-30", diff: (5 * HOUR) + (30 * MINUTE) },
  ];

  const nilFixtures = [
    { text: "35:30", index: 0, phrase: "", diff: 0 },
    { text: "5:65", index: 0, phrase: "", diff: 0 },
    { text: "15:30pm", index: 0, phrase: "", diff: 0 },
  ];

  const parse = when.create({ rules: [hourMinute("skip"), hour("skip")] });

  applyFixtures("en.HourMinute", parse, fixtures, EN_NULL_TIME);
  applyFixturesNil("en.HourMinute nil", parse, nilFixtures, EN_NULL_TIME);
});
```

**File**: `src/rules/en/__tests__/weekday.test.ts`
```typescript
import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR, DAY } from "../../../test-utils";
import { when } from "../../../index";
import { weekday } from "../index";

describe("en.Weekday", () => {
  // Jan 6, 2016 is Wednesday (weekday 3)
  const fixtures = [
    { text: "past Friday", index: 0, phrase: "past Friday", diff: -5 * DAY }, // Back to Friday Jan 1
    { text: "past tuesday", index: 0, phrase: "past tuesday", diff: -DAY }, // Back to Tuesday Jan 5
    { text: "next Friday", index: 0, phrase: "next Friday", diff: 2 * DAY }, // Forward to Friday Jan 8
    { text: "next tuesday", index: 0, phrase: "next tuesday", diff: 6 * DAY }, // Forward to Tuesday Jan 12
    { text: "this Friday", index: 0, phrase: "this Friday", diff: 2 * DAY },
    { text: "this tuesday", index: 0, phrase: "this tuesday", diff: -DAY },
    { text: "Friday", index: 0, phrase: "Friday", diff: 2 * DAY },
    { text: "tuesday", index: 0, phrase: "tuesday", diff: -DAY },
    { text: "Monday", index: 0, phrase: "Monday", diff: -2 * DAY },
    { text: "saturday", index: 0, phrase: "saturday", diff: 3 * DAY },
    { text: "sunday", index: 0, phrase: "sunday", diff: -3 * DAY },
  ];

  const parse = when.create({ rules: [weekday("skip")] });
  applyFixtures("en.Weekday", parse, fixtures, EN_NULL_TIME);
});
```

**File**: `src/rules/en/__tests__/pastTime.test.ts`
```typescript
import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, SECOND, MINUTE, HOUR, DAY, WEEK } from "../../../test-utils";
import { when } from "../../../index";
import { pastTime } from "../index";

describe("en.PastTime", () => {
  const fixtures = [
    { text: "5 minutes ago", index: 0, phrase: "5 minutes ago", diff: -5 * MINUTE },
    { text: "5 min ago", index: 0, phrase: "5 min ago", diff: -5 * MINUTE },
    { text: "5 hours ago", index: 0, phrase: "5 hours ago", diff: -5 * HOUR },
    { text: "5 days ago", index: 0, phrase: "5 days ago", diff: -5 * DAY },
    { text: "a week ago", index: 0, phrase: "a week ago", diff: -WEEK },
    { text: "two weeks ago", index: 0, phrase: "two weeks ago", diff: -2 * WEEK },
    { text: "five weeks ago", index: 0, phrase: "five weeks ago", diff: -5 * WEEK },
    { text: "3 months ago", index: 0, phrase: "3 months ago", diff: -91 * DAY },
    { text: "a year ago", index: 0, phrase: "a year ago", diff: -365 * DAY },
    { text: "1 second ago", index: 0, phrase: "1 second ago", diff: -SECOND },
    { text: "a minute ago", index: 0, phrase: "a minute ago", diff: -MINUTE },
    { text: "an hour ago", index: 0, phrase: "an hour ago", diff: -HOUR },
    { text: "a day ago", index: 0, phrase: "a day ago", diff: -DAY },
  ];

  const parse = when.create({ rules: [pastTime("skip")] });
  applyFixtures("en.PastTime", parse, fixtures, EN_NULL_TIME);
});
```

**File**: `src/rules/en/__tests__/exactMonthDate.test.ts`
```typescript
import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, DAY } from "../../../test-utils";
import { when } from "../../../index";
import { exactMonthDate } from "../index";

describe("en.ExactMonthDate", () => {
  // Reference: Jan 6, 2016 (Wednesday)
  const fixtures = [
    { text: "January 3rd", index: 0, phrase: "January 3rd", diff: -3 * DAY }, // Jan 3 (past)
    { text: "January 8", index: 0, phrase: "January 8", diff: 2 * DAY }, // Jan 8 (future)
    { text: "Jan 8", index: 0, phrase: "Jan 8", diff: 2 * DAY },
    { text: "March 5", index: 0, phrase: "March 5", diff: 58 * DAY }, // ~2 months ahead
    { text: "march 5th", index: 0, phrase: "march 5th", diff: 58 * DAY },
    { text: "march fifth", index: 0, phrase: "march fifth", diff: 58 * DAY },
    { text: "march 5th 2017", index: 0, phrase: "march 5th 2017", diff: (365 + 58) * DAY },
    { text: "march 5 2017", index: 0, phrase: "march 5 2017", diff: (365 + 58) * DAY },
    { text: "mar. 5 2017", index: 0, phrase: "mar. 5 2017", diff: (365 + 58) * DAY },
    { text: "5 march", index: 0, phrase: "5 march", diff: 58 * DAY },
    { text: "5th march", index: 0, phrase: "5th march", diff: 58 * DAY },
    { text: "fifth of march", index: 0, phrase: "fifth of march", diff: 58 * DAY },
    { text: "5 of march", index: 0, phrase: "5 of march", diff: 58 * DAY },
    { text: "5th of march", index: 0, phrase: "5th of march", diff: 58 * DAY },
    { text: "the 5th of march", index: 4, phrase: "5th of march", diff: 58 * DAY },
    { text: "the fifth of march", index: 4, phrase: "fifth of march", diff: 58 * DAY },
    { text: "5th of march 2017", index: 0, phrase: "5th of march 2017", diff: (365 + 58) * DAY },
    { text: "the 5th of march 2017", index: 4, phrase: "5th of march 2017", diff: (365 + 58) * DAY },
    { text: "23 Sept. 2017", index: 0, phrase: "23 Sept. 2017", diff: (365 + 260) * DAY },
  ];

  const parse = when.create({ rules: [exactMonthDate("skip")] });
  applyFixtures("en.ExactMonthDate", parse, fixtures, EN_NULL_TIME);
});
```

**File**: `src/rules/en/__tests__/integration.test.ts`
```typescript
import { describe } from "bun:test";
import { applyFixtures, EN_NULL_TIME, HOUR, MINUTE, DAY } from "../../../test-utils";
import { when } from "../../../index";

describe("en.All Integration", () => {
  const fixtures = [
    { text: "tonight at 11:10 pm", index: 0, phrase: "tonight at 11:10 pm", diff: (23 * HOUR) + (10 * MINUTE) },
    { text: "at Friday afternoon", index: 3, phrase: "Friday afternoon", diff: ((2 * 24) + 15) * HOUR },
    { text: "in next tuesday at 14:00", index: 3, phrase: "next tuesday at 14:00", diff: ((6 * 24) + 14) * HOUR },
    { text: "in next tuesday at 2p", index: 3, phrase: "next tuesday at 2p", diff: ((6 * 24) + 14) * HOUR },
    { text: "in next wednesday at 2:25 p.m.", index: 3, phrase: "next wednesday at 2:25 p.m.", diff: (((7 * 24) + 14) * HOUR) + (25 * MINUTE) },
    { text: "at 11 am past tuesday", index: 3, phrase: "11 am past tuesday", diff: -13 * HOUR },
  ];

  // Uses pre-configured when.en parser
  applyFixtures("en.All", when.en, fixtures, EN_NULL_TIME);
});
```

#### 2. Common Test Files

**File**: `src/rules/common/__tests__/slashDMY.test.ts`
```typescript
import { describe } from "bun:test";
import { applyFixtures, applyFixturesNil, COMMON_NULL_TIME, DAY } from "../../../test-utils";
import { when } from "../../../index";
import { slashDMY } from "../index";

describe("common.SlashDMY", () => {
  // Reference: Jul 15, 2016 (Friday)
  const fixtures = [
    { text: "11/3/2015", index: 0, phrase: "11/3/2015", diff: -491 * DAY }, // Mar 11, 2015
    { text: "1/3/2016", index: 0, phrase: "1/3/2016", diff: -136 * DAY }, // Mar 1, 2016
    { text: "11/3", index: 0, phrase: "11/3", diff: 239 * DAY }, // Mar 11, 2017 (next year)
    { text: "11\\3", index: 0, phrase: "11\\3", diff: 239 * DAY }, // Backslash variant
    { text: "1/3", index: 0, phrase: "1/3", diff: 229 * DAY }, // Mar 1, 2017
    { text: "31/12/2016", index: 0, phrase: "31/12/2016", diff: 169 * DAY }, // Dec 31, 2016
    { text: "31/12", index: 0, phrase: "31/12", diff: 169 * DAY },
    { text: "29/2/2016", index: 0, phrase: "29/2/2016", diff: -137 * DAY }, // Feb 29, 2016 (leap year)
  ];

  const nilFixtures = [
    { text: "30/2/2016", index: 0, phrase: "", diff: 0 }, // Invalid date
  ];

  const parse = when.create({ rules: [slashDMY("skip")] });

  applyFixtures("common.SlashDMY", parse, fixtures, COMMON_NULL_TIME);
  applyFixturesNil("common.SlashDMY nil", parse, nilFixtures, COMMON_NULL_TIME);
});
```

### Remaining Test Files (Summary)

Create similar test files for:
- `src/rules/br/__tests__/*.test.ts` - 8 test files (~68 cases)
- `src/rules/nl/__tests__/*.test.ts` - 8 test files (~96 cases)
- `src/rules/ru/__tests__/*.test.ts` - 8 test files (~91 cases)
- `src/rules/zh/__tests__/*.test.ts` - 6 test files (~61 cases)

Each follows the same pattern as the English tests, using the appropriate language constants and reference times.

### Success Criteria:

#### Automated Verification:
- [x] All test files exist in the correct locations
- [x] `bun test` runs (tests will fail - that's expected)
- [x] Test count matches Go implementation (~392 tests)

#### Manual Verification:
- [x] Test fixtures match Go test cases exactly
- [x] Reference times match Go implementations

**Implementation Note**: Tests will fail at this point. That's expected for TDD. Proceed to Phase 3.

---

## Phase 3: Core Types and Infrastructure

### Overview
Implement the core TypeScript types and classes that rules and parser depend on.

### Changes Required:

#### 1. Core Types
**File**: `src/types.ts`
```typescript
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

export interface When {
  en: ParseFn;
  br: ParseFn;
  nl: ParseFn;
  ru: ParseFn;
  zh: ParseFn;
  create: (config: ParserConfig) => ParseFn;
}

export type Applier = (
  match: Match,
  context: Context,
  options: Options,
  ref: Date
) => boolean;
```

#### 2. Match Class
**File**: `src/rules/match.ts`
```typescript
import type { Applier, Context, Options } from "../types";

export class Match {
  left: number = -1;
  right: number = 0;
  text: string = "";
  captures: string[] = [];
  order: number = 0;
  applier: Applier;

  constructor(applier: Applier) {
    this.applier = applier;
  }

  apply(context: Context, options: Options, ref: Date): boolean {
    return this.applier(this, context, options, ref);
  }

  toString(): string {
    return this.text;
  }
}
```

#### 3. Context Class
**File**: `src/rules/context.ts`
```typescript
export class Context {
  text: string = "";
  duration: number = 0; // milliseconds

  // Absolute values (null = not set)
  year: number | null = null;
  month: number | null = null;
  weekday: number | null = null;
  day: number | null = null;
  hour: number | null = null;
  minute: number | null = null;
  second: number | null = null;

  timezone: string | null = null;

  time(base: Date): Date {
    let t = new Date(base);

    if (t.getTime() === 0) {
      t = new Date();
    }

    if (this.duration !== 0) {
      t = new Date(t.getTime() + this.duration);
    }

    if (this.year !== null) {
      t = new Date(Date.UTC(
        this.year,
        t.getUTCMonth(),
        t.getUTCDate(),
        t.getUTCHours(),
        t.getUTCMinutes(),
        t.getUTCSeconds(),
        t.getUTCMilliseconds()
      ));
    }

    if (this.month !== null) {
      t = new Date(Date.UTC(
        t.getUTCFullYear(),
        this.month - 1, // JS months are 0-indexed
        t.getUTCDate(),
        t.getUTCHours(),
        t.getUTCMinutes(),
        t.getUTCSeconds(),
        t.getUTCMilliseconds()
      ));
    }

    if (this.weekday !== null) {
      const diff = this.weekday - t.getUTCDay();
      t = new Date(Date.UTC(
        t.getUTCFullYear(),
        t.getUTCMonth(),
        t.getUTCDate() + diff,
        t.getUTCHours(),
        t.getUTCMinutes(),
        t.getUTCSeconds(),
        t.getUTCMilliseconds()
      ));
    }

    if (this.day !== null) {
      t = new Date(Date.UTC(
        t.getUTCFullYear(),
        t.getUTCMonth(),
        this.day,
        t.getUTCHours(),
        t.getUTCMinutes(),
        t.getUTCSeconds(),
        t.getUTCMilliseconds()
      ));
    }

    if (this.hour !== null) {
      t = new Date(Date.UTC(
        t.getUTCFullYear(),
        t.getUTCMonth(),
        t.getUTCDate(),
        this.hour,
        t.getUTCMinutes(),
        t.getUTCSeconds(),
        t.getUTCMilliseconds()
      ));
    }

    if (this.minute !== null) {
      t = new Date(Date.UTC(
        t.getUTCFullYear(),
        t.getUTCMonth(),
        t.getUTCDate(),
        t.getUTCHours(),
        this.minute,
        t.getUTCSeconds(),
        t.getUTCMilliseconds()
      ));
    }

    if (this.second !== null) {
      t = new Date(Date.UTC(
        t.getUTCFullYear(),
        t.getUTCMonth(),
        t.getUTCDate(),
        t.getUTCHours(),
        t.getUTCMinutes(),
        this.second,
        t.getUTCMilliseconds()
      ));
    }

    return t;
  }
}
```

#### 4. Rule Factory
**File**: `src/rules/factory.ts`
```typescript
import type { Rule, Applier } from "../types";
import { Match } from "./match";

export function createRule(pattern: RegExp, applier: Applier): Rule {
  return {
    find(text: string): Match | null {
      const match = new Match(applier);
      const indexes = pattern.exec(text);

      if (!indexes || indexes.length <= 1) {
        return null;
      }

      // Process capture groups (skip full match at index 0)
      for (let i = 1; i < indexes.length; i++) {
        const capture = indexes[i];
        if (capture !== undefined) {
          if (match.left === -1) {
            match.left = text.indexOf(capture, indexes.index);
          }
          match.captures.push(capture);
          const captureEnd = text.indexOf(capture, indexes.index) + capture.length;
          if (captureEnd > match.right) {
            match.right = captureEnd;
          }
        } else {
          match.captures.push("");
        }
      }

      if (match.captures.length === 0 || match.left === -1) {
        return null;
      }

      match.text = text.slice(match.left, match.right);
      return match;
    }
  };
}
```

#### 5. Sorting Utilities
**File**: `src/rules/sort.ts`
```typescript
import type { Match } from "./match";

export function sortByIndex(matches: Match[]): Match[] {
  return [...matches].sort((a, b) => a.left - b.left);
}

export function sortByOrder(matches: Match[]): Match[] {
  return [...matches].sort((a, b) => a.order - b.order);
}
```

### Success Criteria:

#### Automated Verification:
- [x] `bun run typecheck` passes
- [x] Context.time() produces correct dates

#### Manual Verification:
- [x] Types match Go implementation semantics

---

## Phase 4: English Rules Implementation

### Overview
Implement all 8 English rules. After this phase, English tests should pass.

### Changes Required:

#### 1. Constants
**File**: `src/rules/en/constants.ts`
```typescript
export const WEEKDAY_OFFSET: Record<string, number> = {
  sunday: 0, sun: 0,
  monday: 1, mon: 1,
  tuesday: 2, tue: 2,
  wednesday: 3, wed: 3,
  thursday: 4, thur: 4, thu: 4,
  friday: 5, fri: 5,
  saturday: 6, sat: 6,
};

export const WEEKDAY_PATTERN = "(?:sunday|sun|monday|mon|tuesday|tue|wednesday|wed|thursday|thur|thu|friday|fri|saturday|sat)";

export const MONTH_OFFSET: Record<string, number> = {
  january: 1, jan: 1, "jan.": 1,
  february: 2, feb: 2, "feb.": 2,
  march: 3, mar: 3, "mar.": 3,
  april: 4, apr: 4, "apr.": 4,
  may: 5,
  june: 6, jun: 6, "jun.": 6,
  july: 7, jul: 7, "jul.": 7,
  august: 8, aug: 8, "aug.": 8,
  september: 9, sep: 9, "sep.": 9, sept: 9, "sept.": 9,
  october: 10, oct: 10, "oct.": 10,
  november: 11, nov: 11, "nov.": 11,
  december: 12, dec: 12, "dec.": 12,
};

export const MONTH_PATTERN = `(?:january|jan\\.?|february|feb\\.?|march|mar\\.?|april|apr\\.?|may|june|jun\\.?|july|jul\\.?|august|aug\\.?|september|sept?\\.?|october|oct\\.?|november|nov\\.?|december|dec\\.?)`;

export const INTEGER_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
  seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
};

export const INTEGER_WORDS_PATTERN = `(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)`;

export const ORDINAL_WORDS: Record<string, number> = {
  first: 1, "1st": 1,
  second: 2, "2nd": 2,
  third: 3, "3rd": 3,
  fourth: 4, "4th": 4,
  fifth: 5, "5th": 5,
  sixth: 6, "6th": 6,
  seventh: 7, "7th": 7,
  eighth: 8, "8th": 8,
  ninth: 9, "9th": 9,
  tenth: 10, "10th": 10,
  eleventh: 11, "11th": 11,
  twelfth: 12, "12th": 12,
  thirteenth: 13, "13th": 13,
  fourteenth: 14, "14th": 14,
  fifteenth: 15, "15th": 15,
  sixteenth: 16, "16th": 16,
  seventeenth: 17, "17th": 17,
  eighteenth: 18, "18th": 18,
  nineteenth: 19, "19th": 19,
  twentieth: 20, "20th": 20,
  "twenty first": 21, "twenty-first": 21, "21st": 21,
  "twenty second": 22, "twenty-second": 22, "22nd": 22,
  "twenty third": 23, "twenty-third": 23, "23rd": 23,
  "twenty fourth": 24, "twenty-fourth": 24, "24th": 24,
  "twenty fifth": 25, "twenty-fifth": 25, "25th": 25,
  "twenty sixth": 26, "twenty-sixth": 26, "26th": 26,
  "twenty seventh": 27, "twenty-seventh": 27, "27th": 27,
  "twenty eighth": 28, "twenty-eighth": 28, "28th": 28,
  "twenty ninth": 29, "twenty-ninth": 29, "29th": 29,
  thirtieth: 30, "30th": 30,
  "thirty first": 31, "thirty-first": 31, "31st": 31,
};

export const ORDINAL_WORDS_PATTERN = `(?:1st|first|2nd|second|3rd|third|4th|fourth|5th|fifth|6th|sixth|7th|seventh|8th|eighth|9th|ninth|10th|tenth|11th|eleventh|12th|twelfth|13th|thirteenth|14th|fourteenth|15th|fifteenth|16th|sixteenth|17th|seventeenth|18th|eighteenth|19th|nineteenth|20th|twentieth|21st|twenty[ -]first|22nd|twenty[ -]second|23rd|twenty[ -]third|24th|twenty[ -]fourth|25th|twenty[ -]fifth|26th|twenty[ -]sixth|27th|twenty[ -]seventh|28th|twenty[ -]eighth|29th|twenty[ -]ninth|30th|thirtieth|31st|thirty[ -]first)`;
```

#### 2. CasualDate Rule
**File**: `src/rules/en/casualDate.ts`
```typescript
import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export function casualDate(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  return createRule(
    /(?:\W|^)(now|today|tonight|last\s*night|(?:tomorrow|tmr|yesterday)\s*|tomorrow|tmr|yesterday)(?:\W|$)/i,
    (match, context, options, ref) => {
      const lower = match.text.toLowerCase().trim();

      if (lower.includes("tonight")) {
        if ((context.hour === null && context.minute === null) || overwrite) {
          context.hour = 23;
          context.minute = 0;
        }
      } else if (lower.includes("tomorrow") || lower.includes("tmr")) {
        if (context.duration === 0 || overwrite) {
          context.duration += DAY;
        }
      } else if (lower.includes("yesterday")) {
        if (context.duration === 0 || overwrite) {
          context.duration -= DAY;
        }
      } else if (lower.includes("last night")) {
        if ((context.hour === null && context.duration === 0) || overwrite) {
          context.hour = 23;
          context.duration -= DAY;
        }
      }
      // "today" and "now" don't modify anything

      return true;
    }
  );
}
```

#### 3. CasualTime Rule
**File**: `src/rules/en/casualTime.ts`
```typescript
import type { Rule, Strategy } from "../../types";
import { createRule } from "../factory";

export function casualTime(strategy: Strategy = "override"): Rule {
  const overwrite = strategy === "override";

  return createRule(
    /(?:\W|^)(this\s*)?(morning|noon|afternoon|evening)(?:\W|$)/i,
    (match, context, options, ref) => {
      const lower = match.text.toLowerCase().trim();

      if ((context.hour === null && context.minute === null) || overwrite) {
        if (lower.includes("morning")) {
          context.hour = options.morning ?? 8;
          context.minute = 0;
        } else if (lower.includes("noon")) {
          context.hour = options.noon ?? 12;
          context.minute = 0;
        } else if (lower.includes("afternoon")) {
          context.hour = options.afternoon ?? 15;
          context.minute = 0;
        } else if (lower.includes("evening")) {
          context.hour = options.evening ?? 18;
          context.minute = 0;
        }
        context.second = 0;
      }

      return true;
    }
  );
}
```

#### 4. Remaining English Rules
Implement similarly:
- `src/rules/en/hour.ts`
- `src/rules/en/hourMinute.ts`
- `src/rules/en/deadline.ts`
- `src/rules/en/pastTime.ts`
- `src/rules/en/exactMonthDate.ts`
- `src/rules/en/weekday.ts`

#### 5. English Index
**File**: `src/rules/en/index.ts`
```typescript
import type { Rule } from "../../types";
import { casualDate } from "./casualDate";
import { casualTime } from "./casualTime";
import { hour } from "./hour";
import { hourMinute } from "./hourMinute";
import { deadline } from "./deadline";
import { pastTime } from "./pastTime";
import { exactMonthDate } from "./exactMonthDate";
import { weekday } from "./weekday";

export { casualDate, casualTime, hour, hourMinute, deadline, pastTime, exactMonthDate, weekday };
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
```

### Success Criteria:

#### Automated Verification:
- [x] `bun test src/rules/en` - all ~67 English tests pass
- [x] `bun run typecheck` passes

#### Manual Verification:
- [x] Rule behavior matches Go implementation

**Implementation Note**: Complete English rules before proceeding. Verify all tests pass.

---

## Phase 5: Parser Implementation

### Overview
Implement the `createParser` function and main `when` object.

### Changes Required:

**File**: `src/parser.ts`
```typescript
import type { Rule, ParseResult, Options, ParserConfig, ParseFn } from "./types";
import { Context } from "./rules/context";
import { Match } from "./rules/match";
import { sortByIndex, sortByOrder } from "./rules/sort";

const DEFAULT_OPTIONS: Options = {
  distance: 5,
  matchByOrder: true,
};

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

    result.text = text.slice(result.index, end);

    // Apply rules
    const toApply = options.matchByOrder
      ? sortByOrder(clustered)
      : clustered;

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
```

**File**: `src/index.ts`
```typescript
import type { When, ParseFn, ParserConfig } from "./types";
import { createParser } from "./parser";
import * as en from "./rules/en";
import * as br from "./rules/br";
import * as nl from "./rules/nl";
import * as ru from "./rules/ru";
import * as zh from "./rules/zh";
import * as common from "./rules/common";

// Re-export types and utilities
export type { Rule, ParseResult, ParseFn, Options, ParserConfig, Strategy, Applier } from "./types";
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

// Main when object
export const when: When = {
  en: enParser,
  br: brParser,
  nl: nlParser,
  ru: ruParser,
  zh: zhParser,
  create: createParser,
};
```

### Success Criteria:

#### Automated Verification:
- [x] `bun test src/rules/en` - all English tests pass
- [x] `bun test src/rules/common` - all common tests pass
- [x] Parser clusters matches correctly
- [x] Middleware support works

#### Manual Verification:
- [x] `when.en("tomorrow at 5pm")` returns correct result
- [x] `when.create({ rules: [...] })` returns working parse function

---

## Phase 6: Remaining Language Packs

### Overview
Implement remaining language packs: BR, NL, RU, ZH.

### Changes Required:

For each language, create:
1. `src/rules/{lang}/constants.ts` - Language-specific lookup tables
2. `src/rules/{lang}/*.ts` - Rule implementations (8 per language)
3. `src/rules/{lang}/index.ts` - Exports
4. Update `src/index.ts` to export pre-configured parsers

Follow the same patterns established in Phase 4.

### Success Criteria:

#### Automated Verification:
- [x] `bun test` - all ~392 tests pass
- [x] `bun run typecheck` passes
- [ ] `bun run build` succeeds

#### Manual Verification:
- [x] Each language parser works for sample inputs

---

## Phase 7: Documentation & Polish

### Overview
Final cleanup, documentation, and npm publishing preparation.

### Changes Required:

1. Update `README.md` with TypeScript usage examples
2. Add JSDoc comments to public API
3. Create `CHANGELOG.md`
4. Verify `package.json` exports are correct
5. Add `.npmignore` to exclude test files

### Success Criteria:

#### Automated Verification:
- [ ] `bun test` - all tests pass
- [ ] `bun run build` - builds successfully
- [ ] Package can be imported in a test project

#### Manual Verification:
- [ ] README examples work
- [ ] TypeScript types are correctly inferred

---

## Testing Strategy

### Unit Tests
- Each rule has dedicated test file
- Tests use fixture pattern from Go implementation
- Reference times match Go tests exactly

### Integration Tests
- `integration.test.ts` in each language tests all rules together
- Complex parsing scenarios tested

### Manual Testing
1. Run `bun test` to verify all tests pass
2. Test edge cases interactively with REPL
3. Compare outputs with Go implementation for sample inputs

## Performance Considerations

- Regex patterns are compiled once per rule instantiation
- Matches are sorted efficiently using native array sort
- Context avoids unnecessary Date object creation

## Migration Notes

- No data migration needed (new project)
- Go library remains unchanged; this is a parallel implementation

## References

- Original Go implementation: `/Users/mark/dev/when/when.go`
- Rule interface: `/Users/mark/dev/when/rules/rules.go`
- Context implementation: `/Users/mark/dev/when/rules/context.go`
- English rules: `/Users/mark/dev/when/rules/en/`
- Test patterns: `/Users/mark/dev/when/rules/en/en_test.go`
