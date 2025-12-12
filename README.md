# when-ts

> A natural language date/time parser for TypeScript with pluggable rules and merge strategies

This is a TypeScript port of the excellent [when](https://github.com/olebedev/when) Go library by [Oleg Lebedev](https://github.com/olebedev). Full credit goes to the original author and contributors for the design and rule implementations.

This port includes the full test suite of 500+ cases to ensure parity with the original library.

## Examples

```typescript
import { when } from "when-ts";

const tomorrowAt5 = when.en("maybe tomorrow at 5pm?");
console.log(tomorrowAt5)

// {
//   source: "maybe tomorrow at 5pm?",
//   time: 2025-12-13T17:00:00.018Z,
//   index: 0,
//   text: "tomorrow at 5pm",
// } 

const base = new Date("2024-01-15T10:00:00Z"); // base defaults to Date.now()
const lastWednesday = when.br("última quarta-feira", base);
```

## Installation

```bash
# Using bun
bun add when-ts

# using pnpm
pnpm install when-ts

# Using npm
npm install when-ts
```


### Supported Languages

```typescript
when.en("tomorrow at 5pm");           // English
when.br("amanhã às 17h");             // Brazilian Portuguese
when.nl("morgen om 17:00");           // Dutch
when.ru("завтра в 17:00");            // Russian
when.zh("明天下午5点");                // Chinese
```

### Custom Parser

Create a parser with specific rules, see the [API Reference](#api-reference) for available rules:

```typescript
import { when } from "when-ts";
import { casualDate, deadline } from "when-ts/rules/en";
import { slashDMY } from "when-ts/rules/common";

const custom = when.create({
  rules: [casualDate(), deadline(), slashDMY()]
});

custom("in 5 days");
```

### Distance Option

Control how far apart matches can be to be considered part of the same expression:

```typescript
import { when, createParser } from "when-ts";
import * as en from "when-ts/rules/en";
import * as common from "when-ts/rules/common";

// Default distance is 5 characters
// "February 23, 2019 | 1:46pm" - the "|" creates distance > 5

const parser = createParser({
  rules: [...en.all, ...common.all],
  options: {
    distance: 10,  // Allow larger gaps between matches
    matchByOrder: true
  }
});

parser("February 23, 2019 | 1:46pm");
```

## How It Works

The parser checks all rules against the input string. Each rule finds matches with specific boundaries (position and length). Rules that match within a configurable distance are clustered together:

```
on next wednesday at 2:25 p.m.
   └──────┬─────┘    └───┬───┘
       weekday      hour + minute
```

The cluster `"next wednesday at 2:25 p.m."` is extracted, and each rule is applied to build the final date/time.

### Strategies

Rules can use different merge strategies:
- **override** (default): Later rules overwrite earlier values
- **skip**: Skip if value already set
- **merge**: Combine values (not fully implemented in all rules)

## API Reference

### ParseResult

```typescript
interface ParseResult {
  index: number;    // Byte position in original string
  text: string;     // Matched text
  source: string;   // Original input string
  time: Date;       // Parsed date/time
}
```

### Options

```typescript
interface Options {
  distance?: number;      // Max gap between matches (default: 5)
  matchByOrder?: boolean; // Apply rules by match order (default: true)
  morning?: number;       // Hour for "morning" (default: 8)
  noon?: number;          // Hour for "noon" (default: 12)
  afternoon?: number;     // Hour for "afternoon" (default: 15)
  evening?: number;       // Hour for "evening" (default: 18)
}
```

### Creating Custom Rules

```typescript
import { createRule, type Strategy } from "when-ts";

function myRule(strategy: Strategy = "override") {
  return createRule(
    /pattern/i,
    (match, context, options, ref) => {
      // match.text - matched string
      // match.captures - regex capture groups
      // context - accumulates parsed values (hour, minute, day, etc.)
      // options - parser options
      // ref - reference date

      context.hour = 12;
      return true; // Return false to reject match
    }
  );
}
```

## Available Rules

### English (`when-ts/rules/en`)
- `casualDate` - today, tomorrow, yesterday, tonight
- `casualTime` - morning, noon, afternoon, evening
- `weekday` - Monday, next Tuesday, past Friday
- `hour` - 5pm, 11 A.M.
- `hourMinute` - 5:30pm, 14:25
- `deadline` - in 5 minutes, within 2 weeks
- `pastTime` - 5 minutes ago, 2 weeks ago
- `exactMonthDate` - March 5th, 15 January 2024

### Common (`when-ts/rules/common`)
- `slashDMY` - DD/MM/YYYY format

### Other Languages
Each language pack provides equivalent rules adapted to local patterns and vocabulary.

## Credits

This library is a TypeScript rewrite of [olebedev/when](https://github.com/olebedev/when), originally written in Go. The rule patterns, algorithms, and test cases are derived from the original project.

**Original Author:** [Oleg Lebedev](https://github.com/olebedev)

**Contributors to the Go version:**
- See [original contributors](https://github.com/olebedev/when/graphs/contributors)

## License

Apache-2.0
