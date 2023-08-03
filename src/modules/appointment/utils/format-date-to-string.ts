import { format } from 'date-fns';

export const formatTimestampToString = (date: Date) => {
  return format(date, "yyyy-MM-dd'T'kk:mm");
};

export const formatDateToString = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};
