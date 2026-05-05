export const generateUniqueEmail = (prefix = "test"): string => {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `${prefix}+${timestamp}${randomSuffix}@example.com`;
};
