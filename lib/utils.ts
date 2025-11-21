export const isEmptyOrWhitespace = (str: string) => {
  if (typeof str !== 'string') {
    return str === '' || str === null || str === undefined;
  }
  return str.replace(/\s/g, '').length === 0;
};
