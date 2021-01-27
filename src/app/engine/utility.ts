export const rangeGenerator = (start: number, end: number) => {
    let result: number[] = [];
    for (let i = start; i + 1 < end; i++) {
      result.push(i);
    }

    return result;
  }