function breakArray(array, sign) {
  const signArray = [];
  for (let i = 0; i < array.length; i++) {
    signArray.push(array[i].split(sign));
  }
  return signArray;
}

const array = ["pr, vi", "drugi", "tre, ci"];
const sign = ",";

console.log(breakArray(array, sign));

