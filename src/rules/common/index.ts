import type { Rule } from "../../types";
import { slashDMY } from "./slashDMY";

export { slashDMY };

// Pre-configured rules with default "override" strategy
export const all: Rule[] = [slashDMY()];
