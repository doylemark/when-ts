import type { Applier, Options } from "../types";
import type { Context } from "./context";

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
