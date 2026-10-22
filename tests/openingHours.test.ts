/**
 * Unit tests for the open/closed logic. Run with `npm test` (Node's built-in runner, no dependencies).
 *
 * Instants are written with an explicit offset (`+04:00` is Tbilisi) so each case is an unambiguous point in
 * time. Expected results come from the business rules written out below, not from `site.hours`, so a mistake
 * in either the data or the logic fails a test.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { site } from '../src/content/site.ts';
import { clockIn, isOpenAt, msUntilNextMinute } from '../src/scripts/openingHours.ts';

const { hours, timeZone } = site;
const isOpen = (instant: string) => isOpenAt(new Date(instant), hours, timeZone);

// October 2026: Mon 19, Tue 20, Wed 21, Thu 22, Fri 23, Sat 24, Sun 25, Mon 26.

describe('weekdays (Mon–Fri 10:00–21:00)', () => {
  for (const [name, date] of [
    ['Monday', '2026-10-19'],
    ['Wednesday', '2026-10-21'],
    ['Friday', '2026-10-23'],
  ]) {
    it(`${name}: opens at exactly 10:00, closes at exactly 21:00`, () => {
      assert.equal(isOpen(`${date}T09:59:59.999+04:00`), false);
      assert.equal(isOpen(`${date}T10:00:00.000+04:00`), true);
      assert.equal(isOpen(`${date}T15:30:00.000+04:00`), true);
      assert.equal(isOpen(`${date}T20:59:59.999+04:00`), true);
      assert.equal(isOpen(`${date}T21:00:00.000+04:00`), false);
      assert.equal(isOpen(`${date}T23:30:00.000+04:00`), false);
    });
  }
});

describe('weekend (Sat–Sun 11:00–21:00)', () => {
  for (const [name, date] of [
    ['Saturday', '2026-10-24'],
    ['Sunday', '2026-10-25'],
  ]) {
    it(`${name}: opens at exactly 11:00, closes at exactly 21:00`, () => {
      assert.equal(isOpen(`${date}T10:00:00.000+04:00`), false, '10:00 is still closed at the weekend');
      assert.equal(isOpen(`${date}T10:59:59.999+04:00`), false);
      assert.equal(isOpen(`${date}T11:00:00.000+04:00`), true);
      assert.equal(isOpen(`${date}T20:59:59.999+04:00`), true);
      assert.equal(isOpen(`${date}T21:00:00.000+04:00`), false);
    });
  }

  it('uses the weekend schedule from Saturday on, not from Friday', () => {
    assert.equal(isOpen('2026-10-23T10:30:00+04:00'), true, 'Friday 10:30');
    assert.equal(isOpen('2026-10-24T10:30:00+04:00'), false, 'Saturday 10:30');
    assert.equal(isOpen('2026-10-25T10:30:00+04:00'), false, 'Sunday 10:30');
    assert.equal(isOpen('2026-10-26T10:30:00+04:00'), true, 'Monday 10:30');
  });
});

describe('midnight transitions', () => {
  it('stays closed across every midnight, including the Sunday -> Monday week rollover', () => {
    for (const [before, after] of [
      ['2026-10-18T23:59:59.999+04:00', '2026-10-19T00:00:00.000+04:00'], // Sun -> Mon
      ['2026-10-19T23:59:59.999+04:00', '2026-10-20T00:00:00.000+04:00'], // Mon -> Tue
      ['2026-10-23T23:59:59.999+04:00', '2026-10-24T00:00:00.000+04:00'], // Fri -> Sat
      ['2026-10-24T23:59:59.999+04:00', '2026-10-25T00:00:00.000+04:00'], // Sat -> Sun
      ['2026-10-25T23:59:59.999+04:00', '2026-10-26T00:00:00.000+04:00'], // Sun -> Mon
    ]) {
      assert.equal(isOpen(before), false, before);
      assert.equal(isOpen(after), false, after);
    }
  });

  it('reads midnight as 00:00 of the new day, never as 24:00', () => {
    assert.deepEqual(clockIn(timeZone, new Date('2026-10-20T00:00:00+04:00')), { day: 'tue', minutes: 0 });
    assert.deepEqual(clockIn(timeZone, new Date('2026-10-19T23:59:00+04:00')), { day: 'mon', minutes: 23 * 60 + 59 });
  });

  it('stays closed through the early hours and is still closed at 09:59 / 10:59 the same morning', () => {
    assert.equal(isOpen('2026-10-21T03:00:00+04:00'), false);
    assert.equal(isOpen('2026-10-24T09:00:00+04:00'), false);
  });
});

describe('Tbilisi time, not the visitor’s', () => {
  // Same instants, different weekday/time on the visitor's wall clock.
  it('Saturday evening in New York is already Sunday morning in Tbilisi: closed', () => {
    assert.equal(isOpen('2026-10-24T22:00:00-04:00'), false); // = Sun 06:00 Tbilisi
  });

  it('Friday 23:00 in Los Angeles is Saturday 10:00 in Tbilisi: still closed (weekend opens at 11:00)', () => {
    assert.equal(isOpen('2026-10-23T23:00:00-07:00'), false);
    assert.equal(isOpen('2026-10-24T00:00:00-07:00'), true); // = Sat 11:00 Tbilisi
  });

  it('London is on BST (+01:00) until 25 Oct, so Monday 07:00 there is 10:00 in Tbilisi: opening time', () => {
    assert.equal(isOpen('2026-10-19T06:59:00+01:00'), false); // = 09:59 Tbilisi
    assert.equal(isOpen('2026-10-19T07:00:00+01:00'), true); //  = 10:00 Tbilisi
  });

  it('a visitor already on Monday (Auckland) while Tbilisi is still Sunday night: closed', () => {
    assert.equal(isOpen('2026-10-26T08:00:00+13:00'), false); // = Sun 23:00 Tbilisi
  });

  it('gives identical answers whatever TZ the runtime itself is set to', (t) => {
    const probe = new Date('2026-01-01T12:00:00Z');
    const instants = [
      '2026-10-19T09:59:59.999+04:00',
      '2026-10-19T10:00:00+04:00',
      '2026-10-24T10:30:00+04:00',
      '2026-10-24T11:00:00+04:00',
      '2026-10-25T21:00:00+04:00',
      '2026-10-26T00:00:00+04:00',
    ].map((instant) => new Date(instant));
    const expected = instants.map((instant) => isOpenAt(instant, hours, timeZone));

    const original = process.env.TZ;
    t.after(() => {
      if (original === undefined) delete process.env.TZ;
      else process.env.TZ = original;
    });

    const localHours = new Set<number>();
    for (const tz of ['UTC', 'America/Los_Angeles', 'Pacific/Kiritimati', 'Pacific/Pago_Pago', 'Asia/Kathmandu']) {
      process.env.TZ = tz;
      localHours.add(probe.getHours());
      assert.deepEqual(
        instants.map((instant) => isOpenAt(instant, hours, timeZone)),
        expected,
        `runtime TZ=${tz}`,
      );
    }
    // The runtime's own clock really did move between zones, otherwise the loop above proves nothing.
    assert.equal(localHours.size, 5, 'process.env.TZ had no effect on this platform');
  });
});

describe('every minute of two weeks, against an independent oracle', () => {
  // Georgia has had no DST since 2005, so Tbilisi is a constant UTC+4: shift the instant and read UTC fields.
  const oracle = (instant: number) => {
    const shifted = new Date(instant + 4 * 3_600_000);
    const day = shifted.getUTCDay(); // 0 = Sunday
    const minutes = shifted.getUTCHours() * 60 + shifted.getUTCMinutes();
    const weekend = day === 0 || day === 6;
    return minutes >= (weekend ? 11 * 60 : 10 * 60) && minutes < 21 * 60;
  };

  it('matches for 20,160 consecutive minutes', () => {
    const start = Date.parse('2026-10-19T00:00:00+04:00');
    let openMinutes = 0;
    for (let minute = 0; minute < 14 * 24 * 60; minute++) {
      const instant = start + minute * 60_000;
      const expected = oracle(instant);
      if (expected) openMinutes++;
      assert.equal(isOpenAt(instant, hours, timeZone), expected, new Date(instant).toISOString());
    }
    // 10 weekdays x 11 h + 4 weekend days x 10 h
    assert.equal(openMinutes, (10 * 11 + 4 * 10) * 60);
  });
});

describe('msUntilNextMinute', () => {
  it('aims at the next :00 second and is always within (0, 60000]', () => {
    assert.equal(msUntilNextMinute(0), 60_000);
    assert.equal(msUntilNextMinute(1), 59_999);
    assert.equal(msUntilNextMinute(59_999), 1);
    assert.equal(msUntilNextMinute(60_000), 60_000);
    assert.equal(msUntilNextMinute(Date.parse('2026-10-19T20:59:30.250+04:00')), 29_750);
    for (let now = 1_760_000_000_000; now < 1_760_000_000_000 + 200_000; now += 137) {
      const wait = msUntilNextMinute(now);
      assert.ok(wait > 0 && wait <= 60_000);
      assert.equal((now + wait) % 60_000, 0);
    }
  });
});
