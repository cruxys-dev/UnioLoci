export const responser = <T, D>(entries: T | null = null, meta?: D) => {
  return {
    success: true,
    entries,
    meta,
  };
};
