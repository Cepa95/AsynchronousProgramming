function arithmeticOperation(sign) {
  if (["+", "-", "*", "/"].includes(sign)) {
    return (firstNumber, secondNumber) => {
      switch (sign) {
        case "+":
          return firstNumber + secondNumber;
        case "-":
          return firstNumber - secondNumber;
        case "*":
          return firstNumber * secondNumber;
        case "/":
          return firstNumber / secondNumber;
        default:
          throw new Error("Invalid operation");
      }
    };
  } else {
    throw new Error("Invalid sign");
  }
}

const sign = "+";
console.log(arithmeticOperation(sign)(6, 2));
