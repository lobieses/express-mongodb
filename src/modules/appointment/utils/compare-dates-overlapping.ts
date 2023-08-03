export const compareDatesOverlapping = (
  date: { from: string; to: string },
  list: { from: string; to: string }[],
): number[] => {
  const convertedDateForCompare = list.map((currItem) => {
    return [new Date(currItem.from), new Date(currItem.to)];
  });
  const baseDate = [new Date(date.from), new Date(date.to)];

  let count = [];
  for (let i = 0; i < convertedDateForCompare.length; i++) {
    if (
      //@ts-ignore
      Math.max(baseDate[0], convertedDateForCompare[i][0]) <
      //@ts-ignore
      Math.min(baseDate[1], convertedDateForCompare[i][1])
    ) {
      count.push(i);
    }
  }

  return count;
};
