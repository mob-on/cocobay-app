const assignExisting = <T extends object>(
  to: T,
  from: Partial<T>
): T => {
  const out = { ...to };
  for (const key in from) {
    if (from[key]) {
      out[key] = from[key];
    }
  }
  return out;
};

export default assignExisting;