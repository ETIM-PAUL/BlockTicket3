export const shortenAddress = (address) => {
  const start = address.substring(0, 4);
  const end = address.slice(-6);
  return `${start}...${end}`;
};

export function minimumPrice(data) {
  const val = data.reduce((minAge, obj) => Math.min(minAge, obj.price), Infinity);
  return val;
}

export function isDateAheadBy24Hours(dateValue) {
  // Get the current time
  const currentDate = new Date();

  // Convert the input date string to a Date object
  const selectedDate = new Date(dateValue);

  // Calculate the difference in milliseconds
  const differenceInMs = selectedDate.getTime() - currentDate.getTime();

  // Check if the difference is at least 24 hours (24 hours = 86400000 milliseconds)
  return differenceInMs >= 86400000; // 24 hours in milliseconds
}