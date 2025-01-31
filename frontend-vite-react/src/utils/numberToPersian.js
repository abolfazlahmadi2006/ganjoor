export const numberToPersian = (num) => {
  if (num === null || num === undefined) return "";
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num
    .toString()
    .split("")
    .map((digit) => {
      if (digit === "-") return "/";
      return persianNumbers[parseInt(digit)] || digit;
    })
    .join("");
};

export function moneyFormat(number) {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const formattedNumber = (number * 1000)
    .toLocaleString()
    .toString()
    .replace(/\d/g, (digit) => persianDigits[digit]);
  return formattedNumber + " تومان";
}
