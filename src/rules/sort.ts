import type { Match } from "./match";

export function sortByIndex(matches: Match[]): Match[] {
  return [...matches].sort((a, b) => a.left - b.left);
}

export function sortByOrder(matches: Match[]): Match[] {
  return [...matches].sort((a, b) => a.order - b.order);
}
