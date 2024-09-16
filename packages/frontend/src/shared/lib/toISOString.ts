// JS Date doesn't have a method to convert itself to an ISO string with timezone offset,
// so the obvious way around it is to construct it manually. Another option would to use toISOString
// and add offset on top, but this solution is arguably more clear
// One can also use moment, but added complexity does not outweigh the benefits in this particular case
const toISOString = (date: Date): string => {
  // Timezone offset
  const offset = -date.getTimezoneOffset();
  const offsetSymbol = offset >= 0 ? "+" : "-";
  // add leading zero // 5 -> 05
  const pad = (num) => `${num < 10 ? "0" : ""}${num}`;

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const realDate = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
  const offsetMinutes = pad(Math.abs(offset) % 60);

  // construct full ISO date
  return `${year}-${month}-${realDate}T${hours}:${minutes}:${seconds}${offsetSymbol}${offsetHours}:${offsetMinutes}`;
};

export default toISOString;
