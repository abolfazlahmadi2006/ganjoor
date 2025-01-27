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
