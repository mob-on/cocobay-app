import type { Boost } from "../interfaces";

export const isBoostActive = (boost: Boost): boolean => {
  return (
    (boost.type === "claimable" &&
      boost.activeUntil &&
      boost.activeUntil > new Date()) ??
    false
  );
};
