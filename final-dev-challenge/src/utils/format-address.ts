export const formatAddress = (address: string, charLength = 6) =>
  `${address.slice(0, charLength)} ... ${address.slice(
    address.length - charLength,
  )}`;
