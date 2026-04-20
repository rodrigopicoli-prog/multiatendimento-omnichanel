export const nowIso = (): string => new Date().toISOString();

export const toBoolean = (value: string | undefined, fallback = false): boolean => {
  if (value === undefined) return fallback;
  return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
};
