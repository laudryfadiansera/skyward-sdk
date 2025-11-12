/**
 * Mengkonversi Celsius ke Fahrenheit
 * @param celsius - Suhu dalam Celsius
 * @returns Suhu dalam Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Mengkonversi Fahrenheit ke Celsius
 * @param fahrenheit - Suhu dalam Fahrenheit
 * @returns Suhu dalam Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}
