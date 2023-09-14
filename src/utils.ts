export const quickSort = (arr: number[]): number[] => {
  if (arr.length <= 1) {
    return arr;
  }

  let pivot = arr[0];
  let leftArr: number[] = [];
  let rightArr: number[] = [];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      leftArr.push(arr[i]);
    } else {
      rightArr.push(arr[i]);
    }
  }

  return [...quickSort(leftArr), pivot, ...quickSort(rightArr)];
};
