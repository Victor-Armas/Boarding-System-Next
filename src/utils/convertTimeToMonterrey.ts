import { toZonedTime, format } from 'date-fns-tz';

export const convertTimeToMonterrey = (date: Date): string => {
  const timeZone = 'America/Monterrey';
  const monterreyDate = toZonedTime(date, timeZone);
  return format(monterreyDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");
};