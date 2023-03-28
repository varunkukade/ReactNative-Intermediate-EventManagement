export type checkIfEmptyProps = boolean | object | string | number;
export const checkIfEmpty = <T extends checkIfEmptyProps>(value: T) => {
  if (!value) return true;
  else {
    //here value can be string/object/number
    if (value instanceof Object) {
      //if value is either object or array
      if (value instanceof Array) {
        //if value is array
        if (value.length === 0) return true;
        else return false;
      } else {
        //if value is object
        if (Object.keys(value).length === 0) return true;
        else return false;
      }
    } else return false; //if string/number exist return false
  }
};

export const generateArray = (n: number): number[] => {
  let arr = new Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = i;
  }
  return arr;
};
