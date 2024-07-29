// FormatAmount.js

export function formatAmount(amount, decimalPlaces = 2) {
  const formattedNumber = parseFloat(amount).toFixed(decimalPlaces);
  const parts = formattedNumber.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
