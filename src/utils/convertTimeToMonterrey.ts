import { toZonedTime, format } from 'date-fns-tz';

export const convertTimeToMonterrey = (date: Date): Date => {
  const timeZone = 'America/Monterrey';
  const monterreyDate = toZonedTime(date, timeZone);
  return new Date(format(monterreyDate, "yyyy-MM-dd'T'HH:mm:ssXXX")); // Formato ISO válido
};