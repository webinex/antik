import dayjs, { Dayjs } from 'dayjs';
/**
 * Changes offset of date time to UTC and keeps local time
 * @param dateTime date time to change offset
 * @returns converted date time
 */
export function asUtc<T extends Dayjs | null | undefined>(dateTime: T): T {
  if (dateTime == null) return dateTime;

  const year = dateTime.get('year');
  const month = dateTime.get('month');
  const date = dateTime.get('date');
  const hours = dateTime.get('hours');
  const minutes = dateTime.get('minutes');
  const seconds = dateTime.get('seconds');
  const ms = dateTime.get('milliseconds');

  const newDateTime = Date.UTC(year, month, date, hours, minutes, seconds, ms);
  return dayjs(newDateTime) as T;
}
