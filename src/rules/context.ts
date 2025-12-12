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
        0 // Zero milliseconds when second is explicitly set
      ));
    }

    return t;
  }
}
