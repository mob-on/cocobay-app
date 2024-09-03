/**
 * Takes a number and returns a string that is either the number itself
 * or the number formatted with one of the following suffixes:
 * - 'B' for billions
 * - 'M' for millions
 * - 'K' for thousands
 * The suffix is chosen based on the number. If the number is less than 1000,
 * the number itself is returned.
 * @param {number} num - The number to format
 * @returns {string} The formatted string
 */
const numberTransform = (num: number): string => {
  if (num < 1000) return num.toString();

  const billions = num / 1000000000;
  if (billions >= 1) return `${Math.floor(billions)}B`;

  const millions = num / 1000000;
  if (millions >= 1) return `${millions.toFixed(2).replace(/\.00$/, "")}M`;

  const thousands = num / 1000;
  return `${thousands.toFixed(2).replace(/\.00$/, "")}K`;
};

export default numberTransform;
