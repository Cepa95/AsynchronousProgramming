function getAllTypes(arr) {
  let types = [];
  for (let i = 0; i < arr.length; i++) {
    types.push(typeof arr[i]);
  }
  return types;
}

let allTypesArray = [1, 1n, "string", true, null, undefined, {}, [], function () {}];
console.log(getAllTypes(allTypesArray));

