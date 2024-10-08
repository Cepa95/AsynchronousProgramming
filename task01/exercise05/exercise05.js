function checkCalledTimes(rememberArray, parametar) {
  rememberArray.push(parametar);
  return rememberArray;
}

let rememberArray = [];
rememberArray = checkCalledTimes(rememberArray, "prvi poziv");
rememberArray = checkCalledTimes(rememberArray, "drugi poziv");
rememberArray = checkCalledTimes(rememberArray, "treci poziv");
console.log(rememberArray.length);
