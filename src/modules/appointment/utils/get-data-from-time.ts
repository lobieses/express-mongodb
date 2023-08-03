export const getHour = (time: string) =>
  time.replace(/^(.[0-9]):.[0-9]$/, `$1`);

export const getMinutes = (time: string) =>
  time.replace(/^.[0-9]:(.[0-9])$/, `$1`);
