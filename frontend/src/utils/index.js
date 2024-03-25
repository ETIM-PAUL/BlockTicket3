export const shortenAddress = (address) => {
  const start = address.substring(0, 4);
  const end = address.slice(-6);
  return `${start}...${end}`;
};
