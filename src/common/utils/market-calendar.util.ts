import { DateTime } from 'luxon';

const MARKET_TIMEZONE = 'America/New_York';
const MARKET_OPEN_HOUR = 9;
const MARKET_OPEN_MINUTE = 30;
const MARKET_CLOSE_HOUR = 16;

export function getExecutionDate(): string {
  let now = DateTime.now().setZone(MARKET_TIMEZONE);

  if (isWeekend(now)) {
    now = getNextMonday(now);
  } else if (!isMarketOpen(now)) {
    if (isAfterMarketClose(now)) {
      now = getNextTradingDay(now);
    }
  }

  return now.toISODate();
}

function isWeekend(date: DateTime): boolean {
  return date.weekday === 6 || date.weekday === 7;
}

function isMarketOpen(date: DateTime): boolean {
  const hour = date.hour;
  const minute = date.minute;

  if (hour > MARKET_OPEN_HOUR && hour < MARKET_CLOSE_HOUR) {
    return true;
  }

  if (hour === MARKET_OPEN_HOUR && minute >= MARKET_OPEN_MINUTE) {
    return true;
  }

  return false;
}

function isAfterMarketClose(date: DateTime): boolean {
  return date.hour >= MARKET_CLOSE_HOUR;
}

function getNextTradingDay(date: DateTime): DateTime {
  const next = date.plus({ days: 1 });

  if (isWeekend(next)) {
    return getNextMonday(next);
  }

  return next;
}

function getNextMonday(date: DateTime): DateTime {
  let next = date;

  if (next.weekday === 6) {
    next = next.plus({ days: 2 });
  } else if (next.weekday === 7) {
    next = next.plus({ days: 1 });
  }

  return next;
}
