export function capitaliseFirstLetter(word: string): string {
  return word[0].toUpperCase() + word.slice(1);
}

export function convertToCurrency(number: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
}
