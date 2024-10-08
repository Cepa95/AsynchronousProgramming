function filterAndSortNumbers(numbers) {
  const evenNumbers = [];
  const oddNumbers = [];

  for (let i = 0; i < numbers.length; i++) {
    numbers[i] % 2 === 0
      ? evenNumbers.push(numbers[i])
      : oddNumbers.push(numbers[i]);
  }

  evenNumbers.sort((a, b) => a - b);
  oddNumbers.sort((a, b) => a - b);

  return {
    evenNumbers,
    oddNumbers,
  };
}

const array = [5, 3, 8, 6, 2, 7, 4, 1];
const result = filterAndSortNumbers(array);
console.log(result.evenNumbers);
console.log(result.oddNumbers);
