import type { Rule, Applier } from "../types";
import { Match } from "./match";

// Convert character index to byte index (for UTF-8)
function charIndexToByteIndex(text: string, charIndex: number): number {
  return Buffer.byteLength(text.substring(0, charIndex), "utf8");
}

export function createRule(pattern: RegExp, applier: Applier): Rule {
  // Add the 'd' flag to get indices if not already present
  const patternWithIndices = pattern.flags.includes("d")
    ? pattern
    : new RegExp(pattern.source, pattern.flags + "d");

  return {
    find(text: string): Match | null {
      const match = new Match(applier);
      const result = patternWithIndices.exec(text) as
        | (RegExpExecArray & { indices: Array<[number, number] | undefined> })
        | null;

      if (!result || result.length <= 1 || !result.indices) {
        return null;
      }

      // Track character indices for text extraction
      let leftCharIndex = -1;
      let rightCharIndex = 0;

      // Process capture groups (skip full match at index 0)
      for (let i = 1; i < result.length; i++) {
        const capture = result[i];
        const indices = result.indices[i];

        if (capture !== undefined && indices !== undefined) {
          if (leftCharIndex === -1) {
            leftCharIndex = indices[0];
            match.left = charIndexToByteIndex(text, indices[0]);
          }
          match.captures.push(capture);
          if (indices[1] > rightCharIndex) {
            rightCharIndex = indices[1];
            match.right = charIndexToByteIndex(text, indices[1]);
          }
        } else {
          match.captures.push("");
        }
      }

      if (match.captures.length === 0 || leftCharIndex === -1) {
        return null;
      }

      match.text = text.slice(leftCharIndex, rightCharIndex);
      return match;
    }
  };
}
