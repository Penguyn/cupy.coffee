/**
 * "Is the shop open at this instant?" — pure time logic with no DOM, so it can be unit-tested in plain Node.
 *
 * The opening hours are written in the shop's own timezone, so the visitor's clock and timezone are never
 * consulted. An instant is converted to the shop's timezone with Intl, which also yields the weekday *there*:
 * a visitor in New York on Saturday evening is already in Sunday in Tbilisi.
 *
 * Each entry covers a single calendar day: `opens` is inclusive, `closes` exclusive (open at 10:00:00, closed
 * at 21:00:00). Hours that run past midnight are not supported.
 */
import type { Weekday } from '@/content/site';

export type OpeningHours = { day: Weekday; opens: string; closes: string };

const MINUTE_MS = 60_000;

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string) {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    // `hourCycle: 'h23'` rather than `hour12: false`: the latter renders midnight as "24" in some engines.
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
    });
    formatters.set(timeZone, formatter);
  }
  return formatter;
}

/** The weekday and minutes-since-midnight that `instant` has on the wall clock of `timeZone`. */
export function clockIn(timeZone: string, instant: Date | number) {
  const parts = formatterFor(timeZone).formatToParts(instant);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';

  return {
    // "Mon" -> 'mon', which is exactly the Weekday spelling.
    day: value('weekday').slice(0, 3).toLowerCase() as Weekday,
    // `% 24` is a second guard against engines that still emit "24" for midnight.
    minutes: (Number(value('hour')) % 24) * 60 + Number(value('minute')),
  };
}

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export function isOpenAt(instant: Date | number, hours: readonly OpeningHours[], timeZone: string) {
  const { day, minutes } = clockIn(timeZone, instant);
  return hours.some((entry) => entry.day === day && minutes >= toMinutes(entry.opens) && minutes < toMinutes(entry.closes));
}

/**
 * Milliseconds from `now` (epoch ms) to the next whole minute, always in (0, 60000]. Every IANA offset is a
 * whole number of minutes, so epoch minutes line up with the wall-clock minutes of any timezone.
 */
export function msUntilNextMinute(now: number) {
  return MINUTE_MS - (now % MINUTE_MS);
}
